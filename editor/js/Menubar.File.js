Menubar.File = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setTextContent( 'File' ).setColor( '#888' );
	title.setMargin( '0px' );
	title.setPadding( '8px' );
	container.add( title );

	//

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// export
	
	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Export' );
	option.onClick( function () {
	
		var data = {
			"config": {},
			"curves": [],
			"timeline": []
		};
		
		// curves

		var curves = editor.timeline.curves;

		for ( var i = 0, l = curves.length; i < l; i ++ ) {

			var curve = curves[ i ];

			if ( curve instanceof FRAME.Curves.Linear ) {

				data.curves.push( [ 'linear', curve.points ] );

			}

		}

		// timeline

		var elements = editor.timeline.elements;
		
		for ( var i = 0, l = elements.length; i < l; i ++ ) {
			
			var element = elements[ i ];
			var module = element.module;

			var parameters = {};

			for ( var key in module.parameters ) {

				parameters[ key ] = module.parameters[ key ].value;

			}
			
			data.timeline.push( [
				element.layer,
				element.start,
				element.end,
				element.module.name,
				parameters
			] );
			
		}
		
		var output = JSON.stringify( data, null );

		var blob = new Blob( [ output ], { type: 'text/plain' } );
		var objectURL = URL.createObjectURL( blob );

		window.open( objectURL, '_blank' );
		window.focus();
	
	} );
	options.add( option );

	return container;

}
