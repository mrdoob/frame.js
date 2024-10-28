/**
 * @author mrdoob / http://mrdoob.com/
 */

import { UIPanel } from './libs/ui.js';

function TimelineCurves( editor ) {

	var container = new UIPanel();
	var interpolationType = 'catmull'; // Default interpolation type

	// Add close button
	var closeButton = document.createElement('button');
	closeButton.textContent = '×';  // Using × symbol for close
	closeButton.style.position = 'absolute';
	closeButton.style.right = '5px';
	closeButton.style.top = '5px';
	closeButton.style.zIndex = '1000';
	closeButton.style.cursor = 'pointer';
	closeButton.addEventListener('click', function() {
		editor.signals.showAnimations.dispatch();
	});
	container.dom.appendChild(closeButton);

	// Add selector UI at the top
	var selector = document.createElement('select');
	selector.style.position = 'absolute';
	selector.style.left = '5px';
	selector.style.bottom = '5px';
	selector.style.zIndex = '1000';
	
	var catmullOption = document.createElement('option');
	catmullOption.value = 'catmull';
	catmullOption.textContent = 'Catmull';
	selector.appendChild(catmullOption);
	
	var linearOption = document.createElement('option');
	linearOption.value = 'linear';
	linearOption.textContent = 'Linear';
	selector.appendChild(linearOption);
	
	container.dom.appendChild(selector);

	var controlPoints = [];
	var isDragging = false;
	var selectedPoint = null;
	const pointRadius = 4;

	var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
	svg.style.position = 'absolute'; // Changed from 'fixed' to 'absolute'
	svg.style.left = '0';           // Add left position
	svg.style.top = '0';            // Add top position
	svg.setAttribute( 'width', 2048 );
	svg.setAttribute( 'height', 128 );
	svg.style.touchAction = 'none'; // Prevent default touch behaviors
	container.dom.appendChild( svg );

	// Reference line
	var referenceLine = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
	referenceLine.setAttribute( 'style', 'stroke: #444444; stroke-width: 1px; fill: none;' );
	referenceLine.setAttribute( 'd', 'M 0 64 2048 64' );
	svg.appendChild( referenceLine );

	// Spline path
	var splinePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	splinePath.setAttribute('style', 'stroke: #9370db; stroke-width: 1px; fill: none;');
	svg.appendChild(splinePath);

	// Points container
	var pointsGroup = document.createElementNS( 'http://www.w3.org/2000/svg', 'g' );
	svg.appendChild( pointsGroup );

	function createControlPoint(x, y) {
		// Ensure x is within bounds
		x = Math.max(0, Math.min(2048, x));
		
		var point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		point.setAttribute('cx', x);
		point.setAttribute('cy', y);
		point.setAttribute('r', pointRadius);
		point.setAttribute('fill', '#9370db');
		point.setAttribute('cursor', 'pointer');
		pointsGroup.appendChild(point);
		
		var newPoint = { x, y, element: point };
		controlPoints.push(newPoint);
		
		// Sort points by x position
		controlPoints.sort((a, b) => a.x - b.x);
		return newPoint;
	}

	function catmullRom( p0, p1, p2, p3, t ) {
		var t2 = t * t;
		var t3 = t2 * t;
		
		return {
			x: 0.5 * (
				(2 * p1.x) +
				(-p0.x + p2.x) * t +
				(2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
				(-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
			),
			y: 0.5 * (
				(2 * p1.y) +
				(-p0.y + p2.y) * t +
				(2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
				(-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
			)
		};
	}

	function drawSpline() {
		if (controlPoints.length < 2) return;

		var path = `M ${controlPoints[0].x} ${controlPoints[0].y}`;
		
		if (interpolationType === 'linear') {
			// Linear interpolation - just draw straight lines between points
			for (var i = 1; i < controlPoints.length; i++) {
				path += ` L ${controlPoints[i].x} ${controlPoints[i].y}`;
			}
		} else {
			// Catmull-Rom interpolation
			for (var i = 0; i < controlPoints.length - 1; i++) {
				var p0 = controlPoints[Math.max(0, i - 1)];
				var p1 = controlPoints[i];
				var p2 = controlPoints[i + 1];
				var p3 = controlPoints[Math.min(controlPoints.length - 1, i + 2)];

				for (var t = 0; t <= 1; t += 0.1) {
					var pt = catmullRom(p0, p1, p2, p3, t);
					path += ` L ${pt.x} ${pt.y}`;
				}
			}
		}

		splinePath.setAttribute('d', path);
	}

	function constrainPointMovement(point, newX, newY) {
		var index = controlPoints.indexOf(point);
		var minX = index > 0 ? controlPoints[index - 1].x + 1 : 0;
		var maxX = index < controlPoints.length - 1 ? controlPoints[index + 1].x - 1 : 2048;
		
		return {
			x: Math.max(minX, Math.min(maxX, newX)),
			y: Math.max(0, Math.min(128, newY))
		};
	}

	function deleteControlPoint(point) {
		// Don't delete if we only have 2 or fewer points
		if (controlPoints.length <= 2) return;
		
		// Don't delete first or last point
		var index = controlPoints.indexOf(point);
		if (index === 0 || index === controlPoints.length - 1) return;
		
		// Remove the point
		controlPoints.splice(index, 1);
		pointsGroup.removeChild(point.element);
		drawSpline();
	}

	svg.addEventListener( 'pointerdown', function(event) {
		var rect = svg.getBoundingClientRect();
		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;

		var point = controlPoints.find(p => 
				Math.hypot(p.x - x, p.y - y) < pointRadius * 2
		);

		if (point) {
			selectedPoint = point;
			isDragging = true;
			svg.setPointerCapture(event.pointerId); // Capture pointer
		} else {
			createControlPoint(x, y);
			drawSpline();
		}
	} );

	svg.addEventListener( 'pointermove', function(event) {
		if (!isDragging || !selectedPoint) return;

		var rect = svg.getBoundingClientRect();
		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;

		// Constrain movement
		var constrained = constrainPointMovement(selectedPoint, x, y);
		selectedPoint.x = constrained.x;
		selectedPoint.y = constrained.y;
		selectedPoint.element.setAttribute('cx', constrained.x);
		selectedPoint.element.setAttribute('cy', constrained.y);
		
		drawSpline();
	} );

	svg.addEventListener( 'pointerup', function(event) {
		if (isDragging) {
			svg.releasePointerCapture(event.pointerId); // Release pointer
		}
		isDragging = false;
		selectedPoint = null;
	} );

	svg.addEventListener('dblclick', function(event) {
		var rect = svg.getBoundingClientRect();
		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;

		var point = controlPoints.find(p => 
			Math.hypot(p.x - x, p.y - y) < pointRadius * 2
		);

		if (point) {
			deleteControlPoint(point);
		}
	} );

	// Add change listener for the selector
	selector.addEventListener('change', function(event) {
		interpolationType = event.target.value;
		drawSpline();
	});

	// Keep the existing signals interface for compatibility
	editor.signals.curveAdded.add( function() {
		drawSpline();
	} );

	editor.signals.timelineScaled.add( function() {
		drawSpline();
	} );

	return container;

}

export { TimelineCurves };
