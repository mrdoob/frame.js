/**
 * @author mrdoob / http://mrdoob.com/
 */

const	VERSION = 5;

const FRAME = {

	Parameters: {

		Boolean: function ( name, value ) {
			this.name = name;
			this.value = value !== undefined ? value : true;
			this.isBoolean = true;
		},

		Color: function ( name, value ) {
			this.name = name;
			this.value = value !== undefined ? value : 0xffffff;
			this.isColor = true;
		},

		Float: function ( name, value, min, max ) {
			this.name = name;
			this.value = value || 0.0;
			this.min = min !== undefined ? min : - Infinity;
			this.max = max !== undefined ? max : Infinity;
			this.isFloat = true;
		},

		Integer: function ( name, value, min, max ) {
			this.name = name;
			this.value = value || 0;
			this.min = min !== undefined ? min : - Infinity;
			this.max = max !== undefined ? max : Infinity;
			this.isInteger = true;
		},

		String: function ( name, value ) {
			this.name = name;
			this.value = value !== undefined ? value : '';
			this.isString = true;
		},

		Vector2: function ( name, value ) {
			this.name = name;
			this.value = value !== undefined ? value : [ 0, 0 ];
			this.isVector2 = true;
		},

		Vector3: function ( name, value ) {
			this.name = name;
			this.value = value !== undefined ? value : [ 0, 0, 0 ];
			this.isVector3 = true;
		}

	}

};

function Player() {

	let audio = null;

	let isPlaying = false;

	let currentTime = 0;
	let playbackRate = 1;

	let loop = null;

	return {
		get isPlaying() {
			return isPlaying;
		},
		get currentTime() {
			if ( audio ) return audio.currentTime;
			return currentTime;
		},
		set currentTime( value ) {
			if ( audio ) audio.currentTime = value;
			currentTime = value;
		},
		get playbackRate() {
			if ( audio ) return audio.playbackRate;
			return playbackRate;
		},
		set playbackRate( value ) {
			playbackRate = value;
			if ( audio ) audio.playbackRate = value;
		},
		getAudio: function () {
			return audio;
		},
		setAudio: function ( value ) {
			if ( audio ) audio.pause();
			if ( value ) {
				value.currentTime = currentTime;
				if ( isPlaying ) value.play();
			}
			audio = value;
		},
		getLoop: function () {
			return loop;
		},
		setLoop: function ( value ) {
			loop = value;
		},
		play: function () {
			if ( audio ) audio.play();
			isPlaying = true;
		},
		pause: function () {
			if ( audio ) audio.pause();
			isPlaying = false;
		},
		tick: function ( delta ) {
			if ( audio ) {
				currentTime = audio.currentTime;
			} else if ( isPlaying ) {
				currentTime += ( delta / 1000 ) * playbackRate;
			}
			if ( loop ) {
				if ( currentTime > loop[ 1 ] ) currentTime = loop[ 0 ];
			}
		}

	}

}

function Resources() {

	const resources = {};

	return {

		get: function ( name ) {

			return resources[ name ];

		},

		set: function ( name, resource ) {

			resources[ name ] = resource;

		}

	}

}

/*
Curves: {

	Linear: function ( points ) {

		function linear( p0, p1, t0, t1, t ) {

			return ( p1 - p0 ) * ( ( t - t0 ) / ( t1 - t0 ) ) + p0;

		}

		this.points = points;
		this.value = 0;

		this.update = function ( time ) {

			if ( time <= points[ 0 ] ) {

				this.value = points[ 1 ];

			} else if ( time >= points[ points.length - 2 ] ) {

				this.value = points[ points.length - 1 ];

			} else {

				for ( var i = 0, l = points.length; i < l; i += 2 ) {

					if ( time < points[ i + 2 ] ) {

						this.value = linear( points[ i + 1 ], points[ i + 3 ], points[ i ], points[ i + 2 ], time );
						break;

					}

				}

			}

		};

	},

	Sin: function () {

		var frequency = 10;

		this.value = 0;

		this.update = function ( time ) {

			this.value = Math.sin( time * frequency );

		};

	},

	Saw: function ( frequency, offset, min, max ) {

		var delta = max - min;

		this.frequency = frequency;
		this.offset = offset;
		this.min = min;
		this.max = max;
		this.value = 0;

		this.update = function ( time ) {

			this.value = ( ( ( time - offset ) % frequency ) / frequency ) * delta + min;

		};

	}

},
*/

function Effect( name, source ) {

	this.name = name;
	this.source = source || 'var parameters = {\n\tvalue: new FRAME.Parameters.Float( \'Value\', 1.0 )\n};\n\nfunction start(){}\n\nfunction end(){}\n\nfunction update( progress ){}';
	this.program = null;
	this.compile = function ( resources, player ) {

		this.program = ( new Function( 'FRAME, resources, player, parameters, start, end, update', this.source + '\nreturn { parameters: parameters, start: start, end: end, update: update };' ) )( FRAME, resources, player );

	};

}

let animationId = 0;

