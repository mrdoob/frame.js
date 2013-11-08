var Timeline = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();

	var panel = new UI.Panel();
	panel.setPosition( 'absolute' );
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

	var controls = new UI.Panel();
	controls.setPosition( 'absolute' );
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

	var timeText = new UI.Text();
	timeText.setColor( '#bbb' );
	timeText.setMarginLeft( '10px' );
	timeText.setValue( '0:00.00' );
	controls.add( timeText );

	// timeline

	var time = 0;
	var scale = 32;
	var prevScale = scale;

	var timeline = new UI.Panel();
	timeline.setPosition( 'absolute' );
	timeline.setLeft( '300px' );
	timeline.setWidth( '-webkit-calc( 100% - 300px )' );
	timeline.setWidth( '-moz-calc( 100% - 300px )' );
	timeline.setWidth( 'calc( 100% - 300px )' );
	timeline.setHeight( '100%' );
	timeline.dom.style.overflow = 'auto'; // TODO: UIify.
	timeline.dom.addEventListener( 'mousewheel', function ( event ) {
	
		scale = Math.max( 1, scale + ( event.wheelDeltaY / 10 ) );
				
		for ( var key in blocks ) {
		
			blocks[ key ].update();
			
		}

		timeline.dom.scrollLeft = ( timeline.dom.scrollLeft * scale ) / prevScale;

		updateTimeMark();

		prevScale = scale;
	
	} );
	container.add( timeline );

	var marks = document.createElement( 'div' );
	marks.style.position = 'absolute';
	marks.style.width = '8192px';
	marks.style.height = '32px';
	marks.style.background = 'url(' + ( function () {

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
	marks.style.backgroundPosition = 'bottom';
	marks.addEventListener( 'click', function ( event ) {

		signals.setTime.dispatch( event.offsetX / scale );
	
	}, false );
	marks.addEventListener( 'mousedown', function ( event ) {

		var onMouseMove = function ( event ) {
			
			signals.setTime.dispatch( event.offsetX / scale );

		};

		var onMouseUp = function ( event ) {
			
			marks.removeEventListener( 'mousemove', onMouseMove );
			document.removeEventListener( 'mouseup', onMouseUp );

		};

		marks.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );

	}, false );
	timeline.dom.appendChild( marks );

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

		timeMark.style.left = ( time * scale ) - 8 + 'px';

	};

	var Block = ( function ( element ) {
		
		var scope = this;

		var dom = document.createElement( 'div' );
		dom.className = 'block';
		dom.style.position = 'absolute';
		dom.style.height = '30px';
		dom.addEventListener( 'mousedown', function ( event ) {

			var movementX = 0;
			var movementY = 0;

			var onMouseMove = function ( event ) {

				movementX = event.movementX | event.webkitMovementX | event.mozMovementX | 0;

				element.start += movementX / scale;
				
				update();

				signals.timelineElementChanged.dispatch( element );

			};

			var onMouseUp = function ( event ) {
				
				if ( Math.abs( movementX ) < 2 ) {
					
					editor.select( element )
					
				}

				document.removeEventListener( 'mousemove', onMouseMove );
				document.removeEventListener( 'mouseup', onMouseUp );

			};

			document.addEventListener( 'mousemove', onMouseMove, false );
			document.addEventListener( 'mouseup', onMouseUp, false );

		}, false );

		var resizeLeft = document.createElement( 'div' );
		resizeLeft.style.position = 'absolute';
		resizeLeft.style.width = '6px';
		resizeLeft.style.height = '30px';
		resizeLeft.style.cursor = 'w-resize';
		resizeLeft.addEventListener( 'mousedown', function ( event ) {

			event.stopPropagation();
			
			var movementX = 0;

			var onMouseMove = function ( event ) {

				movementX = event.movementX | event.webkitMovementX | event.mozMovementX | 0;

				element.start += movementX / scale;
				element.duration -= movementX / scale;
				
				update();

				signals.timelineElementChanged.dispatch( element );

			};

			var onMouseUp = function ( event ) {
				
				if ( Math.abs( movementX ) < 2 ) {
					
					editor.select( element )
					
				}

				document.removeEventListener( 'mousemove', onMouseMove );
				document.removeEventListener( 'mouseup', onMouseUp );

			};

			document.addEventListener( 'mousemove', onMouseMove, false );
			document.addEventListener( 'mouseup', onMouseUp, false );

		}, false );
		dom.appendChild( resizeLeft );

		var name = document.createElement( 'div' );
		name.className = 'name';
		name.textContent = element.name;
		dom.appendChild( name );

		var resizeRight = document.createElement( 'div' );
		resizeRight.style.position = 'absolute';
		resizeRight.style.right = '0px';
		resizeRight.style.top = '0px';
		resizeRight.style.width = '6px';
		resizeRight.style.height = '30px';
		resizeRight.style.cursor = 'e-resize';
		resizeRight.addEventListener( 'mousedown', function ( event ) {

			event.stopPropagation();
			
			var movementX = 0;

			var onMouseMove = function ( event ) {

				movementX = event.movementX | event.webkitMovementX | event.mozMovementX | 0;
				element.duration += movementX / scale;
				
				update();

				signals.timelineElementChanged.dispatch( element );

			};

			var onMouseUp = function ( event ) {
				
				if ( Math.abs( movementX ) < 2 ) {
					
					editor.select( element )
					
				}

				document.removeEventListener( 'mousemove', onMouseMove );
				document.removeEventListener( 'mouseup', onMouseUp );

			};

			document.addEventListener( 'mousemove', onMouseMove, false );
			document.addEventListener( 'mouseup', onMouseUp, false );

		}, false );
		dom.appendChild( resizeRight );
		
		var update = function () {
			
			dom.style.left = ( element.start * scale ) + 'px';
			dom.style.top = ( element.layer * 32 ) + 'px';
			dom.style.width = ( element.duration * scale - 2 ) + 'px';

		};

		update();

		this.dom = dom;
		
		this.select = function () {
		  
			dom.className = 'block selected';
			
		};
		
		this.deselect = function () {

			dom.className = 'block';
			
		};
		
		this.update = update;

		return this;

	} );

	// signals

	var blocks = {};
	var selected = null;

	signals.elementAdded.add( function ( element ) {

		var block = new Block( element );
		grid.appendChild( block.dom );
		
		blocks[ element.id ] = block;

	} );
	
	signals.elementSelected.add( function ( element ) {

		if ( blocks[ selected ] !== undefined ) {
			
			blocks[ selected ].deselect();
			
		}
		
		selected = element.id;
		blocks[ selected ].select();

	} );

	signals.timeChanged.add( function ( value ) {

		time = value;

		var minutes = Math.floor( value / 60 );
		var seconds = value % 60;
		var padding = seconds < 10 ? '0' : '';

		timeText.setValue( minutes + ':' + padding + seconds.toFixed( 2 ) );

		updateTimeMark();

	} );

	signals.elementRemoved.add( function ( element ) {
	
			var block = blocks[ element.id ];
			grid.removeChild( block.dom )
			
			delete blocks[ element.id ];
	
	} );

	return container;

}
