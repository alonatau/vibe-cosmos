import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Timing — synced with VibeSphere's completion phases.
const BOX_APPEAR_AT  = 0.25;
const MAGIC_BURST_AT = 2.2;

const PARTICLE_COUNT = 480;
const CUBE_SIZE = 2.0;
const CUBE_CENTER_Y = -2.4;

// Purple sparkle palette — used for all the magic.
const PURPLE = {
  deep:    [0.55, 0.18, 0.92],   // deep violet
  rich:    [0.7, 0.3, 1.0],      // pure purple
  light:   [0.85, 0.55, 1.0],    // lavender
  bright:  [0.92, 0.7, 1.0],     // pale violet highlight
  magenta: [0.95, 0.35, 0.85],   // hint of magenta
};
const SPARKLE_WHITE = [1.0, 0.96, 1.0];

// ---- Procedural face texture (subtle dot pattern, like the reference) ----
let _faceTex = null;
function getFaceTexture() {
  if (_faceTex) return _faceTex;
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 256, 256);
  for (let i = 0; i < 700; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const a = 0.12 + Math.random() * 0.5;
    ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
    ctx.fillRect(x, y, 1, 1);
  }
  _faceTex = new THREE.CanvasTexture(c);
  _faceTex.wrapS = _faceTex.wrapT = THREE.RepeatWrapping;
  return _faceTex;
}

// ---- Star/sparkle sprite (radial bright + 4-point cross flare) ----
let _starTex = null;
function getStarTexture() {
  if (_starTex) return _starTex;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  // soft round glow
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255, 255, 255, 1)');
  g.addColorStop(0.25, 'rgba(255, 255, 255, 0.45)');
  g.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  // cross flare
  ctx.globalCompositeOperation = 'lighter';
  const cross = ctx.createLinearGradient(0, 64, 128, 64);
  cross.addColorStop(0, 'rgba(255,255,255,0)');
  cross.addColorStop(0.5, 'rgba(255,255,255,0.95)');
  cross.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = cross;
  ctx.fillRect(0, 62, 128, 4);
  const cross2 = ctx.createLinearGradient(64, 0, 64, 128);
  cross2.addColorStop(0, 'rgba(255,255,255,0)');
  cross2.addColorStop(0.5, 'rgba(255,255,255,0.95)');
  cross2.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = cross2;
  ctx.fillRect(62, 0, 4, 128);
  _starTex = new THREE.CanvasTexture(c);
  return _starTex;
}

// ---- Generate per-particle parameters for the upward magic spiral ----
function makeParticles() {
  const angles = new Float32Array(PARTICLE_COUNT);
  const radii = new Float32Array(PARTICLE_COUNT);
  const speeds = new Float32Array(PARTICLE_COUNT);
  const lifespans = new Float32Array(PARTICLE_COUNT);
  const phases = new Float32Array(PARTICLE_COUNT);
  const colors = new Float32Array(PARTICLE_COUNT * 3);

  const palette = [PURPLE.deep, PURPLE.rich, PURPLE.light, PURPLE.bright, PURPLE.magenta];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    angles[i] = Math.random() * Math.PI * 2;
    radii[i] = 0.08 + Math.random() * 1.4;
    speeds[i] = 1.4 + Math.random() * 3.6;
    lifespans[i] = 1.6 + Math.random() * 2.2;
    phases[i] = Math.random() * Math.PI * 2;
    // 60% pure-ish purple, 40% bright sparkle white-highlights
    let c;
    if (Math.random() < 0.4) {
      c = SPARKLE_WHITE;
    } else {
      c = palette[Math.floor(Math.random() * palette.length)];
    }
    colors[i * 3] = c[0];
    colors[i * 3 + 1] = c[1];
    colors[i * 3 + 2] = c[2];
  }
  return { angles, radii, speeds, lifespans, phases, colors };
}

