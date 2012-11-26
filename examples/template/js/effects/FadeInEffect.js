var FadeInEffect = function ( properties ) {

	FRAME.Effect.call( this );

	var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

	var material = new THREE.MeshBasicMaterial( {
		color: properties.color,
		opacity: 0,
		depthTest: false
	} );

	var scene = new THREE.Scene();

	var object = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
	scene.add( object );

	this.render = function ( value ) {

		material.opacity = 1 - value;
		renderer.render( scene, camera );

	};

};

FadeInEffect.prototype = Object.create( FRAME.Effect );
