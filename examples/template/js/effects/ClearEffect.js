var ClearEffect = function ( properties ) {

	FRAME.Effect.call( this );

	this.render = function ( value ) {

		renderer.clear();

	};

};

ClearEffect.prototype = Object.create( FRAME.Effect );
