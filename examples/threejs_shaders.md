<!-- Frame.js Script r6 -->

# Three.js Shaders

## Config

 * Duration: 70

## Scripts

### Renderer

```js
const THREE = await import( './examples/js/libs/three.module.js' );

const dom = resources.get( 'dom' );

const renderer = new THREE.WebGLRenderer();
renderer.autoClear = false;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( dom.clientWidth, dom.clientHeight );
dom.appendChild( renderer.domElement );

window.addEventListener( 'resize', function () {
	
	renderer.setSize( dom.clientWidth, dom.clientHeight );
	
} );

resources.set( 'renderer', renderer );
```

### ShaderRenderer

```js
const THREE = await import( './examples/js/libs/three.module.js' );

const SHADERS = {
	
	// by @mnstrmnch (remixed by @mrdoob)

	blobs: `
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform float time;

float f(vec3 o)
{
    float a=(sin(o.x)+o.y*.25)*2.35;
    // o=vec3(cos(time+a)*sin(time+o.x)*o.x-sin(time+a)*o.y,sin(a)*sin(time+o.y)*o.x+cos(time+a)*o.y,o.z);
    o=vec3(sin(time+a)*sin(o.x+o.z/3.0)*o.x,sin(time+a)*cos(o.y+o.z/2.0)*o.y,o.z);
    return dot(cos(o)*cos(o),vec3(1))-1.2;
}

vec3 s(vec3 o,vec3 d)
{
    float t=0.0;
    float dt = 0.2;
    float nh = 0.0;
    float lh = 0.0;
    for(int i=0;i<50;i++)
    {
        nh = f(o+d*t);
        if(nh>0.0) { lh=nh; t+=dt; }
    }

    if( nh > 0.0 ) return vec3(1.0,1.0,1.0);

    t = t - dt*nh/(nh-lh);

    vec3 e=vec3(-.1,.0,0.0);
    vec3 p=o+d*t;
    vec3 n=-normalize(vec3(f(p+e),f(p+e.yxy),f(p+e.yyx))+vec3((sin(p*75.)))*.001);

    return vec3( mix( ((max(-dot(n,vec3(0.977)),0.) + 0.125*max(-dot(n,vec3(-.707,-.707,0)),0.)))*(mod(length(p.xy)*5.,2.)<1.0?vec3(1.0,1.,1.):vec3(.0,.0,.0)), vec3(1.0,1.0,1.5), vec3(pow(t/10.,1.5)) ) );
}

void main()
{
    vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
    gl_FragColor=vec4(s(vec3(0.0,0.0,time), normalize(vec3(p.xy,sin(time/5.0)*0.25+0.75))),1.0);
}`,
	
	// by @paulofalcao
	
	cubeballs: `
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

//Util Start
float PI=3.14159265;

vec2 ObjUnion(
  in vec2 obj0,
  in vec2 obj1)
{
  if (obj0.x<obj1.x)
    return obj0;
  else
    return obj1;
}

vec2 sim2d(
  in vec2 p,
  in float s)
{
   vec2 ret=p;
   ret=p+s/2.0;
   ret=fract(ret/s)*s-s/2.0;
   return ret;
}

vec3 stepspace(
  in vec3 p,
  in float s)
{
  return p-mod(p-s/2.0,s);
}

vec3 phong(
  in vec3 pt,
  in vec3 prp,
  in vec3 normal,
  in vec3 light,
  in vec3 color,
  in float spec,
  in vec3 ambLight)
{
   vec3 lightv=normalize(light-pt);
   float diffuse=dot(normal,lightv);
   vec3 refl=-reflect(lightv,normal);
   vec3 viewv=normalize(prp-pt);
   float specular=pow(max(dot(refl,viewv),0.0),spec);
   return (max(diffuse,0.0)+ambLight)*color+specular;
}

//Util End

//Scene Start

