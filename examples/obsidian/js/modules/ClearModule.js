( function ( config ) {

	var renderer = config.renderer;

	return new FRAME.Module( {

		update: function ( parameters ) {

			renderer.clear();

		}

	} );

} )