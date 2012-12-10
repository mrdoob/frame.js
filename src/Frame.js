var FRAME = ( function () {

	return {

		VERSION: 1,

		Module: function () {

			this.parameters = { input: {}, output: {} };
			this.init = function ( callback ) {};
			this.load = function ( callback ) {};
			this.start = function ( value ) {};
			this.end = function ( value ) {};
			this.update = function ( value ) {};

		},

		Timeline: function () {

			var elements = [];
			var active = [];

			var next = 0, prevtime = 0;

			return {

				add: function ( element ) {

					element.module.init();
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

						if ( element.end > time ) {

							active.push( element );
							element.module.start( ( time - element.start ) / element.duration );

						}

						next ++;

					}

					// remove from active

					var i = 0;

					while ( active[ i ] ) {

						var element = active[ i ];

						if ( element.end < time ) {

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

		TimelineElement: function ( name, layer, start, end, module ) {

			this.name = name;
			this.layer = layer;
			this.start = start;
			this.end = end;
			this.duration = end - start;
			this.module = module;

		}

	}

} )();
