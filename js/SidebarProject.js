/**
 * @author mrdoob / http://mrdoob.com/
 */

import { UIBreak, UIButton, UIDiv, UIInput, UIPanel, UIRow, UISelect, UIText } from './libs/ui.js';

function SidebarProject( editor ) {

	var signals = editor.signals;

	var container = new UIPanel();
	container.setId( 'project' );

	// Config

	container.add( new UIText( 'Config' ).setTextTransform( 'uppercase' ) );
	container.add( new UIBreak(), new UIBreak() );

	// Name

	var row = new UIRow();
	row.add( new UIText( 'Name' ).setWidth( '90px' ) );
	container.add( row );

	var name = new UIInput( editor.name ).setWidth( '130px' );
	name.onChange( function () {
		editor.setName( this.getValue() );
	} );
	row.add( name );

	//

	var row = new UIRow();
	row.add( new UIText( 'Duration' ).setWidth( '90px' ) );
	container.add( row );

	function toSeconds( time ) {

		const parts = time.split( ':' );
		return parseInt( parts[ 0 ] ) * 60 + parseInt( parts[ 1 ] );

	}

	function fromSeconds( seconds ) {

		var minute = Math.floor( seconds / 60 );
		var second = Math.floor( seconds % 60 );

		return `${ minute }:${ second.toString().padStart( 2, '0' ) }`;

	}

	var duration = new UIInput( '2:00' ).setWidth( '80px' );
	duration.onChange( function () {

		editor.setDuration( toSeconds( this.getValue() ) );

	} );
	row.add( duration );

	container.add( new UIBreak() );

	// Setup

	container.add( new UIText( 'Setup' ).setTextTransform( 'uppercase' ) );
	container.add( new UIBreak(), new UIBreak() );

	var scriptsContainer = new UIRow();
	container.add( scriptsContainer );

	var newScript = new UIButton( 'New' );
	newScript.onClick( function () {

		editor.createScript();

	} );
	container.add( newScript );

	var reload = new UIButton( 'Reload All' );
	reload.onClick( async function () {

		await editor.reloadScripts();

		editor.timeline.reset();
		editor.timeline.update( editor.player.currentTime );

	} );
	reload.setMarginLeft( '4px' );
	container.add( reload );

	container.add( new UIBreak(), new UIBreak() );

	// Effects

	container.add( new UIText( 'Effects' ).setTextTransform( 'uppercase' ) );
	container.add( new UIBreak(), new UIBreak() );

	var effects = new UISelect().setWidth( '280px' ).setMarginBottom( '8px' );
	effects.onChange( function () {
		editor.selectEffect( editor.effects[ this.getValue() ] );
	} );
	container.add( effects );

	var cleanEffects = new UIButton( 'Remove unused' );
	cleanEffects.onClick( function () {

		editor.cleanEffects();

	} );
	container.add( cleanEffects );

	container.add( new UIBreak(), new UIBreak() );

	//

	function buildScript( id ) {

		var script = editor.scripts[ id ];

		var div = new UIDiv().setMarginBottom( '4px' );

		var name = new UIInput( script.name ).setWidth( '130px' );
		name.onChange( function () {

			script.name = this.getValue();

		} );
		div.add( name );

		var edit = new UIButton( 'Edit' );
		edit.setMarginLeft( '4px' );
		edit.onClick( function () {

			editor.selectScript( script );

		} );
		div.add( edit );

		var remove = new UIButton( 'Remove' );
		remove.setMarginLeft( '4px' );
		remove.onClick( function () {

			if ( confirm( 'Are you sure?' ) ) {

				editor.removeScript( script );

			}

		} );
		div.add( remove );

		return div;

	}

	//

	function update() {

		updateConfig();
		updateScripts();
		updateEffects();

	}

	function updateConfig() {

		name.setValue( editor.name );
		duration.setValue( fromSeconds( editor.duration ) );

	}

	function updateScripts() {

		scriptsContainer.clear();

		var scripts = editor.scripts;

		for ( let i = 0; i < scripts.length; i ++ ) {

			scriptsContainer.add( buildScript( i ) );

		}

	}

	function updateEffects() {

		var names = [];

		for ( let i = 0; i < editor.effects.length; i ++ ) {

			names.push( editor.effects[ i ].name );

		}

		effects.setOptions( names );
		effects.dom.size = editor.effects.length;

	}

	// signals

	signals.projectLoaded.add( update );
	signals.editorCleared.add( update );

	signals.scriptAdded.add( updateScripts );
	signals.scriptRemoved.add( updateScripts );

	signals.effectAdded.add( updateEffects );
	signals.effectRemoved.add( updateEffects );

	return container;

}

export { SidebarProject };
