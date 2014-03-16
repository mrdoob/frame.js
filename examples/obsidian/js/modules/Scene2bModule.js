define( [ 'Config', 'WebGLRendererModule' ], function ( config, renderer ) {

	var camera = new THREE.PerspectiveCamera( 60, config.width / config.height, 1, 1500 );
	camera.up.y = 0.5;
	camera.up.x = -1;
	camera.up.normalize();

	var cameraTarget = new THREE.Vector3();

	var scene = new THREE.Scene();

	var light1 = new THREE.PointLight( 0x88ff44, 5, 300 );
	scene.add( light1 );

	var light2 = new THREE.PointLight( 0x8844ff, 3, 300 );
	scene.add( light2 );

	// tunnel
	
	var plane = new THREE.PlaneGeometry( 5, 5 );
	var geometry = new THREE.Geometry() ;
	var material = new THREE.MeshLambertMaterial( {
		color: 0x606060,
		shading: THREE.FlatShading,
		side: THREE.DoubleSide
	} );
	
	var object = new THREE.Mesh( plane, material );
	
	for ( var i = 0; i < 800; i ++ ) {

		var radius = 50 + ( Math.random() * 150 );

		object.position.x = Math.random() - 0.5;
		object.position.y = Math.random() - 0.5;
		object.position.z = 0;
		object.position.normalize();
		object.position.multiplyScalar( radius );
		object.lookAt( scene.position );
		object.position.z = ( i * 4 ) - 500;
		object.scale.x = Math.random() * 10;
		object.scale.y = Math.random() * 10;
		object.scale.z = Math.random() * 20;
		THREE.GeometryUtils.merge( geometry, object );

	}

	var tunnel1 = new THREE.Mesh( geometry, material );
	scene.add( tunnel1 );
	
	var geometry = new THREE.Geometry();
	var material = new THREE.MeshLambertMaterial( {
		color: 0x606060,
		shading: THREE.FlatShading,
		side: THREE.DoubleSide,
		wireframe: true
	} );

	var object = new THREE.Mesh( plane, material );
	
	for ( var i = 0; i < 800; i ++ ) {

		var radius = 50 + ( Math.random() * 150 );

		object.position.x = Math.random() - 0.5;
		object.position.y = Math.random() - 0.5;
		object.position.z = 0;
		object.position.normalize();
		object.position.multiplyScalar( radius );
		object.lookAt( scene.position );
		object.position.z = ( i * 4 ) - 500;
		object.scale.x = Math.random() * 10;
		object.scale.y = Math.random() * 10;
		object.scale.z = Math.random() * 20;
		THREE.GeometryUtils.merge( geometry, object );

	}

	var tunnel2 = new THREE.Mesh( geometry, material );
	scene.add( tunnel2 );

	// sphere
	
	var sphere = new THREE.Object3D();
	scene.add( sphere );

	var material = new THREE.MeshLambertMaterial( {
		shading: THREE.FlatShading
	} );
	
	sphere.add( new THREE.Mesh( new THREE.IcosahedronGeometry( 20, 0 ), material ) );
	sphere.add( new THREE.Mesh( new THREE.CylinderGeometry( 20, 20, 20, 3 ), material ) );
	sphere.add( new THREE.Mesh( new THREE.CylinderGeometry( 20, 20, 20, 5 ), material ) );
	sphere.add( new THREE.Mesh( new THREE.OctahedronGeometry( 20, 0 ), material ) );
	sphere.add( new THREE.Mesh( new THREE.IcosahedronGeometry( 20, 1 ), material ) );
	sphere.add( new THREE.Mesh( new THREE.TetrahedronGeometry( 20, 0 ), material ) );
	sphere.add( new THREE.Mesh( new THREE.TetrahedronGeometry( 20, 2 ), material ) );

	//

	var startPosition = new THREE.Vector3();
	var endPosition = new THREE.Vector3();
	var deltaPosition = new THREE.Vector3();
	
	var startPositionTarget = new THREE.Vector3();
	var endPositionTarget = new THREE.Vector3();
	var deltaPositionTarget = new THREE.Vector3();

	var prevShape = 0;

	return function () {

		return new FRAME.Module( {

			parameters: {

				startPosition:       new FRAME.Parameter.Vector3( 'Camera Start', [ 100, 100, 100 ] ),
				endPosition:         new FRAME.Parameter.Vector3( 'Camera End', [ - 100, 100, 100 ] ),
				startPositionTarget: new FRAME.Parameter.Vector3( 'Camera Target Start', [ 0, 0, 0 ] ),
				endPositionTarget:   new FRAME.Parameter.Vector3( 'Camera Target End', [ 0, 0, 2000 ] ),
				lightIntensity:      new FRAME.Parameter.Float( 'Light intensity', 1 )

			},

			start: function () {
			
				startPosition.fromArray( this.parameters.startPosition.value );
				endPosition.fromArray( this.parameters.endPosition.value );
				deltaPosition.subVectors( endPosition, startPosition );

				startPositionTarget.fromArray( this.parameters.startPositionTarget.value );
				endPositionTarget.fromArray( this.parameters.endPositionTarget.value );
				deltaPositionTarget.subVectors( endPositionTarget, startPositionTarget );

			},

			update: function ( t ) {
				
				sphere.position.z = t * 2000;
				sphere.rotation.x = t * 6;
				sphere.rotation.z = t * 6;

				light1.intensity = this.parameters.lightIntensity.value * 6;

				light1.position.z = sphere.position.z + 50;
				light2.position.z = sphere.position.z - 50;

				var shape = Math.floor( t * 125 ) % sphere.children.length;
				
				if ( shape !== prevShape ) {
					
					for ( var i = 0, l = sphere.children.length; i < l; i ++ ) {
						
						var object = sphere.children[ i ];
						object.visible = i === shape;
						
					}
					
					prevShape = shape;
					
				}
				
				tunnel1.rotation.z = t * 2;
				tunnel2.rotation.z = - t * 2;

				camera.position.copy( deltaPosition );
				camera.position.multiplyScalar( t );
				camera.position.add( startPosition );

				cameraTarget.copy( deltaPositionTarget );
				cameraTarget.multiplyScalar( t );
				cameraTarget.add( startPositionTarget );

				camera.lookAt( cameraTarget );

				renderer.render( scene, camera );

			}

		} );

	};

} );