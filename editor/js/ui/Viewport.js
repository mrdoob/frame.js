var Viewport = function ( signals ) {

	var container = new UI.Panel( 'absolute' );
	container.setClass( 'viewport' );
	container.dom.style.textAlign = 'center';

	/*
	var audio = document.createElement( 'audio' );
	audio.controls = true;
	audio.src = 'files/lug00ber-bastion-amstel.mp3';
	document.body.appendChild( audio );

	document.body.appendChild( document.createElement( 'br' ) );
	*/

	var time = 0;

	var timeline = new FRAME.Timeline();

	var render = function () {

		timeline.update( time );

	};

	// signals

	signals.timeChanged.add( function ( value ) {

		time = value;
		render();

	} );

	signals.addTimelineElement.add( function ( element ) {

		var module = element.module;

		if ( module.parameters.input.dom !== undefined ) {

			module.parameters.input.dom = container.dom;

		}

		timeline.add( element );
		render();

	} );

	signals.timelineElementChanged.add( function ( element ) {

		timeline.reset();
		timeline.sort();
		render();

	} );


	return container;

}
