var Timeline = function ( signals ) {

	var container = new UI.Panel( 'absolute' );
	container.setClass( 'timeline' );

	var panel = new UI.Panel( 'absolute' );
	panel.setWidth( '300px' );
	panel.setHeight( '100%' );
	panel.dom.style.background = '#666 url(' + ( function () {

		var canvas = document.createElement( 'canvas' );
		canvas.width = 1;
		canvas.height = 32;

		var context = canvas.getContext( '2d' );
		context.fillStyle = '#555';
		context.fillRect( 0, 0, 1, 1 );
		return canvas.toDataURL();

	}() ) + ')';
	container.add( panel );

	// controls

	var controls = new UI.Panel( 'absolute' );
	controls.setPadding( '5px 4px' );
	panel.add( controls );

	var button = new UI.Button();
	button.setLabel( '<<' );
	button.onClick( function () { signals.backwards.dispatch() } );
	controls.add( button );

	var button = new UI.Button();
	button.setLabel( '>' );
	button.onClick( function () { signals.play.dispatch() } );
	controls.add( button );

	var button = new UI.Button();
	button.setLabel( '>>' );
	button.onClick( function () { signals.forwards.dispatch() } );
	controls.add( button );

	var currentTime = new UI.Text();
	currentTime.setColor( '#bbb' );
	currentTime.setMarginLeft( '10px' );
	currentTime.setValue( '0:00.00' );
	controls.add( currentTime );

	// timeline

	var scale = 32;

	var timeline = new UI.Panel( 'absolute' );
	timeline.setLeft( '300px' );
	timeline.setWidth( '-webkit-calc( 100% - 300px )' );
	timeline.setWidth( '-moz-calc( 100% - 300px )' );
	timeline.setWidth( 'calc( 100% - 300px )' );
	timeline.setHeight( '100%' );
	timeline.dom.style.overflow = 'auto'; // TODO: UIify.
	timeline.dom.addEventListener( 'click', function ( event ) {

		signals.setTime.dispatch( ( event.clientX + this.scrollLeft - this.offsetLeft ) / scale );

	}, false );
	container.add( timeline );

	var marks = new UI.Panel( 'absolute' );
	marks.setWidth( '2512px' );
	marks.setHeight( '32px' );
	marks.dom.style.background = 'url(' + ( function () {

		var canvas = document.createElement( 'canvas' );
		canvas.width = scale;
		canvas.height = 8;

		var context = canvas.getContext( '2d' );
		context.fillStyle = '#aaa';
		context.fillRect( 0, 0, 1, 8 );
		context.fillStyle = '#888';
		context.fillRect( Math.floor( scale / 4 ), 4, 1, 4 );
		context.fillRect( Math.floor( scale / 4 ) * 2, 4, 1, 4 );
		context.fillRect( Math.floor( scale / 4 ) * 3, 4, 1, 4 );
		return canvas.toDataURL();

	}() ) + ') repeat-x';
	marks.dom.style.backgroundPosition = 'bottom';
	timeline.add( marks );

	var grid = document.createElement( 'div' );
	grid.style.position = 'absolute';
	grid.style.top = '32px';
	grid.style.width = '2512px';
	grid.style.height = '-webkit-calc(100% - 32px)';
	grid.style.height = '-moz-calc(100% - 32px)';
	grid.style.height = '-calc(100% - 32px)';
	grid.style.background = 'url(' + ( function () {

		var canvas = document.createElement( 'canvas' );
		canvas.width = 1;
		canvas.height = 32;

		var context = canvas.getContext( '2d' );
		context.fillStyle = '#444';
		context.fillRect( 0, 0, 1, 1 );
		return canvas.toDataURL();

	}() ) + ')';
	timeline.dom.appendChild( grid );

	//

	var time = document.createElement( 'div' );
	time.style.position = 'absolute';
	time.style.top = '0px';
	time.style.left = '-8px';
	time.style.width = '16px';
	time.style.height = '100%';
	time.style.cursor = 'move';
	time.style.background = 'url(' + ( function () {

		var canvas = document.createElement( 'canvas' );
		canvas.width = 16;
		canvas.height = 1;

		var context = canvas.getContext( '2d' );
		context.fillStyle = '#f00';
		context.fillRect( 8, 0, 1, 1 );
		return canvas.toDataURL();

	}() ) + ')';
	time.addEventListener( 'mousedown', function ( event ) {

		var onMouseMove = function ( event ) {

			var movementX = event.movementX | event.webkitMovementX | event.mozMovementX | 0;
			signals.setTime.dispatch( ( time.offsetLeft + movementX + 8 ) / scale );

		};

		var onMouseUp = function ( event ) {

			document.removeEventListener( 'mousemove', onMouseMove );
			document.removeEventListener( 'mouseup', onMouseUp );

		};

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );

	}, false );
	timeline.dom.appendChild( time );

	var Block = ( function ( element ) {

		var dom = document.createElement( 'div' );
		dom.className = 'block';
		dom.style.position = 'absolute';
		dom.style.left = ( element.start * scale ) + 'px';
		dom.style.top = ( element.layer * 32 ) + 'px';
		dom.style.width = ( element.duration * scale - 2 ) + 'px';
		dom.style.height = '30px';
		dom.innerHTML = '<div class="name">' + element.name + '</div>';
		dom.addEventListener( 'mousedown', function ( event ) {

			/*
			var onMouseDownLeft = dom.offsetLeft;
			var onMouseDownTop = dom.offsetTop;

			var onMouseDownX = event.clientX;
			var onMouseDownY = event.clientY;
			*/

			var onMouseMove = function ( event ) {

				var movementX = event.movementX | event.webkitMovementX | event.mozMovementX | 0;
				// var movementY = event.movementY | event.webkitMovementY | event.mozMovementY | 0;

				dom.style.left = ( dom.offsetLeft + movementX ) + 'px';
				// dom.style.top = ( dom.offsetTop + movementX ) + 'px';

				element.start += movementX / scale;
				element.end += movementX / scale;

				signals.timelineElementChanged.dispatch( element );

			};

			var onMouseUp = function ( event ) {

				document.removeEventListener( 'mousemove', onMouseMove );
				document.removeEventListener( 'mouseup', onMouseUp );

			};

			document.addEventListener( 'mousemove', onMouseMove, false );
			document.addEventListener( 'mouseup', onMouseUp, false );

		}, false );

		this.dom = dom;

		return this;

	} );

	// signals

	signals.addTimelineElement.add( function ( element ) {

		var block = new Block( element );
		grid.appendChild( block.dom );

	} );

	signals.timeChanged.add( function ( value ) {

		time.style.left = ( value * scale ) - 8 + 'px';

		var minutes = Math.floor( value / 60 );
		var seconds = value % 60;
		var padding = seconds < 10 ? '0' : '';

		currentTime.setValue( minutes + ':' + padding + seconds.toFixed( 2 ) );

	} );

	return container;

}
