/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.File = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setTextContent( 'File' ).setColor( '#888' );
	title.setMargin( '0px' );
	title.setPadding( '8px' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// New

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'New' );
	option.onClick( function () {

		if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {

			editor.clear();

		}

	} );
	options.add( option );

	// export

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Export' );
	option.onClick( Export );
	options.add( option );

	signals.exportState.add( Export );

	function Export () {

		var output = JSON.stringify( editor.toJSON(), null, '\t' );

		var blob = new Blob( [ output ], { type: 'text/plain' } );
		var objectURL = URL.createObjectURL( blob );

		window.open( objectURL, '_blank' );
		window.focus();

	}

	return container;

};
