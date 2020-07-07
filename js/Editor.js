/**
 * @author mrdoob / http://mrdoob.com/
 */

import { Player, Resources, Code, Animation, Timeline } from '../Frame.js';
import { Config } from './Config.js';

function Editor() {

	var Signal = signals.Signal;

	this.signals = {

		editorCleared: new Signal(),

		// scripts

		scriptAdded: new Signal(),
		scriptSelected: new Signal(),
		scriptChanged: new Signal(),
		scriptRemoved: new Signal(),
		scriptsCleared: new Signal(),

		// effects

		effectAdded: new Signal(),
		effectRenamed: new Signal(),
		effectRemoved: new Signal(),
		effectSelected: new Signal(),
		effectCompiled: new Signal(),

		// actions

		fullscreen: new Signal(),
		exportState: new Signal(),

		// animations

		animationRenamed: new Signal(),
		animationAdded: new Signal(),
		animationModified: new Signal(),
		animationRemoved: new Signal(),
		animationSelected: new Signal(),

		// curves

		curveAdded: new Signal(),

		// events

		playingChanged: new Signal(),
		playbackRateChanged: new Signal(),
		timeChanged: new Signal(),
		timelineScaled: new Signal(),

		windowResized: new Signal()

	};

	this.config = new Config();

	this.player = new Player();
	this.resources = new Resources();

	this.duration = 500;

	this.scripts = [];
	this.effects = [];
	this.timeline = new Timeline();

	this.selected = null;

	// signals

	var scope = this;

	this.signals.animationModified.add( function () {

		scope.timeline.reset();
		scope.timeline.sort();

		try {

			scope.timeline.update( scope.player.currentTime );

		} catch ( e ) {

			console.error( e );

		}

	} );

	this.signals.effectCompiled.add( function () {

		try {

			scope.timeline.update( scope.player.currentTime );

		} catch ( e ) {

			console.error( e );

		}

	} );

	this.signals.timeChanged.add( function () {

		try {

			scope.timeline.update( scope.player.currentTime );

		} catch ( e ) {

			console.error( e );

		}

	} );

	// Animate

	var prevTime = 0;

	function animate( time ) {

		scope.player.tick( time - prevTime );

		if ( scope.player.isPlaying ) {

			scope.signals.timeChanged.dispatch( scope.player.currentTime );

		}

		prevTime = time;

		requestAnimationFrame( animate );

	}

	requestAnimationFrame( animate );

};

