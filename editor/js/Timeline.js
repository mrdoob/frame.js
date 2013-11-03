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

	var currentTime = new UI.Text();
	currentTime.setColor( '#bbb' );
	currentTime.setMarginLeft( '10px' );
	currentTime.setValue( '0:00.00' );
	controls.add( currentTime );

	// timeline

	var scale = 32;

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

	var time = document.createElement( 'div' );
	time.style.position = 'absolute';
	time.style.top = '0px';
	time.style.left = '-8px';
	time.style.width = '16px';
	time.style.height = '100%';
	time.style.background = 'url(' + ( function () {

		var canvas = document.createElement( 'canvas' );
		canvas.width = 16;
		canvas.height = 1;

		var context = canvas.getContext( '2d' );
		context.fillStyle = '#f00';
		context.fillRect( 8, 0, 1, 1 );
		
		return canvas.toDataURL();

	}() ) + ')';
	timeline.dom.appendChild( time );

	var Block = ( function ( element ) {
		
		var scope = this;

		var dom = document.createElement( 'div' );
		dom.className = 'block';
		dom.style.position = 'absolute';
		dom.innerHTML = '<div class="name">' + element.name + '</div>';

		var onMouseDown = function ( event ) {

			var MODES = { 'MOVE': 0, 'RESIZE': 1 };
			var mode = MODES.MOVE;
			
			if ( event.offsetX > this.offsetWidth - 5 ) {
				
				mode = MODES.RESIZE;
				
			}

			/*
			var onMouseDownLeft = dom.offsetLeft;
			var onMouseDownTop = dom.offsetTop;

			var onMouseDownX = event.clientX;
			var onMouseDownY = event.clientY;
			*/
			
			var movementX = 0;
			var movementY = 0;

			var onMouseMove = function ( event ) {

				movementX = event.movementX | event.webkitMovementX | event.mozMovementX | 0;
				// movementY = event.movementY | event.webkitMovementY | event.mozMovementY | 0;

				switch ( mode ) {
					
					case MODES.MOVE:
		
						element.start += movementX / scale;
				
						break;
						
					case MODES.RESIZE:
		
						element.duration += movementX / scale;
						
						break;
					
				}
				
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

		};
		
		dom.addEventListener( 'mousedown', onMouseDown, false );
		
		var update = function () {
			
			dom.style.left = ( element.start * scale ) + 'px';
			dom.style.top = ( element.layer * 32 ) + 'px';
			dom.style.width = ( element.duration * scale - 2 ) + 'px';
			dom.style.height = '30px';

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

	signals.elementAdded.add( function ( element ) {

		var block = new Block( element );
		grid.appendChild( block.dom );
		
		blocks[ element.id ] = block;

	} );

	signals.elementRemoved.add( function ( element ) {
	
			var block = blocks[ element.id ];
			grid.removeChild( block.dom )
			
			delete blocks[ element.id ];
	
	} );

	signals.timeChanged.add( function ( value ) {

		time.style.left = ( value * scale ) - 8 + 'px';

		var minutes = Math.floor( value / 60 );
		var seconds = value % 60;
		var padding = seconds < 10 ? '0' : '';

		currentTime.setValue( minutes + ':' + padding + seconds.toFixed( 2 ) );

	} );
	
	// elements handling
	
	var selected = null;
	
	signals.elementSelected.add( function ( element ) {

		if ( blocks[ selected ] !== undefined ) {
			
			blocks[ selected ].deselect();
			
		}
		
		selected = element.id;
		blocks[ selected ].select();

	} );

	return container;

}