// ============================================================
// Wireframe glass cube — minimalist, isometric-tilted, glowing
// edges, subtle dotted face texture, sparkle stars at corners
// ============================================================
// Drifting purple sparkles confined to the cube's interior. Lives inside
// the cube group so they rotate with it, anchored to the box.
const INSIDE_COUNT = 110;
function InsideSparkle({ elapsedRef }) {
  const ref = useRef();
  const params = useMemo(() => {
    const positions = new Float32Array(INSIDE_COUNT * 3);
    const colors = new Float32Array(INSIDE_COUNT * 3);
    const phases = new Float32Array(INSIDE_COUNT);
    const rates = new Float32Array(INSIDE_COUNT);
    const palette = [
      [0.7, 0.3, 1.0],   // pure purple
      [0.55, 0.18, 0.92],// deep violet
      [0.85, 0.55, 1.0], // lavender
      [0.92, 0.7, 1.0],  // pale violet
      [0.95, 0.35, 0.85],// magenta hint
      [1.0, 0.96, 1.0],  // sparkle white
    ];
    const r = CUBE_SIZE * 0.45;
    for (let i = 0; i < INSIDE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 2 * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2 * r;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2 * r;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3]     = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
      phases[i] = Math.random() * Math.PI * 2;
      rates[i] = 4 + Math.random() * 8;
    }
    return { positions, colors, phases, rates };
  }, []);

  const liveCol = useMemo(() => new Float32Array(params.colors), [params.colors]);

  useFrame(() => {
    if (!ref.current) return;
    const t = elapsedRef.current;
    const colArr = ref.current.geometry.attributes.color.array;
    // Each particle twinkles at its own rate; output color = base × twinkle
    for (let i = 0; i < INSIDE_COUNT; i++) {
      const tw = 0.35 + 0.65 * Math.sin(t * params.rates[i] + params.phases[i]);
      const fade = Math.max(0, tw);
      colArr[i * 3]     = params.colors[i * 3]     * fade;
      colArr[i * 3 + 1] = params.colors[i * 3 + 1] * fade;
      colArr[i * 3 + 2] = params.colors[i * 3 + 2] * fade;
    }
    ref.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[params.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[liveCol, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={getStarTexture()}
        size={0.13}
        sizeAttenuation
        vertexColors
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function MagicBox({ elapsedRef }) {
  const groupRef = useRef();
  const cubeFaceRef = useRef();
  const edgesRef = useRef();
  const sparklesRef = useRef();

  // Cube edges geometry (thin glowing lines along all 12 edges)
  const edgesGeom = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE)),
    []
  );

  // 8 cube corners as sparkle sprites
  const cornerPositions = useMemo(() => {
    const s = CUBE_SIZE / 2;
    const pts = new Float32Array(8 * 3);
    let i = 0;
    for (const x of [-s, s]) {
      for (const y of [-s, s]) {
        for (const z of [-s, s]) {
          pts[i++] = x;
          pts[i++] = y;
          pts[i++] = z;
        }
      }
    }
    return pts;
  }, []);

  useFrame(() => {
    const t = elapsedRef.current;
    if (!groupRef.current) return;

    // Rise into view + grow
    let scale = 0;
    if (t > BOX_APPEAR_AT) {
      const u = Math.min(1, (t - BOX_APPEAR_AT) / 0.6);
      scale = u * u * (3 - 2 * u);
    }
    groupRef.current.scale.setScalar(scale);
    // Float gently
    groupRef.current.position.y = CUBE_CENTER_Y + Math.sin(t * 1.3) * 0.04;
    // Slow rotation around Y for a living feel
    groupRef.current.rotation.y = 0.4 + t * 0.18;

    const sinceBurst = Math.max(0, t - MAGIC_BURST_AT);

    // Edges glow stronger after burst
    if (edgesRef.current?.material) {
      const baseOp = 0.92;
      const burstPulse = sinceBurst > 0
        ? 1 + Math.sin(t * 18) * 0.25 * Math.exp(-sinceBurst * 0.6)
        : 1;
      edgesRef.current.material.opacity = baseOp * burstPulse;
    }

    // Face texture mild pulse
    if (cubeFaceRef.current?.material) {
      const burst = sinceBurst > 0 ? 1 + Math.exp(-sinceBurst * 0.8) * 0.6 : 1;
      cubeFaceRef.current.material.opacity = 0.06 * burst;
    }

    // Corner sparkles pulse (scale up briefly at burst)
    if (sparklesRef.current?.material) {
      const baseSize = 0.22;
      const burstScale = sinceBurst > 0
        ? 1 + Math.exp(-sinceBurst * 0.5) * 1.2
        : 1 + Math.sin(t * 3) * 0.08;
      sparklesRef.current.material.size = baseSize * burstScale;
    }

  });

  return (
    <group ref={groupRef} position={[0, CUBE_CENTER_Y, 0]} rotation={[-0.18, 0.4, 0]} scale={0.001}>
      {/* Subtle dotted face overlay (renders very faint) */}
      <mesh ref={cubeFaceRef}>
        <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
        <meshBasicMaterial
          map={getFaceTexture()}
          color="#ffffff"
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>
      {/* Glowing edges */}
      <lineSegments ref={edgesRef} geometry={edgesGeom}>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.92}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      {/* Corner sparkles */}
      <points ref={sparklesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[cornerPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={getStarTexture()}
          size={0.22}
          sizeAttenuation
          transparent
          opacity={1}
          color="#ffffff"
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      {/* Drifting purple sparkles inside the cube */}
      <InsideSparkle elapsedRef={elapsedRef} />
    </group>
  );
}

// ============================================================
// Purple sparkle particles — spiral upward from inside the cube
// ============================================================
function MagicParticles({ elapsedRef }) {
  const ref = useRef();
  const params = useMemo(() => makeParticles(), []);
  const livePos = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const liveCol = useMemo(() => new Float32Array(params.colors), [params.colors]);

  useFrame(() => {
    if (!ref.current) return;
    const t = elapsedRef.current;
    const sinceBurst = t - MAGIC_BURST_AT;
    const geom = ref.current.geometry;
    const posArr = geom.attributes.position.array;
    const colArr = geom.attributes.color.array;

    if (sinceBurst <= 0) {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        posArr[i * 3] = 0;
        posArr[i * 3 + 1] = -100;
        posArr[i * 3 + 2] = 0;
        colArr[i * 3] = 0;
        colArr[i * 3 + 1] = 0;
        colArr[i * 3 + 2] = 0;
      }
    } else {
      const baseY = CUBE_CENTER_Y;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const lifeT = sinceBurst / params.lifespans[i];
        if (lifeT > 1) {
          posArr[i * 3 + 1] = -100;
          continue;
        }
        const ease = 1 - Math.pow(1 - lifeT, 1.8);
        const y = baseY + params.speeds[i] * sinceBurst;
        const angle = params.angles[i] + sinceBurst * 1.6;
        const r = params.radii[i] * (0.3 + ease * 1.1);
        posArr[i * 3] = Math.cos(angle) * r;
        posArr[i * 3 + 1] = y;
        posArr[i * 3 + 2] = Math.sin(angle) * r;
        const twinkle = 0.55 + 0.45 * Math.sin(t * 16 + params.phases[i]);
        const fade = (1 - lifeT) * twinkle;
        colArr[i * 3] = params.colors[i * 3] * fade;
        colArr[i * 3 + 1] = params.colors[i * 3 + 1] * fade;
        colArr[i * 3 + 2] = params.colors[i * 3 + 2] * fade;
      }
    }
    geom.attributes.position.needsUpdate = true;
    geom.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[livePos, 3]} />
        <bufferAttribute attach="attributes-color" args={[liveCol, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={getStarTexture()}
        size={0.16}
        sizeAttenuation
        vertexColors
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function Completion({ active }) {
  const elapsedRef = useRef(0);
  useEffect(() => {
    elapsedRef.current = 0;
  }, [active]);
  useFrame((_, delta) => {
    if (!active) return;
    elapsedRef.current += delta;
  });

  if (!active) return null;
  return (
    <group>
      <MagicBox elapsedRef={elapsedRef} />
      <MagicParticles elapsedRef={elapsedRef} />
    </group>
  );
}
