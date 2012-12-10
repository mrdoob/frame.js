var ClearModule = function ( properties ) {

	FRAME.Module.call( this );

	this.update = function ( t ) {

		renderer.clear();

	};

};
