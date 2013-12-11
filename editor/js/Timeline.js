var Timeline = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();

	var panel = new UI.Panel();
	panel.setPosition( 'absolute' );
	panel.setWidth( '300px' );
	panel.setHeight( '100%' );
	panel.dom.style.background = '#555';
	container.add( panel );

	// controls

	var controls = new UI.Panel();
	controls.setPosition( 'absolute' );
	controls.setWidth( '100%' );
	controls.setPadding( '5px 0px' );
	controls.setBackground( '#666' );
	panel.add( controls );

	var button = new UI.Button();
	button.setLabel( '►' );
	button.setMarginLeft( '5px' );
	button.setPaddingRight( '4px' );
	button.onClick( function () { signals.play.dispatch() } );
	controls.add( button );

	var timeText = new UI.Text();
	timeText.setColor( '#bbb' );
	timeText.setMarginLeft( '5px' );
	timeText.setValue( '0:00.00' );
	controls.add( timeText );

	var updateTimeText = function ( value ) {

		var minutes = Math.floor( value / 60 );
		var seconds = value % 60;
		var padding = seconds < 10 ? '0' : '';

		timeText.setValue( minutes + ':' + padding + seconds.toFixed( 2 ) );

	};

	var playbackRateText = new UI.Text();
	playbackRateText.setColor( '#999' );
	playbackRateText.setMarginLeft( '5px' );
	playbackRateText.setValue( '1.0x' );
	controls.add( playbackRateText );

	var updatePlaybackRateText = function ( value ) {

		playbackRateText.setValue( value.toFixed( 1 ) + 'x' );

	};

	var button = new UI.Button();
	button.setLabel( 'MODULES' );
	button.setMarginLeft( '60px' );
	button.onClick( function () { 

		modules.setDisplay( '' );
		curves.setDisplay( 'none' );

	 } );
	controls.add( button );

	var button = new UI.Button();
	button.setLabel( 'CURVES' );
	button.onClick( function () {

		scroller.style.background = '';

		modules.setDisplay( 'none' );
		curves.setDisplay( '' );

	} );
	controls.add( button );

	// timeline

	var keysDown = {};
	document.addEventListener( 'keydown', function ( event ) { keysDown[ event.keyCode ] = true; } );
	document.addEventListener( 'keyup',   function ( event ) { keysDown[ event.keyCode ] = false; } );

	var time = 0;
	var scale = 32;
	var prevScale = scale;
	var duration = 0;

	var timeline = new UI.Panel();
	timeline.setPosition( 'absolute' );
	timeline.setLeft( '300px' );
	timeline.setRight( '0px');
	timeline.setTop( '0px' );
	timeline.setBottom( '0px' );
	timeline.setOverflow( 'hidden' );
	timeline.dom.addEventListener( 'mousewheel', function ( event ) {
	
		// check if [shift] is pressed

		if ( keysDown[ 16 ] === true ) {

			event.preventDefault();
 
			scale = Math.max( 1, scale + ( event.wheelDeltaY / 10 ) );

			signals.timelineScaled.dispatch( scale );

		}
	
	} );
	container.add( timeline );

	var marks = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
	marks.style.position = 'absolute';
	marks.setAttribute( 'width', '100%' );
	marks.setAttribute( 'height', '32px' );
	timeline.dom.appendChild( marks );

	var marksPath = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
	marksPath.setAttribute( 'style', 'stroke: #888; stroke-width: 1px; fill: none;' );
	marks.appendChild( marksPath );

	marks.addEventListener( 'mousedown', function ( event ) {

		var onMouseMove = function ( event ) {
			
			signals.setTime.dispatch( ( event.offsetX + scroller.scrollLeft ) / scale );

		};

		var onMouseUp = function ( event ) {

			onMouseMove( event );

			marks.removeEventListener( 'mousemove', onMouseMove );
			document.removeEventListener( 'mouseup', onMouseUp );

		};

		marks.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );

	}, false );
	timeline.dom.appendChild( marks );

	var updateMarks = function () {

		var drawing = '';
		var scale4 = scale / 4;
		var offset = - scroller.scrollLeft % scale;
		var width = marks.getBoundingClientRect().width || 1024;

		for ( var i = offset, l = width; i <= l; i += scale ) {

			drawing += 'M ' + i + ' 8 L' + i + ' 24';
			drawing += 'M ' + ( i + ( scale4 * 1 ) ) + ' 12 L' + ( i + ( scale4 * 1 ) ) + ' 20';
			drawing += 'M ' + ( i + ( scale4 * 2 ) ) + ' 12 L' + ( i + ( scale4 * 2 ) ) + ' 20';
			drawing += 'M ' + ( i + ( scale4 * 3 ) ) + ' 12 L' + ( i + ( scale4 * 3 ) ) + ' 20';

		}

		marksPath.setAttribute( 'd', drawing );

	};

	var scroller = document.createElement( 'div' );
	scroller.style.position = 'absolute';
	scroller.style.top = '32px';
	scroller.style.bottom = '0px'
	scroller.style.width = '100%';
	scroller.style.overflow = 'auto';
	scroller.addEventListener( 'scroll', function ( event ) {

		updateMarks();
		updateTimeMark();

	}, false );
	timeline.dom.appendChild( scroller );

	var modules = new Timeline.Modules( editor );
	scroller.appendChild( modules.dom );

	var curves = new Timeline.Curves( editor );
	curves.setDisplay( 'none' );
	scroller.appendChild( curves.dom );

	var updateContainers = function () {

		var width = duration * scale;
		
		modules.setWidth( width + 'px' );
		curves.setWidth( width + 'px' );

	};

	//

	var timeMark = document.createElement( 'div' );
	timeMark.style.position = 'absolute';
	timeMark.style.top = '0px';
	timeMark.style.left = '-8px';
	timeMark.style.width = '16px';
	timeMark.style.height = '100%';
	timeMark.style.background = 'url(' + ( function () {

		var canvas = document.createElement( 'canvas' );
		canvas.width = 16;
		canvas.height = 1;

		var context = canvas.getContext( '2d' );
		context.fillStyle = '#f00';
		context.fillRect( 8, 0, 1, 1 );
		
		return canvas.toDataURL();

	}() ) + ')';
	timeMark.style.pointerEvents = 'none';
	timeline.dom.appendChild( timeMark );

	var updateTimeMark = function () {

		timeMark.style.left = ( time * scale ) - scroller.scrollLeft - 8 + 'px';

	};

	updateMarks();

	// signals

	signals.durationChanged.add( function ( value ) {

		duration = value;

		updateContainers();

	} );

	signals.timeChanged.add( function ( value ) {

		time = value;

		updateTimeText( value );
		updateTimeMark();

	} );

	signals.playbackRateChanged.add( function ( value ) {

		updatePlaybackRateText( value );

	} );

	signals.timelineScaled.add( function ( value ) {

		scale = value;
			
		scroller.scrollLeft = ( scroller.scrollLeft * value ) / prevScale;

		updateMarks();
		updateTimeMark();
		updateContainers();

		prevScale = value;

	} );

	return container;

}
