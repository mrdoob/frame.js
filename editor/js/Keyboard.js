/**
 * @author therealtakeshi / https://therealtakeshi.com/
 * 
 *     // single keys
    Mousetrap.bind('4', function() { console.log('4'); });
    Mousetrap.bind("?", function() { console.log('show shortcuts!'); });
    Mousetrap.bind('esc', function() { console.log('escape'); }, 'keyup');

    // combinations
    Mousetrap.bind('command+shift+k', function() { console.log('command shift k'); });

    // map multiple combinations to the same callback
    Mousetrap.bind(['command+k', 'ctrl+k'], function() {
        console.log('command k or control k');

        // return false to prevent default browser behavior
        // and stop event from bubbling
        return false;
    });

    // gmail style sequences
    Mousetrap.bind('g i', function() { console.log('go to inbox'); });
    Mousetrap.bind('* a', function() { console.log('select all'); });

    // konami code!
    Mousetrap.bind('up up down down left right left right b a enter', function() {
        console.log('konami code');
    });
 */



var Keyboard = function ( editor ) {

	editor.keyboard = {
		modIsDown: false,
		shiftIsDown: false,
		optionIsDown: false,
	};

	var useBasicKeyboard = false;

	if ( useBasicKeyboard || typeof Mousetrap !== 'function' ) {
		document.addEventListener( 'keydown', function ( event ) {

			if ( event.metaKey || event.ctrlKey ) {
		
				switch ( event.keyCode ) {
					case 83: // prevent CMD + S
						event.preventDefault();
						break;
					case 69: // CMD + E to export
						event.preventDefault();
						editor.signals.exportState.dispatch();
						break;
				}
		
				return;
		
			}
		
			switch ( event.keyCode ) {
		
				case 8: // prevent browser back
					event.preventDefault();
					break;
				case 32:
					editor.player.isPlaying ? editor.stop() : editor.play();
					break;
				case 37:
					event.preventDefault();
					editor.setTime( editor.player.currentTime - editor.player.playbackRate );
					break;
				case 39:
					event.preventDefault();
					editor.setTime( editor.player.currentTime + editor.player.playbackRate );
					break;
				case 38:
					event.preventDefault();
					editor.speedUp();
					break;
				case 40:
					event.preventDefault();
					editor.speedDown();
					break;
				case 83:
					break;
		
			}
		
		} );
	} else {
		/**
		 * Set up basic commands for export, play/pause, etc.
		 */

		// Prevent save and browser back
		Mousetrap.bind(['mod+s', 'backspace'], function() {
			event.preventDefault();
			return false;
		});

		// CMD+/CTRL+E to Export
		Mousetrap.bind('mod+e', function() {
			event.preventDefault();
			editor.signals.exportState.dispatch();
			return false;
		});

		// Play/Pause
		Mousetrap.bind('space', function() {
			editor.player.isPlaying ? editor.stop() : editor.play();
		});

		// Timeline back
		Mousetrap.bind('left', function() {
			event.preventDefault();
			editor.setTime( editor.player.currentTime - editor.player.playbackRate );
		});
		// Timeline forward
		Mousetrap.bind('right', function() {
			event.preventDefault();
			editor.setTime( editor.player.currentTime + editor.player.playbackRate );
		});

		// Playback speed up
		Mousetrap.bind('up', function() {
			event.preventDefault();
			editor.speedUp();
		});
		// Playback speed down
		Mousetrap.bind('down', function() {
			event.preventDefault();
			editor.speedDown();
		});
		
		/**
		 * Set up enhanced commands for finer control
		 */
		// Timeline fast-back
		Mousetrap.bind('mod+left', function() {
			event.preventDefault();
			editor.setTime( editor.player.currentTime - ( editor.player.playbackRate * 5 ) );
		});
		// Timeline fast-forward
		Mousetrap.bind('mod+right', function() {
			event.preventDefault();
			editor.setTime( editor.player.currentTime + ( editor.player.playbackRate * 5 ) );
		});
		// Timeline fine-back
		Mousetrap.bind('shift+left', function() {
			event.preventDefault();
			editor.setTime( editor.player.currentTime - ( editor.player.playbackRate / 100 ) );
		});
		// Timeline fine-forward
		Mousetrap.bind('shift+right', function() {
			event.preventDefault();
			editor.setTime( editor.player.currentTime + ( editor.player.playbackRate / 100 ) );
		});
		// Timeline unit-snap-back
		Mousetrap.bind('option+left', function() {
			event.preventDefault();

			var newTime = Math.floor( editor.player.currentTime );
			if( newTime === editor.player.currentTime) {
				newTime = editor.player.currentTime - 1; // editor.setTime handles cases where newTime < 0
			}

			editor.setTime( newTime );
		});
		// Timeline unit-snap-forward
		Mousetrap.bind('option+right', function() {
			event.preventDefault();

			var newTime = Math.ceil( editor.player.currentTime );
			if( newTime === editor.player.currentTime) {
				newTime = editor.player.currentTime + 1;
			}

			editor.setTime( newTime );
		});

		// Block fast modifier - single
		Mousetrap.bind('mod', function() {
			event.preventDefault();
			editor.keyboard.modIsDown = true;
		}, 'keydown');
		Mousetrap.bind('mod', function() {
			event.preventDefault();
			editor.keyboard.modIsDown = false;
		}, 'keyup');

		// Block fine modifier - single
		Mousetrap.bind('shift', function() {
			event.preventDefault();
			editor.keyboard.shiftIsDown = true;
		}, 'keydown');
		Mousetrap.bind('shift', function() {
			event.preventDefault();
			editor.keyboard.shiftIsDown = false;
		}, 'keyup');

		// Block snap modifier - single
		Mousetrap.bind('option', function() {
			event.preventDefault();
			editor.keyboard.optionIsDown = true;
		}, 'keydown');
		Mousetrap.bind('option', function() {
			event.preventDefault();
			editor.keyboard.optionIsDown = false;
		}, 'keyup');

		// Block fast+snap modifier - double
		Mousetrap.bind(['mod+option', 'option+mod'], function() {
			event.preventDefault();
			editor.keyboard.modIsDown = true;
			editor.keyboard.optionIsDown = true;
		}, 'keydown');
		Mousetrap.bind(['mod+option', 'option+mod'], function() {
			event.preventDefault();
			editor.keyboard.modIsDown = false;
			editor.keyboard.optionIsDown = false;
		}, 'keyup');

		// Block fine+snap modifier - double
		Mousetrap.bind(['shift+option', 'option+shift'], function() {
			event.preventDefault();
			editor.keyboard.shiftIsDown = true;
			editor.keyboard.optionIsDown = true;
		}, 'keydown');
		Mousetrap.bind(['shift+option', 'option+shift'], function() {
			event.preventDefault();
			editor.keyboard.shiftIsDown = false;
			editor.keyboard.optionIsDown = false;
		}, 'keyup');

		// Block duplicate
		Mousetrap.bind(['shift+d', 'd d'], function() {
			event.preventDefault();
			if ( editor.selected === null ) return;

			var selected = editor.selected;
	
			var offset = selected.end - selected.start;
	
			var animation = new FRAME.Animation(
				selected.name,
				selected.start + offset,
				selected.end + offset,
				selected.layer,
				selected.effect
			);
	
			editor.addAnimation( animation );
			editor.selectAnimation( animation );
		});

		// Block remove
		Mousetrap.bind(['x', 'del'], function() {
			event.preventDefault();
			if ( editor.selected === null ) return;
	
			editor.removeAnimation( editor.selected );
			editor.selectAnimation( null );
		});

	}

	return this;

};
