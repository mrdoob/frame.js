Menubar.Help = function ( signals ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setTextContent( 'Help' ).setColor( '#666' );
	title.setMargin( '0px' );
	title.setPadding( '8px' );
	container.add( title );

	//

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	return container;

}
