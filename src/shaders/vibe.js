// Texture-based shader. Each sphere is mapped with either a real image
// (Midjourney/SD reference) or a canvas-painted fallback. Shader applies a
// per-instance colour grade (tint × saturation × hue × brightness) so variants
// of the same image look distinct, then adds rim glow, hover/selected pulse,
// and the supernova completion effect.

export const vertexShader = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uHover;

  float hash(vec3 p){ return fract(sin(dot(p, vec3(127.1,311.7,74.7))) * 43758.5453); }
  float vnoise(vec3 p){
    vec3 i = floor(p); vec3 f = fract(p);
    f = f*f*(3.0-2.0*f);
    float n = mix(
      mix(mix(hash(i), hash(i+vec3(1,0,0)), f.x), mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x), mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y),
      f.z);
    return n;
  }

  void main(){
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    // Subtle organic surface displacement so spheres breathe rather than feel rigid.
    float disp = (vnoise(position * 1.3 + uTime * 0.18) - 0.5) * 0.04 * (1.0 + uHover * 0.6);
    vec3 displaced = position + normal * disp;
    vPos = displaced;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uHover;
  uniform float uSelected;
  uniform float uCompletion;
  uniform sampler2D uTexture;
  uniform vec3 uTintRim;        // colour of the rim glow
  uniform vec3 uTint;           // multiplicative tint for the base texture
  uniform float uSaturation;    // 0 = grey, 1 = original, >1 = boosted
  uniform float uHueShift;      // radians
  uniform float uBrightness;    // multiplier

  // YIQ-based hue rotation
  vec3 hueRotate(vec3 c, float a){
    float U = cos(a); float W = sin(a);
    mat3 m = mat3(
      0.299 + 0.701*U + 0.168*W, 0.587 - 0.587*U + 0.330*W, 0.114 - 0.114*U - 0.497*W,
      0.299 - 0.299*U - 0.328*W, 0.587 + 0.413*U + 0.035*W, 0.114 - 0.114*U + 0.292*W,
      0.299 - 0.3*U   + 1.25*W,  0.587 - 0.588*U - 1.05*W,  0.114 + 0.886*U - 0.203*W
    );
    return clamp(c * m, 0.0, 1.0);
  }

  void main(){
    // Base — sample the painted texture
    vec3 col = texture2D(uTexture, vUv).rgb;
    // Colour grade: hue → saturation → tint → brightness
    col = hueRotate(col, uHueShift);
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(lum), col, uSaturation);
    col *= uTint;
    col *= uBrightness;

    // Fresnel rim glow — stronger on hover/selected
    float fres = pow(1.0 - max(0.0, dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.5);
    col += uTintRim * fres * (0.45 + uHover * 1.0 + uSelected * 1.4);

    // Hover pulse + selected brightness
    col *= 1.0 + uHover * 0.25 * (0.5 + 0.5 * sin(uTime * 4.0));
    col *= 1.0 + uSelected * 0.4;

    // Completion supernova
    if (uCompletion > 0.0) {
      float c = uCompletion;
      float ring = sin(length(vPos) * 6.0 - uTime * 12.0);
      float fastPulse = 0.5 + 0.5 * sin(uTime * 14.0);
      vec3 core = mix(uTintRim, vec3(1.0, 0.95, 0.85), c);
      col = mix(col, core, c * 0.45);
      col += vec3(1.0, 0.96, 0.88) * fres * c * 4.0;
      col += core * smoothstep(0.6, 1.0, ring) * c * 1.2;
      col *= 1.0 + c * fastPulse * 0.6;
    }

    col = pow(col, vec3(0.92));
    gl_FragColor = vec4(col, 1.0);
  }
`;