vec2 obj(in vec3 p)
{ 
  vec3 fp=stepspace(p,2.0);;
  float d=sin(fp.x*0.3+time*4.0)+cos(fp.z*0.3+time*2.0);
  p.y=p.y+d;
  p.xz=sim2d(p.xz,2.0);
  float c1=length(max(abs(p)-vec3(0.6,0.6,0.6),0.0))-0.35;
  float c2=length(p)-1.0;
  float cf=sin(time)*0.5+0.5;
  return vec2(mix(c1,c2,cf),1.0);
}

vec3 obj_c(vec3 p){
  vec2 fp=sim2d(p.xz-1.0,4.0);
  if (fp.y>0.0) fp.x=-fp.x;
  if (fp.x>0.0) return vec3(0.0,0.0,0.0);
    else return vec3(1.0,1.0,1.0);   
}

//Scene End

float raymarching(
  in vec3 prp,
  in vec3 scp,
  in int maxite,
  in float precis,
  in float startf,
  in float maxd,
  out float objid)
{ 
  const vec3 e=vec3(0.1,0,0.0);
  vec2 s=vec2(startf,0.0);
  vec3 c,p,n;
  float f=startf;
  for(int i=0;i<256;i++){
    if (abs(s.x)<precis||f>maxd||i>maxite) break;
    f+=s.x;
    p=prp+scp*f;
    s=obj(p);
    objid=s.y;
  }
  if (f>maxd) objid=-1.0;
  return f;
}

vec3 camera(
  in vec3 prp,
  in vec3 vrp,
  in vec3 vuv,
  in float vpd)
{
  vec2 vPos=-1.0+2.0*gl_FragCoord.xy/resolution.xy;
  vec3 vpn=normalize(vrp-prp);
  vec3 u=normalize(cross(vuv,vpn));
  vec3 v=cross(vpn,u);
  vec3 scrCoord=prp+vpn*vpd+vPos.x*u*resolution.x/resolution.y+vPos.y*v;
  return normalize(scrCoord-prp);
}

vec3 normal(in vec3 p)
{
  //tetrahedron normal
  const float n_er=0.01;
  float v1=obj(vec3(p.x+n_er,p.y-n_er,p.z-n_er)).x;
  float v2=obj(vec3(p.x-n_er,p.y-n_er,p.z+n_er)).x;
  float v3=obj(vec3(p.x-n_er,p.y+n_er,p.z-n_er)).x;
  float v4=obj(vec3(p.x+n_er,p.y+n_er,p.z+n_er)).x;
  return normalize(vec3(v4+v1-v3-v2,v3+v4-v1-v2,v2+v4-v3-v1));
}

vec3 render(
  in vec3 prp,
  in vec3 scp,
  in int maxite,
  in float precis,
  in float startf,
  in float maxd,
  in vec3 background,
  in vec3 light,
  in float spec,
  in vec3 ambLight,
  out vec3 n,
  out vec3 p,
  out float f,
  out float objid)
{ 
  objid=-1.0;
  f=raymarching(prp,scp,maxite,precis,startf,maxd,objid);
  if (objid>-0.5){
    p=prp+scp*f;
    vec3 c=obj_c(p);
    n=normal(p);
    vec3 cf=phong(p,prp,n,light,c,spec,ambLight);
    return vec3(cf);
  }
  f=maxd;
  return vec3(background); //background color
}

void main(void){
 
  //Camera animation
  vec3 vuv=vec3(0,1,0);
  vec3 vrp=vec3(time*4.0,0.0,0.0);
  float mx=mouse.x*PI*2.0;
  float my=mouse.y*PI/2.01; 
  vec3 prp=vrp+vec3(cos(my)*cos(mx),sin(my),cos(my)*sin(mx))*12.0; //Trackball style camera pos
  float vpd=1.5;
  vec3 light=prp+vec3(5.0,0,5.0);
  
  vec3 scp=camera(prp,vrp,vuv,vpd);
  vec3 n,p;
  float f,o;
  const float maxe=0.01;
  const float startf=0.1;
  const vec3 backc=vec3(0.0,0.0,0.0);
  const float spec=8.0;
  const vec3 ambi=vec3(0.1,0.1,0.1);
  
  vec3 c1=render(prp,scp,256,maxe,startf,60.0,backc,light,spec,ambi,n,p,f,o);
  c1=c1*max(1.0-f*.015,0.0);
  vec3 c2=backc;
  if (o>0.5){
    scp=reflect(scp,n);
    c2=render(p+scp*0.05,scp,32,maxe,startf,10.0,backc,light,spec,ambi,n,p,f,o);
  }
  c2=c2*max(1.0-f*.1,0.0);
  gl_FragColor=vec4(c1.xyz*0.75+c2.xyz*0.25,1.0);
  
}`,
	
	field: `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

