import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 600;
const BURST_DELAY = 1.95; // exact moment the sphere peaks and starts collapsing

// Three shockwave rings emit at staggered times — gives the burst a layered,
// percussive feel rather than a single instant.
const SHOCKWAVES = [
  { delay: 0.0, life: 1.5, maxR: 11 },
  { delay: 0.18, life: 1.7, maxR: 14 },
  { delay: 0.42, life: 1.9, maxR: 9 },
];

// In-scene burst — bright, fast, with a slow ember tail + shockwave rings.
export default function Completion({ active, focusedColor }) {
  const elapsedRef = useRef(0);
  const particlesRef = useRef();
  const ring0 = useRef();
  const ring1 = useRef();
  const ring2 = useRef();
  const rings = [ring0, ring1, ring2];

  useEffect(() => {
    elapsedRef.current = 0;
  }, [active]);

  const { velocities, lifespans, baseColors, twinkles } = useMemo(() => {
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const lifespans = new Float32Array(PARTICLE_COUNT);
    const baseColors = new Float32Array(PARTICLE_COUNT * 3);
    const twinkles = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      // Bimodal speeds — one set blasts out fast, another lingers as embers
      const fast = Math.random() < 0.55;
      const speed = fast ? 5 + Math.random() * 8 : 2 + Math.random() * 3.5;
      const sx = Math.sin(phi) * Math.cos(theta);
      const sy = Math.sin(phi) * Math.sin(theta);
      const sz = Math.cos(phi);
      velocities[i * 3] = sx * speed;
      velocities[i * 3 + 1] = sy * speed;
      velocities[i * 3 + 2] = sz * speed;
      lifespans[i] = fast ? 1.2 + Math.random() * 1.0 : 2.0 + Math.random() * 2.2;
      const mix = Math.random() * 0.7 + 0.3; // bias toward white for brightness
      baseColors[i * 3] = focusedColor[0] * (1 - mix) + mix;
      baseColors[i * 3 + 1] = focusedColor[1] * (1 - mix) + mix;
      baseColors[i * 3 + 2] = focusedColor[2] * (1 - mix) + mix;
      twinkles[i] = Math.random() * Math.PI * 2;
    }
    return { velocities, lifespans, baseColors, twinkles };
  }, [focusedColor]);

  const livePositions = useMemo(
    () => new Float32Array(PARTICLE_COUNT * 3),
    []
  );
  const liveColors = useMemo(() => new Float32Array(baseColors), [baseColors]);

  useFrame((_, delta) => {
    if (!active) return;
    elapsedRef.current += delta;
    const t = elapsedRef.current;

    if (!particlesRef.current) return;
    const sinceBurst = t - BURST_DELAY;
    const geom = particlesRef.current.geometry;
    const posArr = geom.attributes.position.array;
    const colArr = geom.attributes.color.array;

    if (sinceBurst <= 0) {
      // Pre-burst: parked at origin, invisible. Reset arrays.
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        posArr[i * 3] = 0;
        posArr[i * 3 + 1] = 0;
        posArr[i * 3 + 2] = -100;
        colArr[i * 3] = 0;
        colArr[i * 3 + 1] = 0;
        colArr[i * 3 + 2] = 0;
      }
    } else {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const lifeT = sinceBurst / lifespans[i];
        if (lifeT > 1) {
          posArr[i * 3] = 0;
          posArr[i * 3 + 1] = 0;
          posArr[i * 3 + 2] = -100;
          continue;
        }
        const ease = 1 - Math.pow(1 - lifeT, 2);
        posArr[i * 3] = velocities[i * 3] * ease;
        posArr[i * 3 + 1] = velocities[i * 3 + 1] * ease;
        posArr[i * 3 + 2] = velocities[i * 3 + 2] * ease;
        // Twinkling fade — bright early, embers later
        const twinkle = 0.7 + 0.3 * Math.sin(t * 12 + twinkles[i]);
        const fade = (1 - lifeT) * twinkle;
        colArr[i * 3] = baseColors[i * 3] * fade;
        colArr[i * 3 + 1] = baseColors[i * 3 + 1] * fade;
        colArr[i * 3 + 2] = baseColors[i * 3 + 2] * fade;
      }
    }
    geom.attributes.position.needsUpdate = true;
    geom.attributes.color.needsUpdate = true;

    // Shockwave rings — expand outward with cubic ease, fade as they grow.
    rings.forEach((ref, i) => {
      if (!ref.current) return;
      const cfg = SHOCKWAVES[i];
      const ringT = sinceBurst - cfg.delay;
      if (ringT <= 0 || ringT > cfg.life) {
        ref.current.scale.setScalar(0.0001);
        if (ref.current.material) ref.current.material.opacity = 0;
        return;
      }
      const lifeT = ringT / cfg.life;
      const ease = 1 - Math.pow(1 - lifeT, 3);
      ref.current.scale.setScalar(cfg.maxR * ease);
      ref.current.rotation.y += delta * 0.6;
      ref.current.rotation.x += delta * 0.3;
      if (ref.current.material) {
        ref.current.material.opacity = (1 - lifeT) * (1 - lifeT) * 0.85;
      }
    });
  });

  if (!active) return null;

  const ringColor = new THREE.Color(
    focusedColor[0] * 0.5 + 0.5,
    focusedColor[1] * 0.5 + 0.5,
    focusedColor[2] * 0.5 + 0.5
  );

  return (
    <group>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[livePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[liveColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          sizeAttenuation
          vertexColors
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {SHOCKWAVES.map((_, i) => (
        <mesh key={i} ref={rings[i]} scale={0.0001}>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial
            wireframe
            transparent
            opacity={0}
            color={ringColor}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
