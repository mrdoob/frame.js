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
    		n=normalize(
		vec3(s.x-obj1(p-e.xyy).x, s.x-obj1(p-e.yxy).x, s.x-obj1(p-e.yyx).x));
		float b=dot(n,normalize(prp-p));
		gl_FragColor=vec4((b*c+pow(b,32.))*(1.0-f*.04),1.);//simple phong LightPosition=CameraPosition
	}
	
  else gl_FragColor=vec4(0.,0.,0.,1.); //background color
}