//Raymarching Distance Fields
//About http://www.iquilezles.org/www/articles/raymarchingdf/raymarchingdf.htm
//Also known as Sphere Tracing
//IQs sphere (http://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm)
//some screwed up stuff, by gt

vec2 obj1(in vec3 p)
{
  //obj repeating
  p.x=fract(p.x+0.5)-0.5;
  p.z=fract(p.z+0.5)-0.5;
  p.y=fract(p.y+0.5)-0.5;

/*
  	float sdSphere( vec3 p, float s )
		{
 	 return length(p)-s;
		}
*/
     vec3 q = abs(p.xyz);
 	vec2 b = vec2(max(q.z-.1,max(q.x+q.y*0.57735,q.y)-.05));
  vec2 s = vec2(length(p) - .25);
  return vec2(mix(b,s,.5));
 }

//sphere with simple solid color
vec3 obj1_c(in vec3 p)
{
	return vec3(1.,1.,.9);
}

void main(void)
{
  vec2 vPos=-1.0+2.0*gl_FragCoord.xy/resolution.xy;

  //animate
  vec3 vuv=vec3(0,1,sin(time*0.1));//Change camere up vector here
  vec3 prp=vec3(sin(time*0.15)*2.0,sin(time*0.5)*2.0,cos(time*0.1)*8.0); //Change camera path position here
  vec3 vrp=vec3(0,0,1.); //Change camere view here

  //camera
  vec3 vpn=normalize(vrp-prp);
  vec3 u=normalize(cross(vuv,vpn));
  vec3 v=cross(vpn,u);
  vec3 vcv=(prp+vpn);
  vec3 scrCoord=vcv+vPos.x*u*resolution.x/resolution.y+vPos.y*v;
  vec3 scp=normalize(scrCoord-prp);

  //Raymarching
  //refine edge w .01
  const vec3 e=vec3(0.01,0,0);
  vec2 s=vec2(0.01,0.0);
  vec3 c,p,n;
  
	float f=0.;
	for(int i=0;i<256;i++)
	{
		if (abs(s.x)<.01||f>64.) break;
		f+=s.x;
		p=prp+scp*f;
		s=obj1(p);
	}
  
	if (f<64.)
	{
		c=obj1_c(p);
    	vec3 n=normalize(
		vec3(s.x-obj1(p-e.xyy).x, s.x-obj1(p-e.yxy).x, s.x-obj1(p-e.yyx).x));
		float b=dot(n,normalize(prp-p));
		gl_FragColor=vec4((b*c+pow(b,32.))*(1.0-f*.04),1.);//simple phong LightPosition=CameraPosition
	}
	
  else gl_FragColor=vec4(0.,0.,0.,1.); //background color
}`,
	
	// by @paulofalcao
	
	lights: `
#ifdef GL_ES
precision highp float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float makePoint(float x,float y,float fx,float fy,float sx,float sy,float t){
   float xx=x+sin(t*fx)*sx;
   float yy=y+cos(t*fy)*sy;
   return 1.0/sqrt(xx*xx+yy*yy);
}

