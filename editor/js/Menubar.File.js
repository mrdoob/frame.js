/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.File = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'File' );
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

	// import

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Import' );
	option.onClick( Import );
	options.add( option );

	var fileInput = document.createElement( 'input' );
	fileInput.type = 'file';
	fileInput.addEventListener( 'change', function ( event ) {

		var reader = new FileReader();
		reader.addEventListener( 'load', function ( event ) {

			editor.clear();
			editor.fromJSON( JSON.parse( event.target.result ) );

		}, false );

		reader.readAsText( fileInput.files[ 0 ] );

	} );

	function Import () {

		if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) )
			fileInput.click();

	}

	// export

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Export' );
	option.onClick( Export );
	options.add( option );

	signals.exportState.add( Export );

	function Export () {

		var output = JSON.stringify( editor.toJSON(), null, '\t' );

		var filename = "framejs.json"
		var contentType = 'application/octet-stream';
		var a = document.createElement('a');
		var blob = new Blob([output], {'type':contentType});
		a.href = window.URL.createObjectURL(blob);
		a.download = filename;
		a.click() 

	}

	return container;

};
