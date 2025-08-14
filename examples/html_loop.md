<!-- Frame.js Script r6 -->

# HTML Loop

## Effects

### Color

```js
var dom = resources.get( 'dom' );

function start(){}

function update( progress ){

	dom.style.backgroundColor = 'rgb(' + Math.floor( progress * 255 ) + ', 0, 0)';

}
```

### Loop

```js
function start(){

	player.setLoop( [ 4, 8 ] );

}

function end(){

	player.setLoop( null );

}

function update( progress ){}
```

## Animations

###

 * start: 0
 * end: 12
 * layer: 0
 * effect: Color
 * enabled: true

###

 * start: 4
 * end: 8
 * layer: 1
 * effect: Loop
 * enabled: true
