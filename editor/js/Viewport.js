var Viewport = function ( editor ) {

    var signals = editor.signals;

	var container = new UI.Panel();
    
    editor.dom = container.dom;

	var time = 0;
	var timeline = editor.timeline;

	var render = function () {

		timeline.update( time );

	};

	// signals

	signals.timeChanged.add( function ( value ) {

		time = value;
		render();

	} );

	signals.elementAdded.add( function ( element ) {

		render();

	} );

	signals.timelineElementChanged.add( function ( element ) {

		timeline.reset();
		timeline.sort();
		render();

	} );


	return container;

}
