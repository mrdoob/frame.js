Timeline.Modules = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setHeight( '100%' );
	container.setBackground( 'url(' + ( function () {

		var canvas = document.createElement( 'canvas' );
		canvas.width = 1;
		canvas.height = 32;

		var context = canvas.getContext( '2d' );
		context.fillStyle = '#444';
		context.fillRect( 0, 0, 1, 1 );
		return canvas.toDataURL();

	}() ) + ')' );

	var scale = 32;

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
				element.end += movementX / scale;

				if ( element.start < 0 ) {

					var offset = - element.start;

					element.start += offset;
					element.end += offset;

				}

				movementY += event.movementY | event.webkitMovementY | event.mozMovementY | 0;

				if ( movementY >= 30 ) {

					element.layer ++;
					movementY = 0;

				}

				if ( movementY <= -30 ) {

					element.layer --;
					movementY = 0;

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

				element.end += movementX / scale;
				
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
			dom.style.width = ( ( element.end - element.start ) * scale - 2 ) + 'px';

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
		container.dom.appendChild( block.dom );
		
		blocks[ element.id ] = block;

	} );
	
	signals.elementSelected.add( function ( element ) {

		if ( blocks[ selected ] !== undefined ) {
			
			blocks[ selected ].deselect();
			
		}
		
		selected = element.id;
		blocks[ selected ].select();

	} );

	signals.elementRemoved.add( function ( element ) {
	
			var block = blocks[ element.id ];
			container.dom.removeChild( block.dom )
			
			delete blocks[ element.id ];
	
	} );

	signals.timelineScaled.add( function ( value ) {

		scale = value;
					
		for ( var key in blocks ) {
		
			blocks[ key ].update();
			
		}

	} );

	return container;

}