void main( void ) {

   vec2 p=(gl_FragCoord.xy/resolution.x)*2.0-vec2(1.0,resolution.y/resolution.x);

   p=p*1.5;
   
   float x=p.x;
   float y=p.y;

   float a=
       makePoint(x,y,3.3,2.9,0.3,0.3,time);
   a=a+makePoint(x,y,1.9,2.0,0.4,0.4,time);
   a=a+makePoint(x,y,0.8,0.7,0.4,0.5,time);
   a=a+makePoint(x,y,2.3,0.1,0.6,0.3,time);
   a=a+makePoint(x,y,0.8,1.7,0.5,0.4,time);
   a=a+makePoint(x,y,0.3,1.0,0.4,0.4,time);
   a=a+makePoint(x,y,1.4,1.7,0.4,0.5,time);
   a=a+makePoint(x,y,1.3,2.1,0.6,0.3,time);
   a=a+makePoint(x,y,1.8,1.7,0.5,0.4,time);   
   
   float b=
       makePoint(x,y,1.2,1.9,0.3,0.3,time);
   b=b+makePoint(x,y,0.7,2.7,0.4,0.4,time);
   b=b+makePoint(x,y,1.4,0.6,0.4,0.5,time);
   b=b+makePoint(x,y,2.6,0.4,0.6,0.3,time);
   b=b+makePoint(x,y,0.7,1.4,0.5,0.4,time);
   b=b+makePoint(x,y,0.7,1.7,0.4,0.4,time);
   b=b+makePoint(x,y,0.8,0.5,0.4,0.5,time);
   b=b+makePoint(x,y,1.4,0.9,0.6,0.3,time);
   b=b+makePoint(x,y,0.7,1.3,0.5,0.4,time);

   float c=
       makePoint(x,y,3.7,0.3,0.3,0.3,time);
   c=c+makePoint(x,y,1.9,1.3,0.4,0.4,time);
   c=c+makePoint(x,y,0.8,0.9,0.4,0.5,time);
   c=c+makePoint(x,y,1.2,1.7,0.6,0.3,time);
   c=c+makePoint(x,y,0.3,0.6,0.5,0.4,time);
   c=c+makePoint(x,y,0.3,0.3,0.4,0.4,time);
   c=c+makePoint(x,y,1.4,0.8,0.4,0.5,time);
   c=c+makePoint(x,y,0.2,0.6,0.6,0.3,time);
   c=c+makePoint(x,y,1.3,0.5,0.5,0.4,time);
   
   vec3 d=vec3(a,b,c)/32.0;
   
   gl_FragColor = vec4(d.x,d.y,d.z,1.0);
}`,
	
	// by @platosha
	
	planedistort: `
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float TAU = 6.2832;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 p = -1.0 + 2.0 * position;
	p *= vec2( resolution.x/resolution.y, 1.0 );
	
	float alpha = -time * 0.13;
	float sinA = sin(alpha), cosA = cos(alpha);
	p = vec2(cosA*p.x+sinA*p.y, -sinA*p.x+cosA*p.y);
	
	vec2 q = p;
	vec2 dir = vec2( sin(time*0.19), cos(time*0.27) ) * 0.333;
	q = p + dir/pow(0.5, 0.6-dot(p-dir,p-dir));
	
	q = mix(q, p, sin(time*0.78));
	
	float zr = 1.0/length(q);
	float zp = 1.0/abs(q.y);
	float mc = sin(time*0.16)*.5 + .5;
	mc = smoothstep(0.0, 1.0, mc);
	mc = smoothstep(0.0, 1.0, mc);
	mc = smoothstep(0.0, 1.0, mc);
	mc = smoothstep(0.0, 1.0, mc);
	float z = mix(zr, zp, mc);
	float ur = 5.0*atan(q.x*sign(q.y), abs(q.y))/TAU + cos(0.2*z*TAU+time*1.37) * 1.2 * sin( time * 0.21 );
	float up = q.x*z;
	float u = mix(ur, up, mc);
	vec2 uv = vec2(u, (1.0+mc*2.0)*z);
	
	float mv = sin(time * 0.0);
	uv = mix(uv, q, 0.0);
	
	float color = 0.0;
	color = cos(uv.x*TAU) * cos(uv.y*TAU + time*7.7);
	color = pow(abs(cos(color*TAU)), 3.0);
	
	float color2 = 0.0;
	color2 = cos(uv.x*TAU*2.0);
	color2 -= 0.55;
		
	float shadow = 1.0/(z*z);
	vec3 rc = vec3(0.9, 1.0, 0.8)*color +
		  vec3(0.3, 0.7, 0.6)*color2;
	rc *= shadow;
	
	gl_FragColor = vec4( rc, 2.0 );

}`

};

function ShaderRenderer( shader_name ){
	
	const renderer = resources.get( 'renderer' );

	const scene = new THREE.Scene();

	const camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

	const uniforms = {
		time: { type: "f", value: 1.0 },
		mouse: { type: "v2", value: new THREE.Vector2( 0.5, 0.5 ) },
		resolution: { type: "v2", value: new THREE.Vector2() }
	};

	const geometry = new THREE.PlaneGeometry( 2, 2 );
	const material = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: 'void main() { gl_Position = vec4( position, 1.0 ); }',
		fragmentShader: SHADERS[ shader_name ]
	} );
	
	
	const mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
	
	//
	
	this.setMouse = function ( array ) {

		uniforms.mouse.value.fromArray( array );
		return this;
	
	};
	
	this.render = function ( time ) {
		
		uniforms.time.value = time;
		uniforms.resolution.value.set( 
			renderer.domElement.width, 
			renderer.domElement.height
		);

		renderer.render( scene, camera );
		
		
	};
	
}

resources.set( 'ShaderRenderer', ShaderRenderer );
```

