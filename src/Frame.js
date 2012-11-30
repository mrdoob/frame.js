var FRAME = ( function () {

	return {

		VERSION: 1,

		Effect: function () {

			this.name = null;
			this.init = function ( callback ) {};
			this.load = function ( callback ) {};
			this.start = function ( value ) {};
			this.end = function ( value ) {};
			this.render = function ( value ) {};

		},

		Timeline: function () {

			var elements = [];
			var active = [];

			var next = 0, prevtime = 0;

			return {

				load: function ( url ) {

					var scope = this;

					var request = new XMLHttpRequest();
					request.addEventListener( 'load', function ( event ) {

						var json = JSON.parse( event.target.responseText );

						for ( var i = 0, l = json.timeline.length; i < l; i ++ ) {

							var data = json.timeline[ i ];

							if ( window[ data[ 3 ] ] === undefined ) {

								console.log( 'FRAME: Missing effect: ' + data[ 3 ] );
								continue;

							}

							var element = new FRAME.TimelineElement(
								data[ 0 ],
								data[ 1 ],
								data[ 2 ],
								new window[ data[ 3 ] ]( data[ 4 ] )
							);

							scope.add( element );

						}

					}, false );
					request.open( 'GET', url, true );
					request.send( null );

				},

				add: function ( element ) {

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

				render: function ( time ) {

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
							element.effect.start( ( time - element.start ) / element.duration );

						}

						next ++;

					}

					// remove from active

					var i = 0;

					while ( active[ i ] ) {

						var element = active[ i ];

						if ( element.end < time ) {

							active.splice( i, 1 );
							element.effect.end( ( time - element.start ) / element.duration );
							continue;

						}

						i ++;

					}

					// render

					active.sort( function ( a, b ) { return a.layer - b.layer; } );

					for ( var i = 0, l = active.length; i < l; i ++ ) {

						var element = active[ i ];
						element.effect.render( ( time - element.start ) / element.duration );

					}

					prevtime = time;

				},

				reset: function () {

					while ( active.length ) active.pop();
					next = 0;

				}

			}

		},

		TimelineElement: function ( layer, start, end, effect ) {

			this.layer = layer;
			this.start = start;
			this.end = end;
			this.duration = end - start;
			this.effect = effect;

		}

	}

} )();