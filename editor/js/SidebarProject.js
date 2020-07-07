/**
 * @author mrdoob / http://mrdoob.com/
 */

function SidebarProject( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'project' );

	// Scripts

	container.add( new UI.Text( 'Scripts' ).setTextTransform( 'uppercase' ) );
	container.add( new UI.Break(), new UI.Break() );

	var scriptsContainer = new UI.Row();
	container.add( scriptsContainer );

	var newScript = new UI.Button( 'New' );
	newScript.onClick( function () {

		editor.createScript();

	} );
	container.add( newScript );

	var reload = new UI.Button( 'Reload Scripts' );
	reload.onClick( async function () {

		await editor.reloadScripts();

		editor.timeline.reset();
		editor.timeline.update( editor.player.currentTime );

	} );
	reload.setMarginLeft( '4px' );
	container.add( reload );

	container.add( new UI.Break(), new UI.Break() );

	// Effects

	container.add( new UI.Text( 'Effects' ).setTextTransform( 'uppercase' ) );
	container.add( new UI.Break(), new UI.Break() );

	var effects = new UI.Select().setMultiple( true ).setWidth( '280px' ).setMarginBottom( '8px' );
	container.add( effects );

	var cleanEffects = new UI.Button( 'Clean Effects' );
	cleanEffects.onClick( function () {

		editor.cleanEffects();

	} );
	container.add( cleanEffects );

	container.add( new UI.Break(), new UI.Break() );

	//

	function buildScript( id ) {

		var script = editor.scripts[ id ];

		var div = new UI.Div().setMarginBottom( '4px' );

		var name = new UI.Input( script.name ).setWidth( '130px' );
		name.onChange( function () {

			script.name = this.getValue();

		} );
		div.add( name );

		var edit = new UI.Button( 'Edit' );
		edit.setMarginLeft( '4px' );
		edit.onClick( function () {

			editor.selectScript( script );

		} );
		div.add( edit );

		var remove = new UI.Button( 'Remove' );
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
