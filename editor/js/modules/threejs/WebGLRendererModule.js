var WebGLRendererModule = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		width: 800,
		height: 600,
		dom: null

	};

	this.init = function () {

		renderer = new THREE.WebGLRenderer(); // TODO: Remove this nasty global
		renderer.setSize( this.parameters.input.width, this.parameters.input.height );
		renderer.autoClear = false;
		renderer.domElement.style.maxWidth = '100%';
		renderer.domElement.style.height = '100%';

		if ( this.parameters.input.dom !== null ) {

			this.parameters.input.dom.appendChild( renderer.domElement );

		}

	};


};
