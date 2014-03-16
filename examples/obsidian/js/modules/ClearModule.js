define( [ 'WebGLRendererModule' ], function ( renderer ) {

	return function () {

		return new FRAME.Module( {

			parameters: {

				clearColor: new FRAME.Parameter.Boolean( 'Color', true ),
				clearDepth: new FRAME.Parameter.Boolean( 'Depth', true ),
				clearStencil: new FRAME.Parameter.Boolean( 'Stencil', true )

			},

			update: function () {

				renderer.clear(
					this.parameters.clearColor.value === true,
					this.parameters.clearDepth.value === true,
					this.parameters.clearStencil.value === true
				);

			}

		} );

	};

} );