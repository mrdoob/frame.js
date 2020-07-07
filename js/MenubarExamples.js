/**
 * @author mrdoob / http://mrdoob.com/
 */

function MenubarExamples( editor ) {

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
		{ title: 'HTML Colors', file: 'html_colors.json' },
		{ title: 'HTML Loop', file: 'html_loop.json' },
		{ title: 'Three.js Cube', file: 'threejs_cube.json' },
		{ title: 'Three.js Shaders', file: 'threejs_shaders.json' }
	];

	for ( var i = 0; i < items.length; i ++ ) {

		( function ( i ) {

			var item = items[ i ];

			var option = new UI.Row();
			option.setClass( 'option' );
			option.setTextContent( item.title );
			option.onClick( async function () {

				if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {

					editor.clear();

					const response = await fetch( './examples/' + item.file );
					await editor.fromJSON( await response.json() );

				}

			} );
			options.add( option );

		} )( i )

	}

	return container;

}

export { MenubarExamples };
