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

	function createParameterRow( animation, program, key ) {

		const parameter = program.parameters[ key ];

		let value = animation.parameters[ key ];
		let isDefined = value !== undefined;

		if ( isDefined === false ) {

			console.log( 'TODO: Parameter not defined', key, parameter );
			value = program._parameters[ key ].value;

		}

		var parameterRow = new UIRow();

		var name = new UIText( parameter.name ).setWidth( '90px' );
		name.setTextDecoration( isDefined ? 'underline' : 'none' );
		parameterRow.add( name );

		if ( parameter.isBoolean ) {

			var parameterValue = new UICheckbox()
				.setValue( value )
				.onChange( function () {

					animation.parameters[ key ] = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			parameterRow.add( parameterValue );

			values[ key ] = parameterValue;

		} else if ( parameter.isInteger ) {

			var parameterValue = new UIInteger()
				.setRange( parameter.min, parameter.max )
				.setValue( value )
				.setWidth( '150px' )
				.onChange( function () {

					animation.parameters[ key ] = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			parameterRow.add( parameterValue );

			values[ key ] = parameterValue;

		} else if ( parameter.isFloat ) {

			var parameterValue = new UINumber()
				.setRange( parameter.min, parameter.max )
				.setValue( value )
				.setWidth( '150px' )
				.onChange( function () {

					animation.parameters[ key ] = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			parameterRow.add( parameterValue );

			values[ key ] = parameterValue;

		} else if ( parameter.isVector2 ) {

			var vectorX = new UINumber()
				.setValue( value[ 0 ] )
				.setWidth( '50px' )
				.onChange( function () {

					animation.parameters[ key ][ 0 ] = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			var vectorY = new UINumber()
				.setValue( value[ 1 ] )
				.setWidth( '50px' )
				.onChange( function () {

					animation.parameters[ key ][ 1 ] = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			parameterRow.add( vectorX );
			parameterRow.add( vectorY );

		} else if ( parameter.isVector3 ) {

			var vectorX = new UINumber()
				.setValue( value[ 0 ] )
				.setWidth( '50px' )
				.onChange( function () {

					animation.parameters[ key ][ 0 ] = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			var vectorY = new UINumber()
				.setValue( value[ 1 ] )
				.setWidth( '50px' )
				.onChange( function () {

					animation.parameters[ key ][ 1 ] = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			var vectorZ = new UINumber()
				.setValue( value[ 2 ] )
				.setWidth( '50px' )
				.onChange( function () {

					animation.parameters[ key ][ 2 ] = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			parameterRow.add( vectorX );
			parameterRow.add( vectorY );
			parameterRow.add( vectorZ );

		} else if ( parameter.isString ) {

			var parameterValue = new UIInput()
				.setValue( value )
				.setWidth( '150px' )
				.onKeyUp( function () {

					animation.parameters[ key ] = this.getValue();
					signals.animationModified.dispatch( selected );

				} );

			parameterRow.add( parameterValue );

		} else if ( parameter.isColor ) {

			var parameterValue = new UIColor()
				.setHexValue( value )
				.setWidth( '150px' )
				.onChange( function () {

					animation.parameters[ key ] = this.getHexValue();
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

		var effectEditor = new UIButton( 'Edit' ).setMarginLeft( '6px' );
		effectEditor.onClick( function () {

			editor.selectEffect( selected.effect );

		} );
		row.add( effectEditor );

		//

		var program = selected.effect.program;
		var parameters = program.parameters;

		for ( var key in parameters ) {

			container.add( createParameterRow( selected, program, key ) );

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
