var FRAME = ( function () {

	return {

		VERSION: 2,

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
			Boolean: function ( value, defaultValue ) {

				this.value = value;
				this.defaultValue = defaultValue || false;
			},

			Color: function ( value, defaultValue ) {

				this.value = value;
				this.defaultValue = defaultValue || 0xffffff;
			},

			DOM: function ( value, defaultValue ) {

				this.value = value;
				this.defaultValue = defaultValue || null;
			},

			Float: function ( value, defaultValue, min, max ) {
				this.value = value;
				this.defaultValue = defaultValue || 0.0;
				this.min = ( typeof min === 'number' ) ? min: -Infinity;
				this.max = ( typeof max === 'number' ) ? max: Infinity;
			},

			Integer: function ( value, defaultValue, min, max ) {

				this.value = value;
				this.defaultValue = defaultValue || 0;
				this.min = ( typeof min === 'number' ) ? min: -Infinity;
				this.max = ( typeof max === 'number' ) ? max: Infinity;
			},

			String: function ( value, defaultValue ) {

				this.value = value;
				this.defaultValue = defaultValue || "";
			},

			Vector2: function ( x, y, defaultValue ) {

				this.value = [ x, y ];
				this.defaultValue = defaultValue || [0,0];
			},

			Vector3: function ( x, y, z, defaultValue ) {

				this.value = [ x, y, z ];
				this.defaultValue = defaultValue || [0,0,0];
			}

		},

		Timeline: function () {

			var elements = [];
			var active = [];

			var next = 0, prevtime = 0;

			return {

				add: function ( element ) {

					element.module.init( element.parameters );
					elements.push( element );
					this.sort();

				},

				sort: function () {

					elements.sort( function ( a, b ) { return a.start - b.start; } );

				},

				remove: function ( element ) {

					var i = elements.indexOf( element );

					if ( i !== -1 ) {

						elements.splice( i, 1 );

					}

				},
                
                elements: elements,

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
