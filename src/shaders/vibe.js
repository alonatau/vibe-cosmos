// Parameterized abstract-stimulus shader. Each stimulus's appearance is
// fully determined by 4 axis uniforms + palette. No genre tropes — visuals
// are deliberately built to discriminate on the dimensions the personality
// literature actually measures (complexity / symmetry-order / saturation-energy /
// curvature-softness). See data/vibes.js for the score → axis mapping.

export const vertexShader = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uHover;
  uniform float uComplexity;
  uniform float uOrder;
  uniform float uEnergy;
  uniform float uSoftness;

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

    float speed = 0.25 + (uEnergy + 1.0) * 0.55;
    float disp;
    if (uSoftness >= 0.0) {
      // Smooth low-frequency bulges — round, organic forms
      float freq = 1.2 - uSoftness * 0.4;
      disp = (vnoise(position * freq + uTime * speed * 0.25) - 0.5) * 0.08 * (0.6 + (uComplexity + 1.0) * 0.5);
    } else {
      // Higher-frequency, harder-stepped displacement — angular, faceted
      float freq = 3.0 + (-uSoftness) * 4.0;
      float n = vnoise(position * freq + uTime * speed * 0.18);
      float facet = step(0.5, n);
      disp = (facet - 0.5) * 0.07 * (0.6 + (uComplexity + 1.0) * 0.5);
    }
    disp *= 1.0 + uHover * 0.5;

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
  uniform float uComplexity;  // -1 sparse / +1 dense
  uniform float uOrder;       // -1 broken-asymmetric / +1 strict-symmetric
  uniform float uEnergy;      // -1 calm-desat / +1 vivid-fast
  uniform float uSoftness;    // -1 angular-sharp / +1 curved-smooth
  uniform vec3 uPalette[3];

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
  // Variable-octave fbm — octave count drives perceived complexity
  float fbmN(vec3 p, int octaves){
    float v = 0.0; float a = 0.5; float wsum = 0.0;
    for(int i = 0; i < 6; i++){
      if (i >= octaves) break;
      v += a * vnoise(p);
      wsum += a;
      p *= 2.02;
      a *= 0.5;
    }
    return wsum > 0.0 ? v / wsum : v;
  }
  vec2 cellular(vec3 p){
    vec3 ip = floor(p); vec3 fp = fract(p);
    float d1 = 1e9; float d2 = 1e9;
    for(int x=-1;x<=1;x++) for(int y=-1;y<=1;y++) for(int z=-1;z<=1;z++){
      vec3 g = vec3(float(x),float(y),float(z));
      vec3 o = vec3(hash(ip+g), hash(ip+g+17.1), hash(ip+g+41.3));
      float d = length(g + o - fp);
      if(d < d1){ d2 = d1; d1 = d; } else if(d < d2){ d2 = d; }
    }
    return vec2(d1, d2);
  }

  void main(){
    vec3 P = vPos * 1.4;
    float speed = 0.3 + (uEnergy + 1.0) * 0.55;
    float t = uTime * speed;

    // Complexity drives the FBM octave count (2 → 6)
    int octaves = int(2.0 + (uComplexity + 1.0) * 2.0);
    float density = fbmN(P + t * 0.2, octaves);

    // Order: positive blends toward radial-symmetric mandala, negative toward chaos
    float r = length(vPos);
    float theta = atan(vPos.y, vPos.x);
    float symN = 4.0 + (uOrder + 1.0) * 4.0;
    float symBand = sin(theta * symN + t * 0.15) * 0.5 + 0.5;
    float radialFalloff = smoothstep(1.6, 0.0, r * 1.1);
    float symmetric = symBand * radialFalloff + (1.0 - radialFalloff) * 0.5;

    float chaos = vnoise(P * 5.5 + t * 0.4);

    float pattern;
    if (uOrder >= 0.0) {
      pattern = mix(density, symmetric, uOrder * 0.85);
    } else {
      pattern = mix(density, chaos, -uOrder * 0.6);
    }

    // Softness: negative sharpens via cellular thresholding (crystalline);
    // positive smooths the histogram toward gentle gradients.
    if (uSoftness < 0.0) {
      vec2 cells = cellular(P * (2.0 + (-uSoftness) * 2.5) + t * 0.1);
      float crystalline = smoothstep(0.0, 0.06, cells.y - cells.x);
      pattern = mix(pattern, 1.0 - crystalline, -uSoftness * 0.65);
    } else {
      pattern = smoothstep(0.05, 0.95, pattern);
      pattern = pow(max(0.0, pattern), 1.0 - uSoftness * 0.35);
    }

    // Map pattern to palette
    vec3 col = mix(uPalette[2], uPalette[0], pattern);
    col = mix(col, uPalette[1], pattern * pattern * 0.55);

    // Energy drives saturation + brightness
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(lum), col, 0.5 + uEnergy * 0.45);
    col *= 0.78 + (uEnergy + 1.0) * 0.16;

    // Fresnel rim glow
    float fres = pow(1.0 - max(0.0, dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.5);
    vec3 rim = mix(uPalette[0], uPalette[1], 0.5);
    col += rim * fres * (0.6 + uHover * 1.2 + uSelected * 1.5);

    // Hover pulse
    col *= 1.0 + uHover * 0.3 * (0.5 + 0.5 * sin(uTime * 4.0));
    col *= 1.0 + uSelected * 0.4;

    // Completion supernova — radial pulse, accelerating spin glow, white core bleed
    if (uCompletion > 0.0) {
      float c = uCompletion;
      float ring = sin(length(vPos) * 6.0 - uTime * 12.0);
      float fastPulse = 0.5 + 0.5 * sin(uTime * 14.0);
      vec3 core = mix(uPalette[0], vec3(1.0, 0.95, 0.85), c);
      col = mix(col, core, c * 0.45);
      col += vec3(1.0, 0.96, 0.88) * fres * c * 4.0;
      col += core * smoothstep(0.6, 1.0, ring) * c * 1.2;
      col *= 1.0 + c * fastPulse * 0.6;
    }

    col = pow(col, vec3(0.85));
    gl_FragColor = vec4(col, 1.0);
  }
`;