### ImageRenderer

```js
const THREE = await import( './examples/js/libs/three.module.js' );

const dom = resources.get( 'dom' );

function ImageRenderer( url, width, height ) {
	
	const renderer = resources.get( 'renderer' );

	const scene = new THREE.Scene();

	const camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	
	const geometry = new THREE.PlaneGeometry( 1, 1 );
	const material = new THREE.MeshBasicMaterial( {
		map: new THREE.TextureLoader().load( url ),
		depthTest: false,
		depthWrite: false
	} );

	const mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
	
	//
	
	this.render = function () {

		const element = renderer.domElement;

		mesh.scale.x = width / element.clientWidth;
		mesh.scale.y = height / element.clientHeight;

		renderer.render( scene, camera );
	
	};
	
}

resources.set( 'ImageRenderer', ImageRenderer );
```

### ColorRenderer

```js
const THREE = await import( './examples/js/libs/three.module.js' );

function ColorRenderer( color ){
	
	const renderer = resources.get( 'renderer' );
	
	const scene = new THREE.Scene();

	const camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

	const geometry = new THREE.PlaneGeometry( 2, 2 );
	const material = new THREE.MeshBasicMaterial( {
		color: color,
		depthTest: false,
		depthWrite: false,
		transparent: true
	} );
	
	
	const mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
	
	//
	
	this.render = function ( opacity ) {
		
		
		material.opacity = opacity;
		renderer.render( scene, camera );
		
		
	}
	
}

resources.set( 'ColorRenderer', ColorRenderer );
```

## Effects

### Audio

```js
const audio = new WebAudio();
audio.src = './examples/files/lug00ber-bastion_amstel.mp3';

function start(){

	player.setAudio( audio );

}

function end(){

	player.setAudio( null );

}

function update( progress ){}
```

### Lights

```js
const ShaderRenderer = resources.get( 'ShaderRenderer' );
const shader = new ShaderRenderer( 'lights' );

function start(){}

function end(){}

function update( progress ){

	shader.render( progress * 10 );

}
```

### CubeBalls 1

```js
const ShaderRenderer = resources.get( 'ShaderRenderer' );
const shader = new ShaderRenderer( 'cubeballs' ).setMouse( [ 0.75, 0.75 ] );

function start(){}

function end(){}

function update( progress ){

	shader.render( progress * 6 );

}
```

### CubeBalls 2

