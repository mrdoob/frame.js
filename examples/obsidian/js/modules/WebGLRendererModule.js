var WebGLRendererModule = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		width: 800,
		height: 600,
		dom: null

	};

	this.init = function ( parameters ) {

		renderer = new THREE.WebGLRenderer( { antialias: true, alpha: false } ); // TODO: Remove this nasty global
		renderer.setSize( parameters.width, parameters.height );
		renderer.autoClear = false;

		renderer.domElement.style.maxWidth = '100%';
		renderer.domElement.style.height = '100%';


		if ( parameters.dom !== null ) {

			parameters.dom.appendChild( renderer.domElement );
            parameters.dom = null; // TODO: Another hack
		}

	};


};