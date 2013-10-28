Menubar.Edit = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setTextContent( 'Edit' ).setColor( '#888' );
	title.setMargin( '0px' );
	title.setPadding( '8px' );
	container.add( title );

	//

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );
    
    // clone
    
    var option = new UI.Panel();
    option.setClass( 'option' );
	option.setTextContent( 'Clone' );
	option.onClick( function () {
    
        if ( editor.selected === null ) return;

        var selected = editor.selected;
        
        var element = new FRAME.TimelineElement(
            selected.name,
            selected.layer,
            selected.start,
            selected.duration,
            selected.module,
            JSON.parse( JSON.stringify( selected.parameters ) )
        );
        element.start += element.duration;

        editor.add( element );
        editor.select( element );
    
	} );
	options.add( option );

    // remove
    
    var option = new UI.Panel();
    option.setClass( 'option' );
    option.setTextContent( 'Remove' );
	option.onClick( function () {
    
        if ( editor.selected === null ) return;

        editor.remove( editor.selected );
        editor.select( null );
    
	} );
	options.add( option );

	return container;

}