```js
const ShaderRenderer = resources.get( 'ShaderRenderer' );
const shader = new ShaderRenderer( 'cubeballs' ).setMouse( [ -0.75, 0.25 ] );

function start(){}

function end(){}

function update( progress ){

	shader.render( progress * 6 );

}
```

### PlaneDistort 1

```js
const ShaderRenderer = resources.get( 'ShaderRenderer' );
const shader = new ShaderRenderer( 'planedistort' );

function start(){}

function end(){}

function update( progress ){

	shader.render( progress * 20 );

}
```

### PlaneDistort 2

```js
const ShaderRenderer = resources.get( 'ShaderRenderer' );
const shader = new ShaderRenderer( 'planedistort' );

function start(){}

function end(){}

function update( progress ){

	shader.render( progress * 20 + 450 );

}
```

### Field 1

```js
const ShaderRenderer = resources.get( 'ShaderRenderer' );
const shader = new ShaderRenderer( 'field' );

function start(){}

function end(){}

function update( progress ){

	shader.render( progress * 20 );

}
```

### Field 2

```js
const ShaderRenderer = resources.get( 'ShaderRenderer' );
const shader = new ShaderRenderer( 'field' );

function start(){}

function end(){}

function update( progress ){

	shader.render( progress * 20 + 450 );

}
```

### Blobs

```js
const ShaderRenderer = resources.get( 'ShaderRenderer' );
const shader = new ShaderRenderer( 'blobs' );

function start(){}

function end(){}

function update( progress ){

	shader.render( progress * 10 );

}
```

### Black Fade Out

```js
const ColorRenderer = resources.get( 'ColorRenderer' );
const color = new ColorRenderer( 0x000000 );

function start(){}

function end(){}

function update( progress ){

	color.render( 1 - progress );

}
```

### White Fade Out

```js
const ColorRenderer = resources.get( 'ColorRenderer' );
const color = new ColorRenderer( 0xffffff );

function start(){}

function end(){}

function update( progress ){

	color.render( 1 - progress );

}
```

### Image

```js
const ImageRenderer = resources.get( 'ImageRenderer' );
const image = new ImageRenderer( './examples/files/credits.png', 1024, 256 );

function start(){}

function end(){}

function update( progress ){

	image.render();

}
```

## Animations

###

 * start: 0
 * end: 70.04761904761891
 * layer: 0
 * effect: Audio
 * enabled: true

###

 * start: 0
 * end: 14.11331444759207
 * layer: 1
 * effect: Lights
 * enabled: true

###

 * start: 0
 * end: 14.110166824047848
 * layer: 2
 * effect: Black Fade Out
 * enabled: true

###

 * start: 14.116462071136288
 * end: 21.170556552962285
 * layer: 1
 * effect: CubeBalls 1
 * enabled: true

###

 * start: 21.17280071813286
 * end: 28.233393177737863
 * layer: 1
 * effect: CubeBalls 2
 * enabled: true

###

 * start: 28.235637342908447
 * end: 35.291741472172404
 * layer: 1
 * effect: PlaneDistort 1
 * enabled: true

###

 * start: 35.29398563734295
 * end: 42.34707158351422
 * layer: 1
 * effect: PlaneDistort 2
 * enabled: true

###

 * start: 35.293985637342956
 * end: 37
 * layer: 2
 * effect: White Fade Out
 * enabled: true

###

 * start: 42.34924078091104
 * end: 44
 * layer: 2
 * effect: White Fade Out
 * enabled: true

###

 * start: 42.34924078091118
 * end: 49.40563991323218
 * layer: 1
 * effect: Field 1
 * enabled: true

###

 * start: 49.40780911062914
 * end: 56.466377440347145
 * layer: 1
 * effect: Field 2
 * enabled: true

###

 * start: 56.466377440347145
 * end: 60
 * layer: 3
 * effect: White Fade Out
 * enabled: true

###

 * start: 56.468546637744126
 * end: 70.04772234273308
 * layer: 1
 * effect: Blobs
 * enabled: true

###

 * start: 56.46854663774414
 * end: 70.0477223427332
 * layer: 2
 * effect: Image
 * enabled: true