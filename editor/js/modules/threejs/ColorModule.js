var ColorModule = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		color: 0xffffff,
		opacity : 1

	};

	var camera, scene, material;

	this.init = function () {

		camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

		material = new THREE.MeshBasicMaterial( {
			color: this.parameters.input.color,
			opacity: this.parameters.input.opacity,
			transparent: true
		} );

		scene = new THREE.Scene();

		var object = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
		scene.add( object );

	};

	this.update = function ( t ) {

		renderer.render( scene, camera );

	};

};
