/**
 * @author mrdoob / http://mrdoob.com/
 */

import { UIBreak, UIButton, UIDiv, UIInput, UIPanel, UIRow, UISelect, UIText } from './libs/ui.js';

function SidebarProject( editor ) {

	var signals = editor.signals;

	var container = new UIPanel();
	container.setId( 'project' );

	// Scripts

	container.add( new UIText( 'Scripts' ).setTextTransform( 'uppercase' ) );
	container.add( new UIBreak(), new UIBreak() );

	var scriptsContainer = new UIRow();
	container.add( scriptsContainer );

	var newScript = new UIButton( 'New' );
	newScript.onClick( function () {

		editor.createScript();

	} );
	container.add( newScript );

	var reload = new UIButton( 'Reload Scripts' );
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

	var effects = new UISelect().setMultiple( true ).setWidth( '280px' ).setMarginBottom( '8px' );
	container.add( effects );

	var cleanEffects = new UIButton( 'Clean Effects' );
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

		updateScripts();
		updateEffects();

	}

	function updateScripts() {

		scriptsContainer.clear();

		var scripts = editor.scripts;

		for ( var i = 0; i < scripts.length; i ++ ) {

			scriptsContainer.add( buildScript( i ) );

		}

	}

	function updateEffects() {

		var names = [];

		for ( var i = 0; i < editor.effects.length; i ++ ) {

			names.push( editor.effects[ i ].name );

		}

		effects.setOptions( names );
		effects.dom.size = editor.effects.length;

	}

	// signals

	signals.editorCleared.add( update );

	signals.scriptAdded.add( updateScripts );
	signals.scriptRemoved.add( updateScripts );

	signals.effectAdded.add( updateEffects );
	signals.effectRemoved.add( updateEffects );

	return container;

}

export { SidebarProject };
