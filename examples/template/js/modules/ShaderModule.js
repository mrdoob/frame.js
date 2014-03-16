define( [ 'Config', 'WebGLRendererModule' ], function ( config, renderer ) {

	return function () {

		var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

		var scene = new THREE.Scene();

		var uniforms = {
			time: { type: "f", value: 1.0 },
			mouse: { type: "v2", value: new THREE.Vector2( 0.5, 0.5 ) },
			resolution: { type: "v2", value: new THREE.Vector2( 800, 600 ) }
		};

		var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ) );
		scene.add( mesh );

		return new FRAME.Module( {

			parameters: {

				url: new FRAME.Parameter.String( 'URL', '' ),
				time: new FRAME.Parameter.Float( 'Time', 0 ),
				mouse: new FRAME.Parameter.Vector2( 'Mouse', [ 0.5, 0.5 ] )

			},

			init: function () {

				var loader = new THREE.XHRLoader();
				loader.load( config.rootPath + this.parameters.url.value, function ( text ) {

					var material = new THREE.ShaderMaterial( {
						uniforms: uniforms,
						vertexShader: 'void main() { gl_Position = vec4( position, 1.0 ); }',
						fragmentShader: text
					} );

					mesh.material = material;

				} );

			},

			update: function () {

				uniforms.time.value = this.parameters.time.value;
				uniforms.mouse.value.fromArray( this.parameters.mouse.value );

				renderer.render( scene, camera );

			}

		} );

	};

} );