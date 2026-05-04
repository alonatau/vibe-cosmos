// Single fragment shader that branches per vibe mode. Keeps draw calls cheap, lets each
// sphere feel like its own world via procedural noise, palettes, and motion.

export const vertexShader = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uHover;
  uniform int uMode;

  // Cheap hash + value noise for vertex displacement
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
    // Per-mode displacement: doom cracked, fantasy aurora, cosmic horror tendrils
    float disp = 0.0;
    if(uMode == 1) disp = vnoise(position * 3.0 + uTime * 0.4) * 0.18;
    else if(uMode == 6) disp = sin(position.y * 4.0 + uTime) * 0.06 + vnoise(position*2.0 + uTime*0.3)*0.12;
    else if(uMode == 3) disp = sin(position.y * 6.0 + uTime * 1.2) * 0.04 + vnoise(position*2.5)*0.06;
    else if(uMode == 10) disp = vnoise(position*4.0 + uTime*0.2) * 0.05;
    else disp = vnoise(position * 1.5 + uTime * 0.2) * 0.04;

    disp *= 1.0 + uHover * 0.6;
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
  uniform int uMode;
  uniform vec3 uPalette[3];

  // ------- noise helpers -------
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
  float fbm(vec3 p){
    float v = 0.0; float a = 0.5;
    for(int i=0;i<5;i++){ v += a * vnoise(p); p *= 2.02; a *= 0.5; }
    return v;
  }
  // Cellular F1 distance for cracked / lava
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

  vec3 modeColor(){
    vec3 P = vPos * 1.5;
    float t = uTime;
    vec3 col = vec3(0.0);

    if(uMode == 0){ // anime sakura — soft pastel flow, sparkle
      float n = fbm(P * 0.9 + t * 0.15);
      vec3 base = mix(uPalette[0], uPalette[1], smoothstep(0.3, 0.7, n));
      float sparkle = pow(vnoise(P * 12.0 + t), 18.0) * 2.0;
      col = base + vec3(sparkle) * uPalette[2];
    }
    else if(uMode == 1){ // doom lava cracked
      vec2 c = cellular(P * 1.6 + t * 0.05);
      float crack = smoothstep(0.0, 0.08, c.y - c.x);
      float heat = fbm(P * 2.0 + t * 0.3);
      vec3 hot = mix(uPalette[1], uPalette[0], smoothstep(0.3, 0.9, heat));
      col = mix(hot * 1.4, uPalette[2], crack);
      col += uPalette[0] * pow(1.0 - crack, 6.0) * 1.5;
    }
    else if(uMode == 2){ // mystery fog
      float fog = fbm(P * 1.2 + vec3(0.0, t*0.2, t*0.1));
      float swirl = fbm(P * 2.5 - t*0.1);
      vec3 base = mix(uPalette[2], uPalette[0], fog);
      col = mix(base, uPalette[1], smoothstep(0.5, 0.85, swirl));
    }
    else if(uMode == 3){ // fantasy emerald aurora
      float bands = sin(P.y*3.0 + fbm(P*1.5 + t*0.4)*3.0 + t*0.6);
      vec3 base = mix(uPalette[2], uPalette[0], 0.5 + 0.5*bands);
      col = base + uPalette[1] * pow(0.5+0.5*bands, 4.0) * 0.6;
    }
    else if(uMode == 4){ // scifi chrome pulse
      float rings = sin(length(P) * 8.0 - t * 2.0);
      float chrome = pow(0.5 + 0.5*dot(normalize(vNormal), vec3(0.0,0.0,1.0)), 2.0);
      vec3 base = mix(uPalette[2], uPalette[0], chrome);
      col = base + uPalette[1] * smoothstep(0.6, 1.0, rings) * 0.7;
    }
    else if(uMode == 5){ // cyberpunk neon grid
      vec3 g = abs(fract(P*4.0)-0.5);
      float grid = smoothstep(0.45, 0.5, max(g.x, max(g.y, g.z)));
      float pulse = 0.5 + 0.5*sin(t*3.0 + P.y*4.0);
      vec3 neon = mix(uPalette[0], uPalette[1], pulse);
      col = mix(uPalette[2], neon, grid);
      col += neon * pow(pulse, 4.0) * 0.4;
    }
    else if(uMode == 6){ // cosmic horror — eye-like, tendrils
      float r = length(P);
      float pupil = smoothstep(0.55, 0.45, r);
      float iris = fbm(P * 4.0 + t*0.3);
      vec3 base = mix(uPalette[1], uPalette[0], iris);
      col = mix(base, uPalette[2], pupil);
      // greenish flicker
      col += uPalette[2] * pow(vnoise(P*8.0 + t*2.0), 6.0) * 0.4;
    }
    else if(uMode == 7){ // noir — monochrome rain
      float rain = step(0.97, fract(vUv.y*40.0 - t*1.5 + hash(vec3(floor(vUv.x*60.0),0.0,0.0))*5.0));
      float shade = pow(0.5 + 0.5*dot(normalize(vNormal), vec3(0.3,0.7,0.5)), 1.5);
      vec3 base = mix(uPalette[2], uPalette[0], shade);
      col = base + uPalette[1] * rain * 0.9;
    }
    else if(uMode == 8){ // retro CRT scanlines + pixel
      float scan = 0.7 + 0.3*sin(vUv.y*120.0 + t*4.0);
      vec2 px = floor(vUv * 32.0) / 32.0;
      float n = step(0.5, hash(vec3(px, 0.0)));
      vec3 base = mix(uPalette[1], uPalette[0], n);
      col = mix(uPalette[2], base, 0.7) * scan;
      col += uPalette[0] * 0.2;
    }
    else if(uMode == 9){ // post-apoc rust storm
      float dust = fbm(P*3.0 + vec3(t*0.4, 0.0, 0.0));
      float rust = fbm(P*1.5);
      vec3 base = mix(uPalette[2], uPalette[1], rust);
      col = mix(base, uPalette[0], dust);
    }
    else if(uMode == 10){ // soulslike — ash with ember
      float ash = fbm(P*2.0 + t*0.1);
      float ember = pow(vnoise(P*6.0 + t*0.5), 8.0);
      vec3 base = mix(uPalette[2], uPalette[0], ash * 0.5);
      col = base + uPalette[1] * ember * 3.0;
    }
    else if(uMode == 11){ // jrpg golden hour
      float warm = fbm(P*1.2 + t*0.15);
      vec3 base = mix(uPalette[2], uPalette[0], smoothstep(0.2, 0.9, warm));
      col = base + uPalette[1] * pow(warm, 2.0) * 0.8;
      // sparkle
      col += vec3(1.0, 0.9, 0.7) * pow(vnoise(P*15.0 + t), 22.0) * 1.5;
    }
    else if(uMode == 12){ // visual novel — soft rose petals
      float petal = sin(atan(vPos.y, vPos.x) * 8.0 + t*0.4 + fbm(P*2.0)*2.0);
      vec3 base = mix(uPalette[0], uPalette[1], 0.5 + 0.5*petal);
      col = mix(base, uPalette[2], smoothstep(0.6, 1.0, petal) * 0.4);
    }
    else if(uMode == 13){ // mecha — industrial panels
      vec3 g = abs(fract(P*3.0)-0.5);
      float panel = smoothstep(0.42, 0.48, max(g.x, max(g.y, g.z)));
      float warn = 0.5 + 0.5*sin(t*4.0 + P.x*3.0);
      vec3 base = mix(uPalette[2], uPalette[1], 1.0 - panel);
      col = mix(base, uPalette[0], panel * warn);
    }
    else if(uMode == 14){ // roguelike — torch flicker
      float flick = 0.7 + 0.3*sin(t*7.0 + hash(vec3(floor(t*4.0),0.0,0.0))*6.28);
      float ember = fbm(P*3.0 + t*0.6);
      vec3 base = mix(uPalette[2], uPalette[1], ember);
      col = base + uPalette[0] * pow(ember, 2.0) * flick;
    }
    else if(uMode == 15){ // survival — forest fog
      float fog = fbm(P*1.5 + t*0.2);
      float light = pow(0.5+0.5*dot(normalize(vNormal), vec3(0.4,0.8,0.2)), 1.5);
      vec3 base = mix(uPalette[2], uPalette[0], fog);
      col = base + uPalette[1] * light * 0.5;
    }
    // ---------- New genre-specific modes ----------
    else if(uMode == 16){ // endless-runner — fast forward streaks
      float streakSpeed = 5.0;
      float streak = sin(P.x * 2.5 + t * streakSpeed) * 0.5 + 0.5;
      streak = pow(streak, 6.0);
      float band = smoothstep(0.9, 0.2, abs(P.y) * 1.2);
      streak *= band;
      vec3 base = mix(uPalette[2], uPalette[0], 0.3 + 0.5 * band);
      col = base + uPalette[1] * streak * 1.6;
      // motion lines crossing
      col += uPalette[0] * pow(sin(P.x * 8.0 + t * 8.0) * 0.5 + 0.5, 12.0) * 0.5;
    }
    else if(uMode == 17){ // puzzle — clean geometric tile grid
      vec2 g2 = vUv * 6.0;
      vec2 cell = floor(g2);
      vec2 cf = fract(g2);
      float n = hash(vec3(cell, 0.0));
      float border = step(0.92, max(cf.x, cf.y)) + step(cf.x, 0.08) + step(cf.y, 0.08);
      float hi = step(0.5, n + 0.2 * sin(t + n * 6.28));
      vec3 tile = mix(uPalette[2], uPalette[0], hi);
      col = mix(tile, uPalette[1], min(border, 1.0) * 0.55);
    }
    else if(uMode == 18){ // platformer — bouncing primary dots on a layered field
      vec2 g3 = vUv * 5.0;
      vec2 cell = floor(g3);
      vec2 cf = fract(g3);
      float n = hash(vec3(cell, 0.0));
      float bounce = abs(sin(t * 2.5 + n * 6.28));
      vec2 ballPos = vec2(0.5, 0.25 + bounce * 0.5);
      float ball = smoothstep(0.18, 0.06, length(cf - ballPos));
      vec3 ballC = mix(uPalette[0], uPalette[1], n);
      col = mix(uPalette[2] * 0.6, ballC, ball);
      // ground stripe
      col = mix(col, uPalette[2] * 1.4, smoothstep(0.18, 0.0, vUv.y));
    }
    else if(uMode == 19){ // sports — stadium gradient + crowd
      float sky = smoothstep(0.0, 1.0, vUv.y);
      vec3 base = mix(uPalette[2] * 0.6, uPalette[1] * 1.1, sky);
      float crowd = pow(vnoise(vec3(vUv * 28.0, t * 0.3)), 0.4);
      col = mix(base, uPalette[0], crowd * 0.45);
      // turf glow at the bottom
      col += uPalette[0] * smoothstep(0.25, 0.0, vUv.y) * 0.5;
    }
    else if(uMode == 20){ // strategy — top-down grid map with regions
      vec2 g4 = vUv * 6.0;
      vec2 cell = floor(g4);
      vec2 cf = fract(g4);
      vec2 region = floor(cell / 2.0);
      float regNoise = hash(vec3(region, 0.0));
      float lines = step(0.93, max(cf.x, cf.y)) + step(cf.x, 0.07) + step(cf.y, 0.07);
      vec3 land = mix(uPalette[0], uPalette[1], regNoise);
      // unit dots at region centers, pulsing
      vec2 unitPos = vec2(0.5);
      float unit = smoothstep(0.16, 0.06, length(cf - unitPos)) * (0.5 + 0.5 * sin(t * 2.0 + regNoise * 6.28));
      col = mix(land, uPalette[2], min(lines, 1.0) * 0.6);
      col += uPalette[2] * unit * 0.8;
    }
    else if(uMode == 21){ // adventure — open landscape: sky + horizon + terrain
      float terrainHeight = 0.42 + sin(vUv.x * 6.0 + t * 0.15) * 0.05 + sin(vUv.x * 12.0 - t * 0.3) * 0.02;
      float horizon = smoothstep(terrainHeight - 0.02, terrainHeight + 0.02, vUv.y);
      // sky gradient
      vec3 sky = mix(uPalette[1], uPalette[0], smoothstep(terrainHeight, 1.0, vUv.y));
      // terrain with fbm texture
      float groundN = fbm(vec3(vUv * 8.0, t * 0.1));
      vec3 terrain = mix(uPalette[2], uPalette[2] * 1.4 + uPalette[0] * 0.2, groundN);
      col = mix(terrain, sky, horizon);
      // sun/atmospheric glow
      vec2 sun = vec2(0.7, 0.78);
      float sunGlow = smoothstep(0.18, 0.0, length(vUv - sun));
      col += uPalette[0] * sunGlow * 0.7;
    }
    else if(uMode == 22){ // stealth — shadow gradient with light pools
      float shadow = pow(1.0 - smoothstep(0.0, 1.5, length(P.xy + vec2(sin(t * 0.3), cos(t * 0.4)) * 0.5)), 2.0);
      vec3 base = mix(uPalette[2], uPalette[0], shadow);
      // wandering light pool
      vec2 lightPos = vec2(sin(t * 0.5) * 0.4, cos(t * 0.4) * 0.4);
      float pool = smoothstep(0.4, 0.0, length(P.xy - lightPos));
      col = base + uPalette[1] * pool * 0.7;
    }
    else if(uMode == 23){ // fighting — clash/impact pulses + arena
      float pulse = pow(0.5 + 0.5 * sin(t * 4.0), 4.0);
      float r2 = length(P.xy);
      float ringEnergy = smoothstep(0.6, 0.55, abs(r2 - 0.6 + sin(t * 1.5) * 0.1));
      vec3 base = mix(uPalette[2], uPalette[0], smoothstep(1.0, 0.0, r2));
      col = base + uPalette[1] * ringEnergy * pulse * 1.5;
      // impact flash at center
      col += uPalette[0] * pow(smoothstep(0.3, 0.0, r2), 4.0) * pulse;
    }

    return col;
  }

  void main(){
    vec3 col = modeColor();

    // fresnel rim glow — stronger when hovered or selected
    float fres = pow(1.0 - max(0.0, dot(normalize(vNormal), vec3(0.0,0.0,1.0))), 2.5);
    vec3 rim = mix(uPalette[0], uPalette[1], 0.5);
    col += rim * fres * (0.6 + uHover * 1.2 + uSelected * 1.5);

    // hover pulse
    col *= 1.0 + uHover * 0.3 * (0.5 + 0.5*sin(uTime*4.0));
    col *= 1.0 + uSelected * 0.4;

    // Completion supernova — radial pulse, accelerating spin glow, white core bleed
    if (uCompletion > 0.0) {
      float c = uCompletion;
      float ring = sin(length(vPos) * 6.0 - uTime * 12.0);
      float fastPulse = 0.5 + 0.5 * sin(uTime * 14.0);
      vec3 core = mix(uPalette[0], vec3(1.0, 0.95, 0.85), c);
      col = mix(col, core, c * 0.45);
      col += vec3(1.0, 0.96, 0.88) * fres * c * 4.0; // blazing rim
      col += core * smoothstep(0.6, 1.0, ring) * c * 1.2;
      col *= 1.0 + c * fastPulse * 0.6;
    }

    // gentle gamma
    col = pow(col, vec3(0.85));
    gl_FragColor = vec4(col, 1.0);
  }
`;
