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

	renderer = new THREE.WebGLRenderer(); // TODO: Remove this nasty global
	renderer.setSize( 800, 600 );
	renderer.autoClear = false;
	renderer.domElement.style.maxWidth = '100%';
	renderer.domElement.style.maxHeight = '100%';
	container.dom.appendChild( renderer.domElement );
	
	var time = 0;

	var timeline = new FRAME.Timeline();

	var render = function () {

		timeline.render( time );		

	};

	// signals

	signals.timeChanged.add( function ( value ) {

		time = value;
		render();

	} );

	signals.addTimelineElement.add( function ( element ) {

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