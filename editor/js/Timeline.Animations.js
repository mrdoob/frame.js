/**
 * @author mrdoob / http://mrdoob.com/
 */

Timeline.Animations = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setHeight( '100%' );
	container.setBackground( 'linear-gradient(#444 1px, transparent 1px) 0% 0% / 32px 32px repeat' );

	var scale = 32;

	var Block = ( function ( animation ) {

		var scope = this;

		var dom = document.createElement( 'div' );
		dom.className = 'block';
		dom.style.position = 'absolute';
		dom.style.height = '30px';
		dom.addEventListener( 'click', function ( event ) {

			editor.selectAnimation( animation );

		} );
		dom.addEventListener( 'mousedown', function ( event ) {

			var movementX = 0;
			var movementY = 0;

			function onMouseMove( event ) {

				movementX = event.movementX | event.webkitMovementX | event.mozMovementX | 0;

				var pos = animation.getPosition();
				pos.start += movementX / scale;
				pos.end += movementX / scale;

				if (pos.start < 0) {
					
					var offset = -animation.start;

					pos.start += offset;
					pos.end += offset;
					
				}

				movementY += event.movementY | event.webkitMovementY | event.mozMovementY | 0;

				if (movementY >= 30) {
					
					pos.layer += 1;
					movementY = 0;
					
				}

				if (movementY <= -30) {
					
					pos.layer = Math.max(0, pos.layer - 1);
					movementY = 0;
					
				}
				
				if (editor.getOverlappingAnimation(pos)) return false;
				
				animation.start = pos.start;
				animation.end = pos.end;
				animation.layer = pos.layer;

				signals.animationModified.dispatch( animation );

			}

			function onMouseUp( event ) {

				document.removeEventListener( 'mousemove', onMouseMove );
				document.removeEventListener( 'mouseup', onMouseUp );

			}

			document.addEventListener( 'mousemove', onMouseMove, false );
			document.addEventListener( 'mouseup', onMouseUp, false );

		}, false );

		var resizeOnMouseDown = function (event, left) {
			
			event.stopPropagation();

			var movementX = 0;

			function onMouseMove(event) {
				
				movementX = event.movementX | event.webkitMovementX | event.mozMovementX | 0;
				
				let pos = animation.getPosition();
				
				if (left) {
					pos.start += movementX / scale;
					if (pos.start > pos.end - 0.1) return;
				}
				else {
					pos.end += movementX / scale;
				}
				
				// If the animation would overlap any other on the same layer, don't increase the size.
				if (editor.getOverlappingAnimation(pos)) return;
				
				if (left) {
					animation.start = pos.start;
				}
				else {
					animation.end = pos.end;
				}

				signals.animationModified.dispatch(animation);
			}
			
			function onMouseUp(event) {
				if (Math.abs(movementX) < 2) editor.selectAnimation(animation);

				document.removeEventListener('mousemove', onMouseMove);
				document.removeEventListener('mouseup', onMouseUp);
			}

			document.addEventListener('mousemove', onMouseMove, false);
			document.addEventListener('mouseup', onMouseUp, false);
		}
		
		var resizeLeft = document.createElement( 'div' );
		resizeLeft.style.position = 'absolute';
		resizeLeft.style.width = '6px';
		resizeLeft.style.height = '30px';
		resizeLeft.style.cursor = 'w-resize';
		resizeLeft.addEventListener( 'mousedown', (event) => resizeOnMouseDown(event, true), false );
		dom.appendChild( resizeLeft );

		var name = document.createElement( 'div' );
		name.className = 'name';
		dom.appendChild( name );

		var resizeRight = document.createElement( 'div' );
		resizeRight.style.position = 'absolute';
		resizeRight.style.right = '0px';
		resizeRight.style.top = '0px';
		resizeRight.style.width = '6px';
		resizeRight.style.height = '30px';
		resizeRight.style.cursor = 'e-resize';
		resizeRight.addEventListener( 'mousedown', (event) => resizeOnMouseDown(event, false), false );
		dom.appendChild( resizeRight );

		//

		function getAnimation() {

			return animation;

		}

		function select() {

			dom.classList.add( 'selected' );

		}

		function deselect() {

			dom.classList.remove( 'selected' );

		}

		function update() {

			animation.enabled === false ? dom.classList.add( 'disabled' ) : dom.classList.remove( 'disabled' );

			dom.style.left = ( animation.start * scale ) + 'px';
			dom.style.top = ( animation.layer * 32 ) + 'px';
			dom.style.width = ( ( animation.end - animation.start ) * scale - 2 ) + 'px';

			name.innerHTML = animation.name + ' <span style="opacity:0.5">' + animation.effect.name + '</span>';

		}

		update();

		return {
			dom: dom,
			getAnimation: getAnimation,
			select: select,
			deselect: deselect,
			update: update
		};

	} );

	container.dom.addEventListener( 'dblclick', function ( event ) {

		var start = event.offsetX / scale;
		var end = start + 2;
		var layer = Math.floor( event.offsetY / 32 );

		var effect = new FRAME.Effect( 'Effect' );
		editor.addEffect( effect );

		var animation = new FRAME.Animation( 'Animation', start, end, layer, effect );
		editor.addAnimation( animation );

	} );

	// signals

	var blocks = {};
	var selected = null;

	signals.animationAdded.add( function ( animation ) {

		var block = new Block( animation );
		container.dom.appendChild( block.dom );

		blocks[ animation.id ] = block;

	} );

	signals.animationModified.add( function ( animation ) {

		blocks[ animation.id ].update();

	} );

	signals.animationSelected.add( function ( animation ) {

		if ( blocks[ selected ] !== undefined ) {

			blocks[ selected ].deselect();

		}

		if ( animation === null ) return;

		selected = animation.id;
		blocks[ selected ].select();

	} );

	signals.animationRemoved.add( function ( animation ) {

			var block = blocks[ animation.id ];
			container.dom.removeChild( block.dom );

			delete blocks[ animation.id ];

	} );

	signals.timelineScaled.add( function ( value ) {

		scale = value;

		for ( var key in blocks ) {

			blocks[ key ].update();

		}

	} );

	signals.animationRenamed.add( function ( animation ) {

		blocks[ animation.id ].update();

	} );

	signals.effectRenamed.add( function ( effect ) {

		for ( var key in blocks ) {

			var block = blocks[ key ];

			if ( block.getAnimation().effect === effect ) {

				block.update();

			}

		}

	} );

	return container;

};
