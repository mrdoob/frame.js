var WebGLRendererModule = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		dom: 	new FRAME.ModuleParameter.DOM( 'DOM', null ),
		width:  new FRAME.ModuleParameter.Integer( 'Width', 800 ),
		height: new FRAME.ModuleParameter.Integer( 'Height', 600 )

	};

	this.init = function ( parameters ) {

		var dom = document.createElement( 'div' );
		dom.style.position = 'absolute';
		dom.style.width = '100%';
		dom.style.height = '100%';

		renderer = new THREE.WebGLRenderer( { antialias: true, alpha: false } ); // TODO: Remove this nasty global
		renderer.autoClear = false;
		renderer.domElement.style.position = 'absolute';
		dom.appendChild( renderer.domElement );

		var onWindowResize = function () {

			var scale = dom.offsetWidth / parameters.width;

			var width = parameters.width * scale;
			var height = parameters.height * scale;

			renderer.setSize( width, height );
			renderer.domElement.style.top = ( dom.offsetHeight - height ) / 2 + 'px';

		};

		if ( parameters.dom !== null ) {

			parameters.dom.appendChild( dom );
			parameters.dom = null; // TODO: Another hack

			//

			window.addEventListener( 'resize', onWindowResize );

			onWindowResize();

		}

	};


};