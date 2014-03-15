( function ( config ) {

	var dom = document.createElement( 'div' );
	dom.style.position = 'absolute';
	dom.style.width = '100%';
	dom.style.height = '100%';
	config.dom.appendChild( dom );

	var renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true } );
	renderer.setSize( config.width, config.height );
	renderer.autoClear = false;
	renderer.domElement.style.position = 'absolute';
	dom.appendChild( renderer.domElement );

	var onWindowResize = function () {

		var scale = Math.min( dom.offsetWidth / config.width, dom.offsetHeight / config.height );

		var width = config.width * scale;
		var height = config.height * scale;

		renderer.domElement.style.left = ( dom.offsetWidth - width ) / 2 + 'px';
		renderer.domElement.style.top = ( dom.offsetHeight - height ) / 2 + 'px';
		renderer.domElement.style.width = width + 'px';
		renderer.domElement.style.height = height + 'px';

	};

	window.addEventListener( 'resize', onWindowResize );

	onWindowResize();

	config.renderer = renderer;

	//

	return new FRAME.Module( {

		parameters: {

			clear: new FRAME.ModuleParameter.Boolean( 'Clear', true )

		},

		update: function ( parameters ) {

			if ( parameters.clear === true ) renderer.clear();

		}

	} );

} )