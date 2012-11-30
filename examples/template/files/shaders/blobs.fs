// by @mnstrmnch (remixed by @mrdoob)

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

    return vec3( mix( ((max(-dot(n,vec3(0.977)),0.) + 0.125*max(-dot(n,vec3(-.707,-.707,0)),0.)))*(mod

(length(p.xy)*5.,2.)<1.0?vec3(1.0,1.,1.):vec3(.0,.0,.0))
                           ,vec3(1.0,1.0,1.5), vec3(pow(t/10.,1.5)) ) );
}

void main()
{
    vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
    gl_FragColor=vec4(s(vec3(0.0,0.0,time), normalize(vec3(p.xy,sin(time/5.0)*0.25+0.75))),1.0);
}
