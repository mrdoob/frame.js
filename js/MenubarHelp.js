/**
 * @author mrdoob / http://mrdoob.com/
 */

function MenubarHelp( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Help' );
	container.add( title );

	//

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// source code

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Source code' );
	option.onClick( function () { window.open( 'https://github.com/mrdoob/frame.js/', '_blank' ) } );
	options.add( option );

	return container;

}

export { MenubarHelp };
