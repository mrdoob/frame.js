var Properties = function ( editor ) {

	var container = new UI.Panel();

	// signals

	var signals = editor.signals;

	editor.signals.elementSelected.add( function ( element ) {

		console.log( element );

		container.clear();

		var parameters = element.parameters;

		for ( var key in parameters ) {

			var parameter = parameters[ key ];

			var parameterRow = new UI.Panel();
			parameterRow.add( new UI.Text( key ).setWidth( '90px' ) );

			switch ( typeof( parameter ) ) {

				case 'number':

					parameterRow.add(

						new UI.Number()
							.setValue( parameter )
							.setWidth( '150px' )
							.onChange( function () {

								element.parameters[ key ] = this.getValue();

							} )

					);

					break;

				case 'string':

					parameterRow.add(

						new UI.Input()
							.setValue( parameter )
							.setWidth( '150px' )
							.onChange( function () {

								element.parameters[ key ] = this.getValue();

							} )

					);

					break;

			}

			container.add( parameterRow );

		};

	} );

	return container;

}
