var FRAME = ( function () {

	return {

		VERSION: 2,

		Curves: {
			Linear: function () {

				var timeStart = 2;
				var timeEnd = 3;
				var timeDelta = timeEnd - timeStart;
				
				var valueStart = 0;
				var valueEnd = 0.5;
				var valueDelta = valueEnd - valueStart;

				this.value = 0;

				this.update = function ( time ) {

					if ( time <= timeStart ) {

						this.value = this.valueStart;

					} else if ( time >= timeEnd ) {

						this.value = valueEnd;

					} else {

						this.value = ( ( time - timeStart ) / timeDelta ) * valueDelta + valueStart;

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

			Saw: function () {

				var frequency = 1;
				var min = 0;
				var max = 1;
				var delta = max - min;

				this.value = 0;

				this.update = function ( time ) {

					this.value = ( ( time % frequency ) / frequency ) * delta + min;

				};

			}

		},

		Module: function () {

			this.name = '';
			this.parameters = { input: {}, output: {} };

			this.init = function ( callback ) {};
			this.load = function ( callback ) {};
			this.start = function ( value ) {};
			this.end = function ( value ) {};
			this.update = function ( value ) {};

		},

		ModuleParameter: {

			Boolean: function ( name, value ) {
				this.name = name;
				this.value = value || true;
			},

			Color: function ( name, value ) {
				this.name = name;
				this.value = value || 0xffffff;
			},

			DOM: function ( name, value ) {
				this.name = name;
				this.value = value;
			},

			Float: function ( name, value, min, max ) {
				this.name = name;
				this.value = value || 0.0;
				this.min = min !== undefined ? min : - Infinity;
				this.max = max !== undefined ? max : Infinity;
			},

			Integer: function ( name, value, min, max ) {
				this.name = name;
				this.value = value || 0;
				this.min = min !== undefined ? min : - Infinity;
				this.max = max !== undefined ? max : Infinity;
			},

			String: function ( name, value ) {
				this.name = name;
				this.value = value || '';
			},

			Vector2: function ( name, value ) {
				this.name = name
				this.value = value !== undefined ? value : [ 0, 0 ];
			},

			Vector3: function ( name, value ) {
				this.name = name;
				this.value = value !== undefined ? value : [ 0, 0, 0 ];
			}

		},

		Timeline: function () {

			var curves = [];
			var elements = [];
			var active = [];

			var next = 0, prevtime = 0;

			return {

				curves: curves,
				elements: elements,

				add: function ( element ) {

					element.module.init( element.parameters );
					elements.push( element );
					this.sort();

				},

				remove: function ( element ) {

					var i = elements.indexOf( element );

					if ( i !== -1 ) {

						elements.splice( i, 1 );

					}

				},

				sort: function () {

					elements.sort( function ( a, b ) { return a.start - b.start; } );

				},
				
				update: function ( time ) {

					if ( time < prevtime ) {

						this.reset();

					}

					// add to active

					while ( elements[ next ] ) {

						var element = elements[ next ];

						if ( element.start > time ) {

							break;

						}

						if ( ( element.start + element.duration ) > time ) {

							active.push( element );
							element.module.start( ( time - element.start ) / element.duration, element.parameters );

						}

						next ++;

					}

					// remove from active

					var i = 0;

					while ( active[ i ] ) {

						var element = active[ i ];

						if ( ( element.start + element.duration ) < time ) {

							active.splice( i, 1 );
							element.module.end( ( time - element.start ) / element.duration );
							continue;

						}

						i ++;

					}

					// update curves

					for ( var i = 0, l = curves.length; i < l; i ++ ) {

						curves[ i ].update( time );

					}

					// render

					active.sort( function ( a, b ) { return a.layer - b.layer; } );

					for ( var i = 0, l = active.length; i < l; i ++ ) {

						var element = active[ i ];
						element.module.update( ( time - element.start ) / element.duration );

					}

					prevtime = time;

				},

				reset: function () {

					while ( active.length ) active.pop();
					next = 0;

				}

			}

		},

		TimelineElement: function () {
			
			var id = 0;
			
			return function ( name, layer, start, duration, module, parameters ) {

				this.id = id ++;
				this.name = name;
				this.layer = layer;
				this.start = start;
				this.duration = duration;
				this.module = module;
				this.parameters = parameters;
				
			};

		}()

	}

} )();
