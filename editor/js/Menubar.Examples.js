/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Examples = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Examples' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// Examples

	var items = [
		{ title: 'HTML Colors', file: 'html_colors.frame.json' },
		{ title: 'Three.js Cube', file: 'threejs_cube.frame.json' },
		{ title: 'Three.js Shaders', file: 'threejs_shaders.frame.json' }
	];

	for ( var i = 0; i < items.length; i ++ ) {

		( function ( i ) {

			var item = items[ i ];

			var option = new UI.Row();
			option.setClass( 'option' );
			option.setTextContent( item.title );
			option.onClick( function () {

				if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {

					var request = new XMLHttpRequest();
					request.open( 'GET', '../examples/' + item.file, true );
					request.addEventListener( 'load', function ( event ) {

						editor.clear();
						editor.fromJSON( JSON.parse( event.target.responseText ) );

					}, false );
					request.send( null );

				}

			} );
			options.add( option );

		} )( i )

	}

	return container;

};
