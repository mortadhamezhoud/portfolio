export const particleVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;   // intro gather (0 -> 1)
  uniform float uMorph;      // shape uFrom -> shape uTo (0 -> 1)
  uniform float uFrom;
  uniform float uTo;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uRef;
  uniform float uNewsHeight;
  uniform vec3 uMouse;
  uniform float uMouseActive;

  attribute vec3 aStart;
  attribute float aRand;
  attribute vec3 aShape1;
  attribute vec3 aShape2;
  attribute vec3 aShape3;
  attribute vec3 aShape4;
  attribute vec3 aColor0;
  attribute vec3 aColor1;
  attribute vec3 aColor2;
  attribute vec3 aColor3;
  attribute vec3 aColor4;
  attribute vec4 aOrder;   // order of shapes 0-3
  attribute vec4 aExtra;   // news order, shield flag, news line flag, news scroll bottom

  varying float vAlpha;
  varying vec3 vColor;

  float easeInOutCubic(float x) {
    return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
  }

  // Position inside the news feed shape: text lines scroll upwards and wrap (fade at the edges)
  float newsRel = 0.0;
  vec3 newsPos() {
    vec3 p = aShape4;
    if (aExtra.z > 0.5) {
      float rel = mod(p.y - aExtra.w + uTime * 0.05 + aExtra.w * 1.7, uNewsHeight);
      newsRel = rel / uNewsHeight;
      p.y = aExtra.w + rel;
    }
    return p;
  }
  vec3 shapePos(float i) {
    if (i < 0.5) return position;
    if (i < 1.5) return aShape1;
    if (i < 2.5) return aShape2;
    if (i < 3.5) return aShape3;
    return newsPos();
  }
  vec3 shapeColor(float i) {
    if (i < 0.5) return aColor0;
    if (i < 1.5) return aColor1;
    if (i < 2.5) return aColor2;
    if (i < 3.5) return aColor3;
    return aColor4;
  }
  float shapeOrder(float i) {
    if (i < 0.5) return aOrder.x;
    if (i < 1.5) return aOrder.y;
    if (i < 2.5) return aOrder.z;
    if (i < 3.5) return aOrder.w;
    return aExtra.x;
  }

  // Bright band travelling along an axis (a pulse): 1 at the centre, 0 away from it
  float band(float x, float centre, float width) {
    float d = (x - centre) / width;
    return exp(-d * d);
  }

  void main() {
    // Intro: particles gather from random positions (staggered per particle)
    float delay = aRand * 0.35;
    float t = clamp((uProgress - delay) / 0.65, 0.0, 1.0);
    float intro = 1.0 - pow(1.0 - t, 3.0);

    // Morph: soft easing + per-particle offset (random mixed with the target shape's own order)
    float d = mix(aRand, shapeOrder(uTo), 0.65) * 0.45;
    float m = easeInOutCubic(clamp((uMorph - d) / 0.55, 0.0, 1.0));
    vec3 target = mix(shapePos(uFrom), shapePos(uTo), m);

    // Particles swing slightly off the straight line while travelling (organic feel)
    vec3 wobble = vec3(sin(aRand * 41.0), cos(aRand * 57.0), sin(aRand * 23.0));
    target += wobble * 0.32 * sin(3.14159 * m);

    vec3 p = mix(aStart, target, intro);

    // Weight of each shape in this particle's current look
    float wFrom = 1.0 - m;
    float wTo = m;
    float wGlobe = (uFrom < 0.5 ? wFrom : 0.0) + (uTo < 0.5 ? wTo : 0.0);
    float wNeural = (abs(uFrom - 2.0) < 0.5 ? wFrom : 0.0) + (abs(uTo - 2.0) < 0.5 ? wTo : 0.0);
    float wWeb = (abs(uFrom - 3.0) < 0.5 ? wFrom : 0.0) + (abs(uTo - 3.0) < 0.5 ? wTo : 0.0);
    float wNews = (abs(uFrom - 4.0) < 0.5 ? wFrom : 0.0) + (abs(uTo - 4.0) < 0.5 ? wTo : 0.0);

    // Particles near the cursor are pushed away slightly (globe only)
    vec3 dm = p - uMouse;
    float push = (1.0 - smoothstep(0.0, 0.5, length(dm))) * 0.14 * uMouseActive * wGlobe;
    p += normalize(dm + vec3(1e-5)) * push;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // Gentle pulse of size and brightness
    float pulse = 0.5 + 0.5 * sin(uTime * 1.3 + aRand * 6.2831);

    // Neural network: impulses cross the layers left -> right in a loop
    float travel = fract(uTime * 0.22);
    float impulse = band(p.x, mix(-1.9, 1.9, travel), 0.3)
                  + band(p.x, mix(-1.9, 1.9, fract(travel + 0.5)), 0.3) * 0.8;
    // Web: packets go up and down between the layers (requests / responses)
    float ping = abs(fract(uTime * 0.18) * 2.0 - 1.0);
    float packet = band(p.z, mix(-1.1, 1.1, ping), 0.22)
                 + band(p.z, mix(1.1, -1.1, ping), 0.22) * 0.6;
    float glow = wNeural * impulse + wWeb * packet;

    gl_PointSize = uSize * uPixelRatio * (0.75 + 0.5 * pulse + 1.1 * glow) * (uRef / -mv.z);

    // Globe: far side is dimmer, which gives depth. Other shapes are evenly lit.
    float facing = normalize(normalMatrix * normalize(position)).z;
    float depthDim = 0.3 + 0.7 * smoothstep(-0.25, 0.7, facing);
    float shade = mix(1.0, depthDim, wGlobe);
    // Shield halo shimmers; news text lines fade in/out at the edges of their scrolling area
    float shimmer = mix(1.0, 0.45 + 0.55 * sin(uTime * 2.0 + aRand * 20.0 + p.y * 3.0), aExtra.y * wNeural);
    float newsFade = mix(1.0, smoothstep(0.0, 0.1, newsRel) * smoothstep(1.0, 0.9, newsRel), aExtra.z * wNews);
    vAlpha = shade * (0.55 + 0.45 * pulse + 1.2 * glow) * intro * shimmer * newsFade;
    vColor = mix(shapeColor(uFrom), shapeColor(uTo), m) + vec3(0.55, 0.7, 0.6) * glow * 0.6;
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
