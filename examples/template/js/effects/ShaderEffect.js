var ShaderEffect = function ( properties ) {

	FRAME.Effect.call( this );
	
	if ( properties.speed === undefined ) properties.speed = 1;
	if ( properties.offset === undefined ) properties.offset = 0;
	if ( properties.mouseX === undefined ) properties.mouseX = 0.5;
	if ( properties.mouseY === undefined ) properties.mouseY = 0.5;

	var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

	var scene = new THREE.Scene();

	var uniforms = {
		time: { type: "f", value: 1.0 },
		mouse: { type: "v2", value: new THREE.Vector2( properties.mouseX, properties.mouseY ) },
		resolution: { type: "v2", value: new THREE.Vector2( 800, 600 ) }
	};
	
	var request = new XMLHttpRequest();
	request.addEventListener( 'load', function ( event ) {
		
		var material = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: 'void main() { gl_Position = vec4( position, 1.0 ); }',
			fragmentShader: event.target.responseText
		} );
	
		var object = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
		scene.add( object );
		
		renderer.initMaterial( material, [], null, object );

	}, false );
	request.open( 'GET', properties.url, true );
	request.send( null );

	this.render = function ( value ) {

		uniforms.time.value = ( value * properties.speed ) + properties.offset;
		renderer.render( scene, camera );

	};

};

ShaderEffect.prototype = Object.create( FRAME.Effect );
