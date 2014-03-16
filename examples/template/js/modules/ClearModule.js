define( [ 'WebGLRendererModule' ], function ( renderer ) {

	return function () {

		return new FRAME.Module( {

			parameters: {

				enabled: new FRAME.ModuleParameter.Boolean( 'enabled', true )

			},

			update: function () {

				if ( this.parameters.enabled.value === true ) renderer.clear();

			}

		} );

	};

} );