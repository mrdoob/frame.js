var Viewport = function ( editor ) {

	var container = new UI.Panel();

	var time = 0;
	var timeline = editor.timeline;

	// signals

	var signals = editor.signals;

	signals.timeChanged.add( function ( value ) {

		time = value;
		timeline.update( time );

	} );

	signals.timelineElementChanged.add( function ( element ) {

		timeline.reset();
		timeline.sort();
		timeline.update( time );

	} );

	return container;

}
