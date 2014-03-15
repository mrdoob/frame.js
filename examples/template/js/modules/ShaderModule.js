( function ( config ) {

	var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

	var scene = new THREE.Scene();

	var renderer = config.renderer;

	var uniforms = {
		time: { type: "f", value: 1.0 },
		mouse: { type: "v2", value: new THREE.Vector2( 0.5, 0.5 ) },
		resolution: { type: "v2", value: new THREE.Vector2( 800, 600 ) }
	};

	var materials = {};

	var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), new THREE.MeshBasicMaterial() );
	scene.add( mesh );

	return new FRAME.Module( {

		parameters: {

			url: new FRAME.ModuleParameter.String( 'URL', '' ),
			time: new FRAME.ModuleParameter.Float( 'Time', 0 ),
			mouse: new FRAME.ModuleParameter.Vector2( 'Mouse', [ 0.5, 0.5 ] )

		},

		init: function ( parameters ) {

			if ( materials[ parameters.url ] === undefined ) {

				var loader = new THREE.XHRLoader();
				loader.load( config.path + parameters.url, function ( text ) {

					var material = new THREE.ShaderMaterial( {
						uniforms: uniforms,
						vertexShader: 'void main() { gl_Position = vec4( position, 1.0 ); }',
						fragmentShader: text
					} );

					materials[ parameters.url ] = material;
					mesh.material = material;

				} );

			}

		},

		update: function ( parameters ) {

			if ( materials[ parameters.url ] !== undefined ) { // TODO: load callback should avoid this

				mesh.material = materials[ parameters.url ];

			}

			// uniforms.time.value = ( t * parameters.speed ) + parameters.offset;
			uniforms.time.value = parameters.time;
			uniforms.mouse.value.fromArray( parameters.mouse );
			renderer.render( scene, camera );

		}

	} );

} )