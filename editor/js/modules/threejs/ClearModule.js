var ClearModule = function () {

	FRAME.Module.call( this );

	this.update = function ( t ) {

		renderer.clear();

	};

};
