export const particleVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uRef;
  uniform vec3 uMouse;
  uniform float uMouseActive;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  attribute vec3 aStart;
  attribute float aRand;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    // Entry: particles gather from random positions (staggered per particle)
    float delay = aRand * 0.35;
    float t = clamp((uProgress - delay) / 0.65, 0.0, 1.0);
    float e = 1.0 - pow(1.0 - t, 3.0);
    vec3 p = mix(aStart, position, e);

    // Particles near the cursor are pushed away slightly
    vec3 d = p - uMouse;
    float push = (1.0 - smoothstep(0.0, 0.5, length(d))) * 0.14 * uMouseActive;
    p += normalize(d + vec3(1e-5)) * push;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // Gentle pulse of size and brightness
    float pulse = 0.5 + 0.5 * sin(uTime * 1.3 + aRand * 6.2831);
    gl_PointSize = uSize * uPixelRatio * (0.75 + 0.5 * pulse) * (uRef / -mv.z);

    // Far side of the sphere is dimmer, which gives depth
    float facing = normalize(normalMatrix * normalize(position)).z;
    vAlpha = (0.3 + 0.7 * smoothstep(-0.25, 0.7, facing)) * (0.55 + 0.45 * pulse) * e;
    vColor = mix(uColorA, uColorB, fract(aRand * 7.13));
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
