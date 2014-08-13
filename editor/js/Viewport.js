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

	signals.fullscreen.add( function () {

		var elem = container.dom.children[ 0 ];

		if ( elem.requestFullscreen ) elem.requestFullscreen();
		if ( elem.msRequestFullscreen ) elem.msRequestFullscreen();
		if ( elem.mozRequestFullScreen ) elem.mozRequestFullScreen();
		if ( elem.webkitRequestFullscreen ) elem.webkitRequestFullscreen();

	} );

	return container;

}
