define( [ 'Config', 'WebGLRendererModule' ], function ( config, renderer ) {

	return function () {

		var camera = new THREE.PerspectiveCamera( 60, config.width / config.height, 1, 1000 );

		var scene = new THREE.Scene();

		var texts = {};
		var currentText = null;

		var material = new THREE.LineBasicMaterial( { depthTest: false, opacity: 0.9, transparent: true } );

		//
		
		var startPosition = new THREE.Vector3();
		var endPosition = new THREE.Vector3();
		var deltaPosition = new THREE.Vector3();

		//

		return new FRAME.Module( {

			parameters: {

				text:          new FRAME.Parameter.String( 'Text', 'text' ),
				startPosition: new FRAME.Parameter.Vector3( 'Camera Start', [ 0, 0, 20 ] ),
				endPosition:   new FRAME.Parameter.Vector3( 'Camera End', [ 0, 0, 40 ] )

			},

			init: function () {

				var string = this.parameters.text.value;

				if ( texts[ string ] === undefined ) {
					
					var shapes = THREE.FontUtils.generateShapes( string, {
						font: "helvetiker",
						size: 2
					} );

					var text = new THREE.Object3D();

					var offset = new THREE.Box3();

					for ( var i = 0; i < shapes.length; i ++ ) {

						var shape = shapes[ i ];

						var geometry = shape.createPointsGeometry();
						geometry.computeBoundingBox();

						offset.union( geometry.boundingBox );

						var mesh = new THREE.Line( geometry, material );
						text.add( mesh );

						if ( shape.holes.length > 0 ) {

							for ( var j = 0; j < shape.holes.length; j ++ ) {

								var hole = shape.holes[ j ];
								shapes.push( hole.toShapes()[ 0 ] );

							}

						}

					}

					text.position.addVectors( offset.min, offset.max ).multiplyScalar( -0.5 );
					
					texts[ this.parameters.text.value ] = text;

				}

			},

			start: function () {
		
				// TODO: renderer should be able to render single objects

				if ( currentText !== null ) {

					scene.remove( currentText );

				}

				var string = this.parameters.text.value;

				if ( texts[ string ] === undefined ) {

					this.init();

				}

				currentText = texts[ string ];
				scene.add( currentText );
			 
				startPosition.fromArray( this.parameters.startPosition.value );
				endPosition.fromArray( this.parameters.endPosition.value );
				deltaPosition.subVectors( endPosition, startPosition );

			},

			update: function ( t ) {

				camera.position.copy( deltaPosition );
				camera.position.multiplyScalar( t );
				camera.position.add( startPosition );
				camera.lookAt( scene.position );
				
				renderer.render( scene, camera );

			}

		} );

	};

} );