Editor.prototype = {

	play: function () {

		this.player.play();
		this.signals.playingChanged.dispatch( true );

	},

	stop: function () {

		this.player.pause();
		this.signals.playingChanged.dispatch( false );

	},

	speedUp: function () {

		this.player.playbackRate += 0.1;
		this.signals.playbackRateChanged.dispatch( this.player.playbackRate );

	},

	speedDown: function () {

		this.player.playbackRate -= 0.1;
		this.signals.playbackRateChanged.dispatch( this.player.playbackRate );

	},

	setTime: function ( time ) {

		// location.hash = time;

		this.player.currentTime = Math.max( 0, time );
		this.signals.timeChanged.dispatch( this.player.currentTime );

	},

	// scripts

	addScript: async function ( script ) {

		try {

			await script.compile( this.resources, this.player );

		} catch ( e ) {

			console.error( e );

		}

		this.scripts.push( script );
		this.signals.scriptAdded.dispatch();

	},

	selectScript: function ( script ) {

		this.signals.scriptSelected.dispatch( script );

	},

	removeScript: function ( script ) {

		var index = this.scripts.indexOf( script );

		this.scripts.splice( index, 1 );
		this.signals.scriptRemoved.dispatch();

	},

	createScript: function () {

		this.scripts.push( new Code( { name: '', source: '' } ) );
		this.signals.scriptAdded.dispatch();

	},

	reloadScripts: async function () {

		this.signals.scriptsCleared.dispatch();

		const scripts = this.scripts;

		for ( let i = 0; i < scripts.length; i ++ ) {

			const script = scripts[ i ];

			try {

				await script.compile( this.resources, this.player );

			} catch ( e ) {

				console.error( e );

			}

		}

		const effects = this.effects;

		for ( let i = 0; i < effects.length; i ++ ) {

			const effect = effects[ i ];

			try {

				await effect.compile( this.resources, this.player );

			} catch ( e ) {

				console.error( e );

			}

		}

	},

	// effects

	addEffect: function ( effect ) {

		this.effects.push( effect );
		this.signals.effectAdded.dispatch( effect );

	},

	selectEffect: function ( effect ) {

		this.signals.effectSelected.dispatch( effect );

	},

	removeEffect: function ( effect ) {

		var index = this.effects.indexOf( effect );

		if ( index >= 0 ) {

			this.effects.splice( index, 1 );
			this.signals.effectRemoved.dispatch( effect );

		}

	},

	compileEffect: async function ( effect ) {

		try {

			await effect.compile( this.resources, this.player );

		} catch ( e ) {

			console.error( e );

		}

		this.signals.effectCompiled.dispatch( effect );

	},

	// Remove any effects that are not bound to any animations.

	cleanEffects: function () {

		var scope = this;
		var effects = this.effects.slice( 0 );
		var animations = this.timeline.animations;

		effects.forEach( function ( effect, i ) {

			var bound = false;

			for ( var j = 0; j < animations.length; j++ ) {

				var animation = animations[ j ];

				if ( animation.effect === effect ) {

					bound = true;
					break;

				}

			}

			if ( bound === false ) {

				scope.removeEffect( effect );

			}

		} );

	},

	// animations

	addAnimation: async function ( animation ) {

		var effect = animation.effect;

		if ( effect.program === null ) {

			await this.compileEffect( effect );

		}

		this.timeline.add( animation );
		this.signals.animationAdded.dispatch( animation );

	},

	selectAnimation: function ( animation ) {

		if ( this.selected === animation ) return;

		this.selected = animation;
		this.signals.animationSelected.dispatch( animation );

	},

	removeAnimation: function ( animation ) {

		this.timeline.remove( animation );
		this.signals.animationRemoved.dispatch( animation );

	},

	createAnimation: function ( start, end, layer ) {

		var effect = new Code( { name: 'Effect' } );
		this.addEffect( effect );

		var animation = new Animation( { name: 'Animation', start: start, end: end, layer: layer, effect: effect } );
		this.addAnimation( animation );

	},

	duplicateAnimation: function ( animation ) {

		var offset = animation.end - animation.start;

		var duplicate = new Animation( {
			name: animation.name,
			start: animation.start + offset,
			end: animation.end + offset,
			layer: animation.layer,
			effect: animation.effect
		} );

		this.addAnimation( duplicate );
		this.selectAnimation( duplicate );

	},

	/*

	addCurve: function ( curve ) {

		this.timeline.curves.push( curve );
		this.signals.curveAdded.dispatch( curve );

	},

	*/

	clear: function () {

		this.player.setAudio( null );

		this.scripts = [];
		this.effects = [];

		while ( this.timeline.animations.length > 0 ) {

			this.removeAnimation( this.timeline.animations[ 0 ] );

		}

		this.timeline.reset();

		this.signals.editorCleared.dispatch();

	},

	fromJSON: async function ( json ) {

		var scope = this;

		var scripts = json.scripts;

		if ( scripts === undefined ) {

			console.warn( 'Editor: Converting legacy includes to scripts.' );
			scripts = json.includes;

		}

		for ( var i = 0, l = scripts.length; i < l; i ++ ) {

			var data = scripts[ i ];

			if ( Array.isArray( data ) ) {

				console.warn( 'Editor: Converting legacy Code format:', data );
				data = { name: data[ 0 ], source: data[ 1 ] };

			}

			if ( Array.isArray( data.source ) ) data.source = data.source.join( '\n' );

			await scope.addScript( new Code( data ) );

		}

		const effects = json.effects;

		for ( let i = 0, l = effects.length; i < l; i ++ ) {

			let data = effects[ i ];

			if ( Array.isArray( data ) ) {

				console.warn( 'Editor: Converting legacy Code format:', data );
				data = { name: data[ 0 ], source: data[ 1 ] };

			}

			if ( Array.isArray( data.source ) ) data.source = data.source.join( '\n' );

			scope.addEffect( new Code( data ) );

		}

		const animations = json.animations;

		for ( let i = 0, l = animations.length; i < l; i ++ ) {

			let data = animations[ i ];

			if ( Array.isArray( data ) ) {

				console.warn( 'Editor: Converting legacy Animation format:', data );
				data = { name: data[ 0 ], start: data[ 1 ], end: data[ 2 ], layer: data[ 3 ], effectId: data[ 4 ], enabled: data[ 5 ] };

			}

			data.effect = scope.effects[ data.effectId ];

			await scope.addAnimation( new Animation( data ) );

		}

		scope.setTime( 0 );

	},

	toJSON: function () {

		var json = {
			"config": {},
			"scripts": [],
			"effects": [],
			// "curves": [],
			"animations": []
		};

		/*
		// curves

		var curves = this.timeline.curves;

		for ( var i = 0, l = curves.length; i < l; i ++ ) {

			var curve = curves[ i ];

			if ( curve instanceof Curves.Linear ) {

				json.curves.push( [ 'linear', curve.points ] );

			}

		}
		*/

		// scripts

		var scripts = this.scripts;

		for ( var i = 0, l = scripts.length; i < l; i ++ ) {

			var script = scripts[ i ];
			json.scripts.push( script.serialise() );

		}

		// effects

		var effects = this.effects;

		for ( var i = 0, l = effects.length; i < l; i ++ ) {

			var effect = effects[ i ];
			json.effects.push( effect.serialise() );

		}

		// animations

		var animations = this.timeline.animations;

		for ( var i = 0, l = animations.length; i < l; i ++ ) {

			var animation = animations[ i ];
			json.animations.push( animation.serialise( effects ) );

		}

		return json;

	}

}

export { Editor };
