var ColorModule = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		color:   new FRAME.ModuleParameter.Color( 'Color', 0xffffff ),
		opacity: new FRAME.ModuleParameter.Float( 'Opacity', 1, 0, 1 )

	};

	var parameters;
	var camera, scene, material;

	this.init = function ( value ) {

		parameters = value;

		camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

		material = new THREE.MeshBasicMaterial( {
			color: parameters.color,
			opacity: parameters.opacity,
			transparent: true
		} );

		scene = new THREE.Scene();

		var object = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
		scene.add( object );

	};

	this.update = function ( t ) {

		material.opacity = parameters.opacity;

		renderer.render( scene, camera );

	};

};