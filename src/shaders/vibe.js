// Texture-based shader. Each sphere is mapped with a canvas-painted texture
// (game-art style + game-scene). Shader adds rim glow, hover/selected pulse,
// and the supernova completion effect on top.

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
  uniform vec3 uTintRim; // colour of the rim glow

  void main(){
    // Base — sample the painted texture
    vec3 col = texture2D(uTexture, vUv).rgb;

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
