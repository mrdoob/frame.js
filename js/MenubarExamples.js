/**
 * @author mrdoob / http://mrdoob.com/
 */

import { UIPanel, UIRow } from './libs/ui.js';

function MenubarExamples( editor ) {

	var container = new UIPanel();
	container.setClass( 'menu' );

	var title = new UIPanel();
	title.setClass( 'title' );
	title.setTextContent( 'Examples' );
	container.add( title );

	var options = new UIPanel();
	options.setClass( 'options' );
	container.add( options );

	// Examples

	var items = [
		{ title: 'HTML Colors', file: 'html_colors.md' },
		{ title: 'HTML Loop', file: 'html_loop.md' },
		{ title: 'Three.js Cube', file: 'threejs_cube.md' },
		{ title: 'Three.js Shaders', file: 'threejs_shaders.md' }
	];

	for ( var i = 0; i < items.length; i ++ ) {

		( function ( i ) {

			var item = items[ i ];

			var option = new UIRow();
			option.setClass( 'option' );
			option.setTextContent( item.title );
			option.onClick( async function () {

				if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {

					editor.clear();

					const response = await fetch( './examples/' + item.file );
					await editor.fromMarkdown( await response.text() );

					editor.setTime( 0 );

				}

			} );
			options.add( option );

		} )( i )

	}

	return container;

}

export { MenubarExamples };
