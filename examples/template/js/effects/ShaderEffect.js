var ShaderEffect = function ( properties ) {

	FRAME.Effect.call( this );

	var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

	var vertexShader = 'void main() { gl_Position = vec4( position, 1.0 ); }';
	var fragmentShader = '// http://glsl.heroku.com/e#5094.0\n\
uniform float time;\n\
uniform vec2 mouse;\n\
uniform vec2 resolution;\n\
\n\
#define BLADES 20.0\n\
#define BIAS 1.0\n\
#define SHARPNESS 4.0\n\
#define COLOR 0.54, 0.72, 0.96\n\
#define BG 0.34, 0.52, 0.76\n\
\n\
void main( void ) {\n\
\n\
	vec2 position = (( gl_FragCoord.xy / resolution.xy ) - vec2(0.5)) / vec2(resolution.y/resolution.x,1.0);\n\
	vec3 color = vec3(0.);\n\
\n\
	float blade = clamp(pow(sin(time+atan(position.y,position.x)*BLADES)+BIAS, SHARPNESS), 0.0, 1.0);\n\
\n\
	color = mix(vec3(COLOR), vec3(BG), blade);\n\
\n\
	gl_FragColor = vec4( color, 1.0 );\n\
\n\
}';

	var uniforms = {
		time: { type: "f", value: 1.0 },
		mouse: { type: "v2", value: new THREE.Vector2() },
		resolution: { type: "v2", value: new THREE.Vector2( 800, 600 ) }
	};

	var material = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: vertexShader,
		fragmentShader: fragmentShader
	} );

	var scene = new THREE.Scene();

	var object = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
	scene.add( object );

	this.render = function ( value ) {

		uniforms.time.value = value * 100;
		renderer.render( scene, camera );

	};

};

ShaderEffect.prototype = Object.create( FRAME.Effect );
