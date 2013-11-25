var Editor = function () {

	var SIGNALS = signals;

	this.signals = {
		// actions
		play: new SIGNALS.Signal(),
		setTime: new SIGNALS.Signal(),
		backwards: new SIGNALS.Signal(),
		forwards: new SIGNALS.Signal(),
		decelerate: new SIGNALS.Signal(),
		accelerate: new SIGNALS.Signal(),
		// elements
		elementAdded: new SIGNALS.Signal(),
		elementRemoved: new SIGNALS.Signal(),
		elementSelected: new SIGNALS.Signal(),
		// events
		timeChanged: new SIGNALS.Signal(),
		timelineElementChanged: new SIGNALS.Signal()
	};

	this.timeline = new FRAME.Timeline();
	
	this.selected = null;

};

Editor.prototype = {

	add: function ( element ) {
		
		this.timeline.add( element );
		this.signals.elementAdded.dispatch( element );
	  
	},
	
	remove: function ( element ) {
		
		this.timeline.remove( element );
		this.signals.elementRemoved.dispatch( element );
	  
	},

	addCurve: function ( curve ) {

		this.timeline.curves.push( curve );

	},

	select: function ( element ) {
		
		this.selected = element;
		this.signals.elementSelected.dispatch( element );
		
	}
	
};