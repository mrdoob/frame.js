var ColorEffect = function ( properties ) {

	FRAME.Effect.call( this );

	var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

	var material = new THREE.MeshBasicMaterial( {
		color: properties.color,
		opacity: properties.opacity,
		transparent: true
	} );

	var scene = new THREE.Scene();

	var object = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
	scene.add( object );

	this.render = function ( value ) {

		renderer.render( scene, camera );

	};

};

ColorEffect.prototype = Object.create( FRAME.Effect );
