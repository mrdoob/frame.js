var FadeInModule = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		color: 'red'

	};

	var camera, scene, material;

	this.init = function () {

		camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

		material = new THREE.MeshBasicMaterial( {
			color: this.parameters.input.color,
			opacity: 0,
			transparent: true
		} );

		scene = new THREE.Scene();

		var object = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
		scene.add( object );

	};

	this.update = function ( t ) {

		material.opacity = 1 - t;
		renderer.render( scene, camera );

	};

};
