/**
 * @author mrdoob / http://mrdoob.com/
 */

if ( 'AsyncFunction' in window === false ) {
	window.AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
}

const VERSION = 6;

const FRAME = {

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

const DEFAULT_SOURCE = 'var parameters = {\n\tvalue: new FRAME.Float( \'Value\', 1.0 )\n};\n\nfunction start(){}\n\nfunction end(){}\n\nfunction update( progress ){}';

function Code( data ) {

	this.name = data.name;
	this.source = data.source !== undefined ? data.source : DEFAULT_SOURCE;
	this.program = null;
	this.compile = async function ( resources, player ) {

		const properties = 'FRAME, resources, player, parameters, start, end, update';
		const source = this.source + '\nreturn { parameters: parameters, start: start, end: end, update: update };';

		if ( /await/.test( this.source ) ) {

			this.program = await ( new AsyncFunction( properties, source ) )( FRAME, resources, player );

		} else {

			this.program = ( new Function( properties, source ) )( FRAME, resources, player );

		}

		// Save default parameters

		if ( this.program.parameters !== undefined ) {

			this.program._parameters = JSON.parse( JSON.stringify( this.program.parameters ) );

		}

	};

}

let animationId = 0;

function Animation( data ) {

	this.id = animationId ++;
	this.name = data.name;
	this.start = data.start;
	this.end = data.end;
	this.layer = data.layer;
	this.effect = data.effect;
	this.enabled = data.enabled ?? true;
	this.parameters = data.parameters ?? {};

}

function Timeline() {

	const animations = [];
	const curves = [];

	const active = [];

	let next = 0;
	let prevtime = 0;

	function layerSort( a, b ) { return a.layer - b.layer; }
	function startSort( a, b ) { return a.start === b.start ? layerSort( a, b ) : a.start - b.start; }

	return {

		animations: animations,
		curves: curves,

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

						const animationParameters = animation.parameters;
						const programParameters = animation.effect.program.parameters;
						const defaultParameters = animation.effect.program._parameters;

						for ( const key in programParameters ) {

							if ( animationParameters[ key ] !== undefined ) {

								if ( Array.isArray( programParameters[ key ].value ) && typeof animationParameters[ key ] === 'string' ) {

									// Convert string to array

									animationParameters[ key ] = animationParameters[ key ].split( ',' ).map( Number );

								}
								
								programParameters[ key ].value = animationParameters[ key ];

							} else {

								programParameters[ key ].value = defaultParameters[ key ].value;

							}

						}

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

class Frame {

	constructor() {

		this.name = '';
		this.duration = 120;

		this.scripts = [];
		this.effects = [];

		this.resources = new Resources();
		this.timeline = new Timeline();
		this.player = new Player();

	}

	fromMarkdown( markdown ) {

		const sections = {
			'Config': 'config',
			'Setup': 'scripts',
			'Effects': 'effects',
			'Animations': 'animations'
		};

		const lines = markdown.split( '\n' );
		const json = { name: '', config: { duration: 120 }, scripts: [], effects: [], animations: [] };

		let currentSection = null;
		let currentItem = null;

		let inCodeBlock = false;
		let codeBlockContent = [];

		for ( let i = 0, l = lines.length; i < l; i ++ ) {

			const line = lines[ i ];

			if ( line.startsWith( '# ' ) ) {

				json.name = line.substring( 2 ).trim();
				continue;

			}

			if ( line.startsWith( '## ' ) ) {

				currentSection = sections[ line.substring( 3 ) ];
				continue;

			}

			if ( line.startsWith( '###' ) ) {

				const name = line.substring( 3 ).trim();

				switch ( currentSection ) {

					case 'animations':
						currentItem = { name, start: 0, end: 0, layer: 0, effectId: 0, enabled: true, parameters: {} };
						break;

					case 'scripts':
					case 'effects':
						currentItem = { name, source: '' };
						break;

				}

				json[ currentSection ].push( currentItem );
				continue;

			}

			if ( line.startsWith( '```' ) ) {

				if ( inCodeBlock === false ) {

					inCodeBlock = true;

				} else {

					inCodeBlock = false;

					currentItem.source = codeBlockContent.join( '\n' );
					codeBlockContent = [];

				}

				continue;

			}

			if ( inCodeBlock ) {

				codeBlockContent.push( line );
				continue;

			}

			switch ( currentSection ) {

				case 'animations':

					if ( line.startsWith( '* ' ) ) {

						const [ property, value ] = line.substring( 2 ).split( ': ' );

						switch ( property ) {

							case 'start':
								currentItem.start = parseFloat( value );
								break;	

							case 'end':
								currentItem.end = parseFloat( value );
								break;

							case 'layer':
								currentItem.layer = parseInt( value );
								break;

							case 'effect':
								currentItem.effectId = json.effects.findIndex( e => e.name === value );
								break;

							case 'enabled':
								currentItem.enabled = value === 'true';
								break;

						}

						continue;

					}

					if ( line.startsWith( '    * ' ) ) {

						const [ property, value ] = line.substring( 6 ).split( ': ' );
						currentItem.parameters[ property ] = value;
						continue;

					}

					break;

				case 'config':

					if ( line.startsWith( '* ' ) ) {

						const [ property, value ] = line.substring( 2 ).toLowerCase().split( ': ' );

						switch ( property ) {

							case 'duration':
								json.config.duration = parseFloat( value );
								break;

						}

					}

					break;

			}

		}

		// console.log( json );

		this.name = json.name;
		this.duration = json.config.duration;

		const scripts = this.scripts;
		const effects = this.effects;
		const timeline = this.timeline;

		for ( const data of json.scripts ) {
			scripts.push( new Code( data ) );
		}

		for ( const data of json.effects ) {
			effects.push( new Code( data ) );
		}

		for ( const data of json.animations ) {
			data.effect = effects[ data.effectId ];
			timeline.animations.push( new Animation( data ) );
		}

		this.timeline.sort();

	}

	async compile() {

		const resources = this.resources;
		const player = this.player;

		const scripts = this.scripts;
		const effects = this.effects;

		for ( let i = 0, l = scripts.length; i < l; i ++ ) {

			const script = scripts[ i ];
			await script.compile( resources, player );

		}

		for ( let i = 0, l = effects.length; i < l; i ++ ) {

			const effect = effects[ i ];
			await effect.compile( resources, player );

		}

	}

}

// WebAudio

function WebAudio( context ) {

	if ( context === undefined ) {

		context = WebAudio.getContext();

	}

	var source, buffer, binary;

	var currentTime = 0;
	var loop = false;
	var playbackRate = 1;

	var paused = true;
	var startAt = 0;

	var volume;

	if ( context ) {

		createVolume();

	}

	function load( url ) {

		var request = new XMLHttpRequest();
		request.open( 'GET', url, true );
		request.responseType = 'arraybuffer';
		request.addEventListener( 'load', function ( event ) {
			decode( event.target.response );
		} );
		request.send();

	}

	function decode( binary ) {

		context.decodeAudioData( binary, function ( data ) {
			buffer = data;
			if ( paused === false ) play();
		} );

	}

	function createVolume() {

		if ( !context.volume ) {
			context.volume = context.createGain();
			context.volume.connect( context.destination );
			context.volume.gain.value = 1;
		}

		volume = context.createGain();
		volume.connect( context.volume );
		volume.gain.value = 1;

	}

	function getCurrentTime() {

		if ( buffer === undefined || paused === true ) return currentTime;
		return currentTime + ( context.currentTime - startAt ) * playbackRate;

	}

	function play() {

		if ( buffer === undefined ) return;

		source = context.createBufferSource();
		source.buffer = buffer;
		source.loop = loop;
		source.playbackRate.value = playbackRate;
		source.start( 0, currentTime );
		source.connect( volume );

		startAt = context.currentTime;

	}

	function stop() {

		if ( buffer === undefined ) return;

		source.stop();
		source.disconnect( volume );

		currentTime = getCurrentTime();

	}

	return {
		play: function () {
			if ( paused ) {
				play(); paused = false;
			}
		},
		pause: function () {
			if ( paused === false ) {
				stop(); paused = true;
			}
		},
		get volume() {
			return volume.gain.value;
		},
		set volume(v) {
			volume.gain.value = v;
		},
		get currentTime() {
			return getCurrentTime();
		},
		set currentTime( value ) {
			if ( paused === false ) stop();
			currentTime = value;
			if ( paused === false ) play();
		},
		get playbackRate() {
			return playbackRate;
		},
		set playbackRate( value ) {
			if ( paused === false ) stop();
			playbackRate = value;
			if ( paused === false ) play();
		},
		set src( url ) {
			load( url );
		},
		get loop() {
			return loop;
		},
		set loop( value ) {
			loop = value;
		},
		get paused() {
			return paused;
		},
		get buffer() {
			return buffer;
		}
	}

}

WebAudio.getContext = function() {

	if ( WebAudio.context ) {
		return WebAudio.context;
	}

	WebAudio.context = new ( window.AudioContext || window.webkitAudioContext )();

	return WebAudio.context;

};

// TODO: Pass it to the effect
window.WebAudio = WebAudio;

export { Frame, Code, Animation, Resources, Timeline, Player };
