/**
 * @author mrdoob / http://mrdoob.com/
 */

import { UIPanel } from './libs/ui.js';

import { TimelineAnimations } from './TimelineAnimations.js';
import { TimelineCurves } from './TimelineCurves.js';

function Timeline( editor ) {

	var signals = editor.signals;
	var player = editor.player;

	var container = new UIPanel();
	container.setId( 'timeline' );

	// timeline

	var keysDown = {};
	document.addEventListener( 'keydown', function ( event ) { keysDown[ event.keyCode ] = true; } );
	document.addEventListener( 'keyup',   function ( event ) { keysDown[ event.keyCode ] = false; } );

	var scale = 32;

	var timeline = new UIPanel();
	timeline.setPosition( 'absolute' );
	timeline.setLeft( '0px' );
	timeline.setTop( '0px' );
	timeline.setBottom( '0px' );
	timeline.setRight( '0px' );
	timeline.setOverflow( 'hidden' );
	container.add( timeline );

	const devicePixelRatio = window.devicePixelRatio;

	var canvas = document.createElement( 'canvas' );
	canvas.height = 32 * devicePixelRatio;
	canvas.style.height = '32px';
	canvas.style.position = 'absolute';
	canvas.addEventListener( 'mousedown', function ( event ) {

		event.preventDefault();

		function onMouseMove( event ) {

			editor.setTime( ( event.offsetX + scroller.scrollLeft ) / scale );

		}

		function onMouseUp( event ) {

			onMouseMove( event );

			document.removeEventListener( 'mousemove', onMouseMove );
			document.removeEventListener( 'mouseup', onMouseUp );

		}

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );

	}, false );
	timeline.dom.appendChild( canvas );

	function updateMarks() {

		canvas.width = scroller.clientWidth * devicePixelRatio;
		canvas.style.width = scroller.clientWidth + 'px';

		var context = canvas.getContext( '2d', { alpha: false } );
		context.scale( devicePixelRatio, devicePixelRatio );

		context.fillStyle = '#555';
		context.fillRect( 0, 0, canvas.width, canvas.height );

		context.strokeStyle = '#888';
		context.beginPath();

		context.translate( - scroller.scrollLeft, 0 );

		var duration = editor.duration;
		var width = duration * scale;
		var scale4 = scale / 4;

		for ( var i = 0.5; i <= width; i += scale ) {

			context.moveTo( i + ( scale4 * 0 ), 18 ); context.lineTo( i + ( scale4 * 0 ), 26 );

			if ( scale > 16 ) context.moveTo( i + ( scale4 * 1 ), 22 ), context.lineTo( i + ( scale4 * 1 ), 26 );
			if ( scale >  8 ) context.moveTo( i + ( scale4 * 2 ), 22 ), context.lineTo( i + ( scale4 * 2 ), 26 );
			if ( scale > 16 ) context.moveTo( i + ( scale4 * 3 ), 22 ), context.lineTo( i + ( scale4 * 3 ), 26 );

		}

		context.stroke();

		context.font = '10px Arial';
		context.fillStyle = '#888'
		context.textAlign = 'center';

		var step = Math.max( 1, Math.floor( 64 / scale ) );

		for ( var i = 0; i < duration; i += step ) {

			var minute = Math.floor( i / 60 );
			var second = Math.floor( i % 60 );

			var text = `${ minute }:${ second.toString().padStart( 2, '0' ) }`;

			context.fillText( text, i * scale, 13 );

		}

	}

	var scroller = document.createElement( 'div' );
	scroller.style.position = 'absolute';
	scroller.style.top = '32px';
	scroller.style.bottom = '0px';
	scroller.style.width = '100%';
	scroller.style.overflow = 'auto';
	scroller.addEventListener( 'scroll', function ( event ) {

		updateMarks();
		updateTimeMark();

	}, false );
	timeline.dom.appendChild( scroller );

	var elements = new TimelineAnimations( editor );
	scroller.appendChild( elements.dom );

	var curves = new TimelineCurves( editor );
	curves.setDisplay( 'none' );
	scroller.appendChild( curves.dom );

	function updateContainers() {

		var width = editor.duration * scale;

		elements.setWidth( width + 'px' );
		curves.setWidth( width + 'px' );

	}

	//

	var loopMark = document.createElement( 'div' );
	loopMark.style.position = 'absolute';
	loopMark.style.top = 0;
	loopMark.style.height = 100 + '%';
	loopMark.style.width = 0;
	loopMark.style.background = 'rgba( 255, 255, 255, 0.1 )';
	loopMark.style.pointerEvents = 'none';
	loopMark.style.display = 'none';
	timeline.dom.appendChild( loopMark );

	var timeMark = document.createElement( 'div' );
	timeMark.style.position = 'absolute';
	timeMark.style.top = '0px';
	timeMark.style.left = '-8px';
	timeMark.style.width = '16px';
	timeMark.style.height = '100%';
	timeMark.style.background = 'linear-gradient(90deg, transparent 8px, #f00 8px, #f00 9px, transparent 9px) 0% 0% / 16px 16px repeat-y';
	timeMark.style.pointerEvents = 'none';
	timeMark.style.marginTop = '16px';
	timeMark.appendChild( createTimeMarkImage() );
	timeline.dom.appendChild( timeMark );

	function createTimeMarkImage() {

		var canvas = document.createElement( 'canvas' );
		canvas.width = 16;
		canvas.height = 16;

		var context = canvas.getContext( '2d' );
		context.fillStyle = '#f00';
		context.beginPath();
		context.moveTo( 2, 0 );
		context.lineTo( 14, 0 );
		context.lineTo( 14, 10 );
		context.lineTo( 8, 16 );
		context.lineTo( 2, 10 );
		context.lineTo( 2, 0 );
		context.fill();

		return canvas;

	}

	function updateTimeMark() {

		var offsetLeft = ( player.currentTime * scale ) - scroller.scrollLeft - 8;

		timeMark.style.left = offsetLeft + 'px';

		/*
		if ( editor.player.isPlaying ) {

			var timelineWidth = timeline.dom.offsetWidth - 8;

			// Auto-scroll if end is reached

			if ( offsetLeft > timelineWidth ) {

				scroller.scrollLeft += timelineWidth;

			}

		}
		*/

		// TODO Optimise this

		var loop = player.getLoop();

		if ( Array.isArray( loop ) ) {

			var loopStart = loop[ 0 ] * scale;
			var loopEnd = loop[ 1 ] * scale;

			loopMark.style.display = '';
			loopMark.style.left = ( loopStart - scroller.scrollLeft ) + 'px';
			loopMark.style.width = ( loopEnd - loopStart ) + 'px';

		} else {

			loopMark.style.display = 'none';

		}

	}

	// signals

	signals.durationChanged.add( function () {

		updateMarks();
		updateContainers();

	} );

	function checkTimeMarkVisibility() {

		const timeMarkRect = timeMark.getBoundingClientRect();
		const timelineRect = timeline.dom.getBoundingClientRect();
		
		// Check if timeMark is outside the visible timeline area
		if ( timeMarkRect.left < timelineRect.left || timeMarkRect.right > timelineRect.right ) {
			
			// Calculate the scroll position to center the timeMark
			// Need to account for scale since timeMark position is based on scaled time
			const timeMarkX = ( player.currentTime * scale ) - 8; // Same calculation as updateTimeMark()
			const timelineWidth = timelineRect.width;
			const scrollTo = timeMarkX - ( timelineWidth / 2 );
			
			// Instant scroll to the timeMark
			scroller.scrollLeft = scrollTo;
		}

	}

	signals.timeBackward.add( function () {

		const player = editor.player;
		const time = player.currentTime - ( 32 / scale );

		editor.setTime( time );

	} );

	signals.timeForward.add( function () {

		const player = editor.player;
		const time = player.currentTime + ( 32 / scale );

		editor.setTime( time );

	} );

	signals.timeChanged.add( function () {

		updateTimeMark();
		checkTimeMarkVisibility();

	} );

	signals.timelineZoomIn.add( function () {

		const newScale = scale + 5;

		const timeMarkX = timeMark.offsetLeft;
		const timeMarkTime = ( scroller.scrollLeft + timeMarkX ) / scale;

		signals.timelineZoomed.dispatch( newScale );

		scroller.scrollLeft = ( timeMarkTime * scale ) - timeMarkX;

	} );

	signals.timelineZoomOut.add( function () {

		const newScale = Math.max( 10, scale - 5 );

		const timeMarkX = timeMark.offsetLeft;
		const timeMarkTime = ( scroller.scrollLeft + timeMarkX ) / scale;
		
		signals.timelineZoomed.dispatch( newScale );
		
		scroller.scrollLeft = ( timeMarkTime * scale ) - timeMarkX;

	} );

	signals.timelineZoomed.add( function ( value ) {

		scale = value;

		updateMarks();
		updateTimeMark();
		updateContainers();

	} );

	signals.windowResized.add( function () {

		updateMarks();
		updateContainers();

	} );

	signals.showAnimations.add(function () {
		elements.setDisplay('');
		curves.setDisplay('none');
	});

	signals.showCurves.add(function () {
		elements.setDisplay('none');
		curves.setDisplay('');
	});

	return container;

}

export { Timeline };
