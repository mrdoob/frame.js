/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Project = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'project' );

	// Libraries

	container.add( new UI.Text( 'Libraries' ).setTextTransform( 'uppercase' ) );
	container.add( new UI.Break(), new UI.Break() );

	var libraries = new UI.Select().setMultiple( true ).setWidth( '280px' );
	container.add( libraries );

	container.add( new UI.Break(), new UI.Break() );

	// Scripts

	container.add( new UI.Text( 'Scripts' ).setTextTransform( 'uppercase' ) );
	container.add( new UI.Break(), new UI.Break() );

	var includesContainer = new UI.Row();
	container.add( includesContainer );

	var newInclude = new UI.Button( 'New' );
	newInclude.onClick( function () {

		editor.addInclude( 'Name', '' );

		update();

	} );
	container.add( newInclude );

	/*
	var cleanEffects = new UI.Button( 'Clean Effects' );
	cleanEffects.onClick( function () {

		editor.cleanEffects();

	} );
	cleanEffects.setMarginLeft( '4px' );
	container.add( cleanEffects );
	*/

	var reload = new UI.Button( 'Reload Scripts' );
	reload.onClick( function () {

		editor.reloadIncludes();

		var effects = editor.effects;

		for ( var j = 0; j < effects.length; j++ ) {

			var effect = effects[ j ];
			editor.compileEffect( effect );

		}

		editor.timeline.reset();
		editor.timeline.update( editor.player.currentTime );

	} );
	reload.setMarginLeft( '4px' );
	container.add( reload );

	//

	function buildInclude( id ) {

		var include = editor.includes[ id ];

		var span = new UI.Span();

		var name = new UI.Input( include.name ).setWidth( '130px' ).setFontSize( '12px' );
		name.onChange( function () {

			include.name = this.getValue();

		} );
		span.add( name );

		var edit = new UI.Button( 'Edit' );
		edit.setMarginLeft( '4px' );
		edit.onClick( function () {

			editor.selectInclude( include );

		} );
		span.add( edit );

		var remove = new UI.Button( 'Remove' );
		remove.setMarginLeft( '4px' );
		remove.onClick( function () {

			if ( confirm( 'Are you sure?' ) ) {

				editor.removeInclude( include );

			}

		} );
		span.add( remove );

		return span;

	}

	//

	function update() {

		libraries.setOptions( editor.libraries );
		libraries.dom.size = editor.libraries.length;

		//

		includesContainer.clear();

		var includes = editor.includes;

		for ( var i = 0; i < includes.length; i ++ ) {

			includesContainer.add( buildInclude( i ) );

		}

	}

	// signals

	signals.editorCleared.add( update );
	signals.libraryAdded.add( update );
	signals.includeAdded.add( update );
	signals.includeRemoved.add( update );

	return container;

};
