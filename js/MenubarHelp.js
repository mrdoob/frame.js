/**
 * @author mrdoob / http://mrdoob.com/
 */

import { UIPanel } from './libs/ui.js';

function MenubarHelp( editor ) {

	var container = new UIPanel();
	container.setClass( 'menu' );

	var title = new UIPanel();
	title.setClass( 'title' );
	title.setTextContent( 'Help' );
	container.add( title );

	//

	var options = new UIPanel();
	options.setClass( 'options' );
	container.add( options );

	// source code

	var option = new UIPanel();
	option.setClass( 'option' );
	option.setTextContent( 'Source code' );
	option.onClick( function () { window.open( 'https://github.com/mrdoob/frame.js/', '_blank' ) } );
	options.add( option );

	return container;

}

export { MenubarHelp };
