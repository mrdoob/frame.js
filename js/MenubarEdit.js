/**
 * @author mrdoob / http://mrdoob.com/
 */

import { UIPanel } from './libs/ui.js';

function MenubarEdit( editor ) {

	var container = new UIPanel();
	container.setClass( 'menu' );

	var title = new UIPanel();
	title.setClass( 'title' );
	title.setTextContent( 'Edit' );
	container.add( title );

	//

	var options = new UIPanel();
	options.setClass( 'options' );
	container.add( options );

	// duplicate

	var option = new UIPanel();
	option.setClass( 'option' );
	option.setTextContent( 'Duplicate' );
	option.onClick( function () {

		if ( editor.selected === null ) return;

		editor.duplicateAnimation( editor.selected );

	} );
	options.add( option );

	// remove

	var option = new UIPanel();
	option.setClass( 'option' );
	option.setTextContent( 'Remove' );
	option.onClick( function () {

		if ( editor.selected === null ) return;

		editor.removeAnimation( editor.selected );
		editor.selectAnimation( null );

	} );
	options.add( option );

	return container;

}

export { MenubarEdit };
