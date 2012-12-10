var ShaderModule = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		url: '',
		speed: 1,
		offset: 0,
		mouseX: 0.5,
		mouseY: 0.5

	};

	var camera, scene, uniforms;

	this.init = function () {

		camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

		scene = new THREE.Scene();

		uniforms = {
			time: { type: "f", value: 1.0 },
			mouse: { type: "v2", value: new THREE.Vector2( this.parameters.input.mouseX, this.parameters.input.mouseY ) },
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

		}, false );
		request.open( 'GET', this.parameters.input.url, true );
		request.send( null );

	};

	this.update = function ( t ) {

		uniforms.time.value = ( t * this.parameters.input.speed ) + this.parameters.input.offset;
		renderer.render( scene, camera );

	};

};
