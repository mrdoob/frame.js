/**
 * @author mrdoob / http://mrdoob.com/
 */

var Viewport = function ( editor ) {

	var scope = this;
	var signals = editor.signals;

	var container = this.container = new UI.Panel();
	container.setId( 'viewport' );

	FRAME.setDOM( container.dom );

	/*
	editor.signals.fullscreen.add( function () {

		var element = container.dom;

		if ( element.requestFullscreen ) element.requestFullscreen();
		if ( element.msRequestFullscreen ) element.msRequestFullscreen();
		if ( element.mozRequestFullScreen ) element.mozRequestFullScreen();
		if ( element.webkitRequestFullscreen ) element.webkitRequestFullscreen();

	} );
	*/

	signals.editorCleared.add( clear );
	signals.includesCleared.add( clear );

	function clear () {

		scope.clear();

	}

	return container;

};

Viewport.prototype = {

	clear: function () {

		var container = this.container;

		while ( container.dom.children.length ) {

			container.dom.removeChild( container.dom.lastChild );

		}

		return this;

	}

};
