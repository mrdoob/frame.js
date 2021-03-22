/**
 * @author mrdoob / http://mrdoob.com/
 */

import { UIButton, UICheckbox, UIColor, UIHorizontalRule, UIInput, UIInteger, UINumber, UIPanel, UIRow, UISelect, UIText } from './libs/ui.js';

function SidebarAnimation( editor ) {

	var signals = editor.signals;

	var container = new UIPanel();
	container.setId( 'animation' );

	//

	var selected = null;
	var values;

	function createParameterRow( key, parameter ) {

		if ( parameter === null ) return;

		var parameterRow = new UIRow();
		parameterRow.add( new UIText( parameter.name ).setWidth( '90px' ) );

		if ( parameter.isBoolean ) {

			var parameterValue = new UICheckbox()
				.setValue( parameter.value )
				.onChange( function () {

					parameter.value = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			parameterRow.add( parameterValue );

			values[ key ] = parameterValue;

		} else if ( parameter.isInteger ) {

			var parameterValue = new UIInteger()
				.setRange( parameter.min, parameter.max )
				.setValue( parameter.value )
				.setWidth( '150px' )
				.onChange( function () {

					parameter.value = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			parameterRow.add( parameterValue );

			values[ key ] = parameterValue;

		} else if ( parameter.isFloat ) {

			var parameterValue = new UINumber()
				.setRange( parameter.min, parameter.max )
				.setValue( parameter.value )
				.setWidth( '150px' )
				.onChange( function () {

					parameter.value = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			parameterRow.add( parameterValue );

			values[ key ] = parameterValue;

		} else if ( parameter.isVector2 ) {

			var vectorX = new UINumber()
				.setValue( parameter.value[ 0 ] )
				.setWidth( '50px' )
				.onChange( function () {

					parameter.value[ 0 ] = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			var vectorY = new UINumber()
				.setValue( parameter.value[ 1 ] )
				.setWidth( '50px' )
				.onChange( function () {

					parameter.value[ 1 ] = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			parameterRow.add( vectorX );
			parameterRow.add( vectorY );

		} else if ( parameter.isVector3 ) {

			var vectorX = new UINumber()
				.setValue( parameter.value[ 0 ] )
				.setWidth( '50px' )
				.onChange( function () {

					parameter.value[ 0 ] = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			var vectorY = new UINumber()
				.setValue( parameter.value[ 1 ] )
				.setWidth( '50px' )
				.onChange( function () {

					parameter.value[ 1 ] = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			var vectorZ = new UINumber()
				.setValue( parameter.value[ 2 ] )
				.setWidth( '50px' )
				.onChange( function () {

					parameter.value[ 2 ] = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			parameterRow.add( vectorX );
			parameterRow.add( vectorY );
			parameterRow.add( vectorZ );

		} else if ( parameter.isString ) {

			var parameterValue = new UIInput()
				.setValue( parameter.value )
				.setWidth( '150px' )
				.onKeyUp( function () {

					parameter.value = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			parameterRow.add( parameterValue );

		} else if ( parameter.isColor ) {

			var parameterValue = new UIColor()
				.setHexValue( parameter.value )
				.setWidth( '150px' )
				.onChange( function () {

					parameter.value = this.getHexValue();
					signals.animationModified.dispatch( selected );

				} );

			parameterRow.add( parameterValue );

		}

		return parameterRow;

	}

	function build() {

		container.clear();

		if ( selected === null ) return;

		values = {};

		// Name

		var row = new UIRow();
		row.add( new UIText( 'Name' ).setWidth( '90px' ) );
		container.add( row );

		var animationName = new UIInput( selected.name )
		animationName.onChange( function () {

			selected.name = this.getValue();
			signals.animationRenamed.dispatch( selected );

		} );
		row.add( animationName );

		// Time

		var row = new UIRow();
		row.add( new UIText( 'Time' ).setWidth( '90px' ) );
		container.add( row );

		var animationStart = new UINumber( selected.start ).setWidth( '80px' );
		animationStart.onChange( function () {

			selected.start = this.getValue();
			signals.animationModified.dispatch( selected );

		} );
		row.add( animationStart );

		var animationEnd = new UINumber( selected.end ).setWidth( '80px' );
		animationEnd.onChange( function () {

			selected.end = this.getValue();
			signals.animationModified.dispatch( selected );

		} );
		row.add( animationEnd );

		// Layer

		var row = new UIRow();
		row.add( new UIText( 'Layer' ).setWidth( '90px' ) );
		container.add( row );

		var animationLayer = new UIInteger( selected.layer ).setWidth( '80px' );
		animationLayer.onChange( function () {

			selected.layer = this.getValue();
			signals.animationModified.dispatch( selected );

		} );
		row.add( animationLayer );

		// Enabled

		var row = new UIRow();
		row.add( new UIText( 'Enabled' ).setWidth( '90px' ) );
		container.add( row );

		var animationEnabled = new UICheckbox( selected.enabled )
		animationEnabled.onChange( function () {

			selected.enabled = this.getValue();
			signals.animationModified.dispatch( selected );

		} );
		row.add( animationEnabled );

		//

		container.add( new UIHorizontalRule().setMargin( '20px 0px' ) );

		//

		var row = new UIRow();
		row.add( new UIText( 'Effect' ).setWidth( '90px' ) );
		container.add( row );

		var effects = editor.effects;
		var options = {};

		for ( var i = 0; i < effects.length; i ++ ) {

			options[ i ] = effects[ i ].name;

		}

		var effectsSelect = new UISelect().setWidth( '130px' );
		effectsSelect.setOptions( options ).setValue( effects.indexOf( selected.effect ) );
		effectsSelect.onChange( function () {

			editor.timeline.reset();
			selected.effect = editor.effects[ this.getValue() ];

			signals.animationModified.dispatch( selected );

			build();

		} );
		row.add( effectsSelect );

		var edit = new UIButton( 'EDIT' ).setMarginLeft( '8px' );
		edit.onClick( function () {

			editor.selectEffect( selected.effect );

		} );
		row.add( edit );


		var row = new UIRow();
		row.add( new UIText( 'Name' ).setWidth( '90px' ) );
		container.add( row );

		var effectName = new UIInput( selected.effect.name );
		effectName.onChange( function () {

			selected.effect.name = this.getValue();
			signals.effectRenamed.dispatch( selected.effect );

		} );
		row.add( effectName );

		//

		var parameters = selected.effect.program.parameters;

		for ( var key in parameters ) {

			container.add( createParameterRow( key, parameters[ key ] ) );

		}


	}

	//

	signals.editorCleared.add( function () {

		selected = null;
		build();

	} );

	signals.animationSelected.add( function ( animation ) {

		selected = animation;
		build();

	} );

	signals.effectCompiled.add( build );

	/*
	signals.timeChanged.add( function () {

		if ( selected !== null ) {

			for ( var key in values ) {

				values[ key ].setValue( selected.module.parameters[ key ].value );

			}

		}

	} );
	*/

	return container;

}

export { SidebarAnimation };
