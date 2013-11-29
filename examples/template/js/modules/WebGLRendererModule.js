( function ( config ) {

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( config.width, config.height );
	renderer.autoClear = false;
	renderer.domElement.style.maxWidth = '100%';
	renderer.domElement.style.height = '100%';

	config.renderer = renderer;

	return new FRAME.Module( {

		parameters: {

			dom: null

		},

		init: function ( parameters ) {

			if ( parameters.dom !== null ) {

				parameters.dom.appendChild( renderer.domElement );
				parameters.dom = null; // TODO: Another hack

			}

		}

	} );

} )