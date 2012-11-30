// Cubes and Spheres
//
// by @paulofalcao
//

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
  
}