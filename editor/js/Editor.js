var Editor = function () {

	var SIGNALS = signals;

	this.signals = {
		// actions
		play: new SIGNALS.Signal(),
		backwards: new SIGNALS.Signal(),
		forwards: new SIGNALS.Signal(),
		setTime: new SIGNALS.Signal(),
		fullscreen: new SIGNALS.Signal(),
		// elements
		elementAdded: new SIGNALS.Signal(),
		elementRemoved: new SIGNALS.Signal(),
		elementSelected: new SIGNALS.Signal(),
		// curves
		curveAdded: new SIGNALS.Signal(),
		// events
		durationChanged: new SIGNALS.Signal(),
		playbackRateChanged: new SIGNALS.Signal(),
		timeChanged: new SIGNALS.Signal(),
		timelineScaled: new SIGNALS.Signal(),
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
		this.signals.curveAdded.dispatch( curve );

	},

	select: function ( element ) {
		
		this.selected = element;
		this.signals.elementSelected.dispatch( element );
		
	}
	
};