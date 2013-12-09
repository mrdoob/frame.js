( function ( config ) {

	var camera = new THREE.PerspectiveCamera( 60, config.width / config.height, 1, 1000 );

	var scene = new THREE.Scene();

	var texts = {};
	var currentText = null;

	var material = new THREE.LineBasicMaterial( { depthTest: false, opacity: 0.9, transparent: true } );

	var renderer = config.renderer;

	//
	
	var startPosition = new THREE.Vector3();
	var endPosition = new THREE.Vector3();
	var deltaPosition = new THREE.Vector3();

	//

	return new FRAME.Module( {

		parameters: {

			text:          new FRAME.ModuleParameter.String( 'Text', 'text' ),
			startPosition: new FRAME.ModuleParameter.Vector3( 'Camera Start', [ 0, 0, 20 ] ),
			endPosition:   new FRAME.ModuleParameter.Vector3( 'Camera End', [ 0, 0, 40 ] )

		},

		init: function ( parameters ) {

			var string = parameters.text;

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
				
				texts[ parameters.text ] = text;

			}

		},

		start: function ( parameters ) {
	
			// TODO: renderer should be able to render single objects

			if ( currentText !== null ) {

				scene.remove( currentText );

			}

			if ( texts[ parameters.text ] === undefined ) {

				init( parameters );

			}

			currentText = texts[ parameters.text ];
			scene.add( currentText );
		 
			startPosition.fromArray( parameters.startPosition );
			endPosition.fromArray( parameters.endPosition );
			deltaPosition.subVectors( endPosition, startPosition );

		},

		update: function ( parameters, t ) {

			camera.position.copy( deltaPosition );
			camera.position.multiplyScalar( t );
			camera.position.add( startPosition );
			camera.lookAt( scene.position );
			
			renderer.render( scene, camera );

		}

	} );

} )