function Animation( name, start, end, layer, effect, enabled ) {

	if ( enabled === undefined ) enabled = true; // TODO remove this

	this.id = animationId ++;
	this.name = name;
	this.start = start;
	this.end = end;
	this.layer = layer;
	this.effect = effect;
	this.enabled = enabled;

	// this.serialise = function () {};

}

function Timeline() {

	const includes = [];
	const effects = [];

	const animations = [];
	const curves = [];

	const active = [];

	let next = 0;
	let prevtime = 0;

	function layerSort( a, b ) { return a.layer - b.layer; }
	function startSort( a, b ) { return a.start === b.start ? layerSort( a, b ) : a.start - b.start; }

	function loadFile( url, onLoad ) {

		const request = new XMLHttpRequest();
		request.open( 'GET', url, true );
		request.addEventListener( 'load', function ( event ) {

			onLoad( event.target.response );

		} );
		request.send( null );

	}

	return {

		animations: animations,
		curves: curves,

		load: function ( url, onLoad ) {

			const scope = this;

			loadFile( url, function ( text ) {

				scope.parse( JSON.parse( text ), onLoad );

			} );

		},

		loadLibraries: function ( libraries, onLoad ) {

			let count = 0;

			function loadNext() {

				if ( count === libraries.length ) {

					onLoad();
					return;

				}

				const url = libraries[ count ++ ];

				loadFile( url, function ( content ) {

					const script = document.createElement( 'script' );
					script.id = 'library-' + count;
					script.textContent = '( function () { ' + content + '} )()';
					document.head.appendChild( script );

					loadNext();

				} );


			}

			loadNext();

		},

		parse: function ( json, onLoad ) {

			const scope = this;

			const libraries = json.libraries || [];

			this.loadLibraries( libraries, function () {

				// Includes

				for ( let i = 0; i < json.includes.length; i ++ ) {

					const data = json.includes[ i ];
					const name = data[ 0 ];
					const source = data[ 1 ];

					if ( Array.isArray( source ) ) source = source.join( '\n' );

					includes.push( new Effect( name, source ) );

				}

				// Effects

				for ( let i = 0; i < json.effects.length; i ++ ) {

					const data = json.effects[ i ];

					const name = data[ 0 ];
					const source = data[ 1 ];

					if ( Array.isArray( source ) ) source = source.join( '\n' );

					effects.push( new Effect( name, source ) );

				}

				for ( let i = 0; i < json.animations.length; i ++ ) {

					const data = json.animations[ i ];

					const animation = new Animation(
						data[ 0 ],
						data[ 1 ],
						data[ 2 ],
						data[ 3 ],
						effects[ data[ 4 ] ],
						data[ 5 ]
					);

					animations.push( animation );

				}

				scope.sort();

				if ( onLoad ) onLoad();

			} );

		},

		compile: function ( resources, player ) {

			const animations = this.animations;

			for ( let i = 0, l = includes.length; i < l; i++ ) {

				const include = includes[ i ];

				if ( include.program === null ) {

					include.compile( resources, player );

				}

			}

			for ( let i = 0, l = animations.length; i < l; i ++ ) {

				const animation = animations[ i ];

				if ( animation.effect.program === null ) {

					animation.effect.compile( resources, player );

				}

			}

		},

		add: function ( animation ) {

			animations.push( animation );
			this.sort();

		},

		remove: function ( animation ) {

			const i = animations.indexOf( animation );

			if ( i !== -1 ) {

				animations.splice( i, 1 );

			}

		},

		sort: function () {

			animations.sort( startSort );

		},

		update: function ( time ) {

			if ( prevtime > time ) {

				this.reset();

			}

			// add to active

			while ( animations[ next ] ) {

				const animation = animations[ next ];

				if ( animation.enabled ) {

					if ( animation.start > time ) break;

					if ( animation.end > time ) {

						if ( animation.effect.program.start ) {

							animation.effect.program.start();

						}

						active.push( animation );

					}

				}

				next ++;

			}

			// remove from active

			let i = 0;

			while ( active[ i ] ) {

				const animation = active[ i ];

				if ( animation.start > time || animation.end < time ) {

					if ( animation.effect.program.end ) {

						animation.effect.program.end();

					}

					active.splice( i, 1 );

					continue;

				}

				i ++;

			}

			/*
			// update curves

			for ( var i = 0, l = curves.length; i < l; i ++ ) {

				curves[ i ].update( time, time - prevtime );

			}
			*/

			// render

			active.sort( layerSort );

			for ( let i = 0, l = active.length; i < l; i ++ ) {

				const animation = active[ i ];
				animation.effect.program.update( ( time - animation.start ) / ( animation.end - animation.start ), time - prevtime );

			}

			prevtime = time;

		},

		reset: function () {

			while ( active.length ) {

				const animation = active.pop();
				const program = animation.effect.program;

				if ( program.end ) program.end();

			}

			next = 0;

		}

	};

}

export { Player, Resources, Effect, Animation, Timeline };
