define( function () {

	var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

	var scene = new THREE.Scene();

	var mesh = new THREE.Mesh(
		new THREE.PlaneGeometry( 2, 2 ),
		new THREE.MeshBasicMaterial( { transparent: true } )
	);

	scene.add( mesh );

	return {

		camera: camera,
		scene: scene

	};

} );