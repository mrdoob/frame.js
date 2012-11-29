#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define BLADES 20.0
#define BIAS 1.0
#define SHARPNESS 4.0
#define COLOR 0.54, 0.72, 0.96
#define BG 0.34, 0.52, 0.76

void main( void ) {

	vec2 position = (( gl_FragCoord.xy / resolution.xy ) - vec2(0.5)) / vec2(resolution.y/resolution.x,1.0);
	vec3 color = vec3(0.);

	float blade = clamp(pow(sin(time+atan(position.y,position.x)*BLADES)+BIAS, SHARPNESS), 0.0, 1.0);

	color = mix(vec3(COLOR), vec3(BG), blade);

	gl_FragColor = vec4( color, 1.0 );

}
