export const particleVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;   // intro gather (0 -> 1)
  uniform float uMorph;      // shape A -> shape B (0 -> 1)
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uRef;
  uniform vec3 uMouse;
  uniform float uMouseActive;

  attribute vec3 aStart;
  attribute float aRand;
  attribute vec3 aShape1;
  attribute vec3 aColor0;
  attribute vec3 aColor1;
  attribute vec2 aOrder;

  varying float vAlpha;
  varying vec3 vColor;

  float easeInOutCubic(float x) {
    return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
  }

  void main() {
    // Intro: particles gather from random positions (staggered per particle)
    float delay = aRand * 0.35;
    float t = clamp((uProgress - delay) / 0.65, 0.0, 1.0);
    float intro = 1.0 - pow(1.0 - t, 3.0);

    // Morph: soft easing + per-particle offset (random mixed with the shape's own order)
    float d = mix(aRand, aOrder.y, 0.65) * 0.45;
    float m = easeInOutCubic(clamp((uMorph - d) / 0.55, 0.0, 1.0));
    vec3 target = mix(position, aShape1, m);

    // Particles swing slightly off the straight line while travelling (organic feel)
    vec3 wobble = vec3(sin(aRand * 41.0), cos(aRand * 57.0), sin(aRand * 23.0));
    target += wobble * 0.32 * sin(3.14159 * m);

    vec3 p = mix(aStart, target, intro);

    // Particles near the cursor are pushed away slightly (globe only)
    float globeW = 1.0 - m;
    vec3 dm = p - uMouse;
    float push = (1.0 - smoothstep(0.0, 0.5, length(dm))) * 0.14 * uMouseActive * globeW;
    p += normalize(dm + vec3(1e-5)) * push;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // Gentle pulse of size and brightness
    float pulse = 0.5 + 0.5 * sin(uTime * 1.3 + aRand * 6.2831);
    gl_PointSize = uSize * uPixelRatio * (0.75 + 0.5 * pulse) * (uRef / -mv.z);

    // Globe: far side is dimmer, which gives depth. Other shapes are evenly lit.
    float facing = normalize(normalMatrix * normalize(position)).z;
    float depthDim = 0.3 + 0.7 * smoothstep(-0.25, 0.7, facing);
    float shade = mix(depthDim, 1.0, m);
    vAlpha = shade * (0.55 + 0.45 * pulse) * intro;
    vColor = mix(aColor0, aColor1, m);
  }
`;

export const particleFragmentShader = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor * 1.15, a * vAlpha);
  }
`;
