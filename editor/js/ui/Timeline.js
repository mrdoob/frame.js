var Timeline = function ( signals ) {

	var container = new UI.Panel( 'absolute' );
	container.setClass( 'timeline' );
	container.dom.style.overflow = 'auto'; // TODO: UIify.
	container.dom.addEventListener( 'click', function ( event ) {

		signals.setTime.dispatch( ( event.x + this.scrollLeft ) / scale );

	}, false );

	//

	var scale = 32;

	var marks = document.createElement( 'div' );
	marks.style.width = '2512px';
	marks.style.height = '16px';
	marks.style.background = 'url(' + ( function () {

		var canvas = document.createElement( 'canvas' );
		canvas.width = scale;
		canvas.height = 16;

		var context = canvas.getContext( '2d' );
		context.fillStyle = '#aaa';
		context.fillRect( 0, 8, 1, 8 );
		context.fillStyle = '#888';
		context.fillRect( Math.floor( scale / 2 ), 8, 1, 8 );
		return canvas.toDataURL();

	}() ) + ') repeat-x';
	container.dom.appendChild( marks );

	var grid = document.createElement( 'div' );
	grid.style.position = 'absolute';
	grid.style.top = '16px';
	grid.style.width = '2512px';
	grid.style.height = '-webkit-calc(100% - 16px)';
	grid.style.background = 'url(' + ( function () {

		var canvas = document.createElement( 'canvas' );
		canvas.width = 1;
		canvas.height = 32;

		var context = canvas.getContext( '2d' );
		context.fillStyle = '#555';
		context.fillRect( 0, 0, 1, 1 );
		return canvas.toDataURL();

	}() ) + ')';
	container.dom.appendChild( grid );

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

			// time.style.left = ( time.offsetLeft + movementX ) + 'px';

			signals.setTime.dispatch( ( time.offsetLeft + movementX + 8 ) / scale );

		};

		var onMouseUp = function ( event ) {

			document.removeEventListener( 'mousemove', onMouseMove );
			document.removeEventListener( 'mouseup', onMouseUp );

		};

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );

	}, false );
	container.dom.appendChild( time );

	var Block = ( function ( element ) {

		var dom = document.createElement( 'div' );
		dom.className = 'block';
		dom.style.position = 'absolute';
		dom.style.left = ( element.start * scale ) + 'px';
		dom.style.top = ( element.layer * 32 ) + 'px';
		dom.style.width = ( element.duration * scale ) + 'px';
		dom.style.height = '30px';
		dom.innerHTML = '<div class="name">' + element.name + '</div>';
		dom.addEventListener( 'mousedown', function ( event ) {

			var onMouseMove = function ( event ) {

				var movementX = event.movementX | event.webkitMovementX | event.mozMovementX | 0;

				dom.style.left = ( dom.offsetLeft + movementX ) + 'px';

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

	} );

	return container;

}
