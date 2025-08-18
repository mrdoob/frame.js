<!-- Frame.js Script r6 -->

# Three.js Cube

## Config

* Duration: 120

## Setup

### Renderer

```js
const THREE = await import( './examples/js/libs/three.module.js' );

var dom = resources.get( 'dom' );

var renderer = new THREE.WebGLRenderer( { preserveDrawingBuffer: true } );
renderer.autoClear = false;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( dom.clientWidth, dom.clientHeight );
dom.appendChild( renderer.domElement );

window.addEventListener( 'resize', function () {
	
	renderer.setSize( dom.clientWidth, dom.clientHeight );
	
} );

resources.set( 'renderer', renderer );
```

## Effects

### Clear

```js
const THREE = await import( './examples/js/libs/three.module.js' );

var parameters = {
	color: new FRAME.Color( 'Color', 0x000000 )
};

var renderer = resources.get( 'renderer' );

function start() {

	renderer.setClearColor( parameters.color.value );

}

function update( progress ) {

	renderer.clear();

}
```

### Cube

```js
const THREE = await import( './examples/js/libs/three.module.js' );

var dom = resources.get( 'dom' );

var renderer = resources.get( 'renderer' );

var camera = new THREE.PerspectiveCamera( 50, dom.clientWidth / dom.clientHeight, 0.1, 100 );
camera.position.z = 5;

window.addEventListener( 'resize', function () {
	camera.aspect = dom.clientWidth / dom.clientHeight;
	camera.updateProjectionMatrix();
} );


var scene = new THREE.Scene();
var mesh = new THREE.Mesh(
	new THREE.CubeGeometry( 1, 1, 1, 2, 2, 2 ),
	new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } )
);
scene.add( mesh );

function start(){}

function update( progress ){

	camera.position.z = 5.0 * progress;
	camera.rotation.z = progress;
	mesh.rotation.y = progress * Math.PI * 2;
	renderer.render( scene, camera );

}
```

### Fade Out

```js
const THREE = await import( './examples/js/libs/three.module.js' );

var parameters = {
	color:   new FRAME.Color( 'Color', 0xffffff ),
	opacity: new FRAME.Float( 'Opacity', 1, 0, 1 )
};

var renderer = resources.get( 'renderer' );

var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
var scene = new THREE.Scene();
var mesh = new THREE.Mesh(
	new THREE.PlaneGeometry( 2, 2 ),
	new THREE.MeshBasicMaterial( { transparent: true } )
);
scene.add( mesh );

function start(){}

function update( progress ){

	mesh.material.color.setHex( parameters.color.value );
	mesh.material.opacity = parameters.opacity.value * ( 1 - progress );
	renderer.render( scene, camera );

}
```

## Animations

### 

* start: 0
* end: 9
* layer: 0
* effect: Clear
* enabled: true

### 

* start: 0
* end: 16
* layer: 1
* effect: Cube
* enabled: true

### 

* start: 4.5
* end: 7.5
* layer: 2
* effect: Fade Out
* enabled: true
