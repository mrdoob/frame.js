/**
 * @author mrdoob / http://mrdoob.com/
 */

import { UIPanel } from './libs/ui.js';

function Viewport( editor ) {

	var scope = this;
	var signals = editor.signals;

	var container = this.container = new UIPanel();
	container.setId( 'viewport' );

	editor.resources.set( 'dom', container.dom );

	editor.signals.fullscreen.add( function () {

		var element = container.dom.firstChild;

		if ( element.requestFullscreen ) element.requestFullscreen();
		if ( element.msRequestFullscreen ) element.msRequestFullscreen();
		if ( element.mozRequestFullScreen ) element.mozRequestFullScreen();
		if ( element.webkitRequestFullscreen ) element.webkitRequestFullscreen();

	} );

	function clear () {

		var dom = container.dom;

		while ( dom.children.length ) {

			dom.removeChild( dom.lastChild );

		}

	}

	signals.editorCleared.add( clear );
	signals.scriptsCleared.add( clear );

	return container;

}

export { Viewport };
