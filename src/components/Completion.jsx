import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Timing — synchronised with VibeSphere's completion phases.
const BOX_APPEAR_AT  = 0.25;  // box rises into view
const ORB_ENTERS_AT  = 1.8;   // orb begins final swallow
const MAGIC_BURST_AT = 2.2;   // orb gone — box releases magic

const PARTICLE_COUNT = 420;

// Generate stable per-particle parameters once.
function makeParticles(focusedColor) {
  const angles = new Float32Array(PARTICLE_COUNT);
  const radii = new Float32Array(PARTICLE_COUNT);
  const speeds = new Float32Array(PARTICLE_COUNT);
  const lifespans = new Float32Array(PARTICLE_COUNT);
  const phases = new Float32Array(PARTICLE_COUNT);
  const colors = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    angles[i] = Math.random() * Math.PI * 2;
    radii[i] = 0.15 + Math.random() * 1.4;
    speeds[i] = 1.2 + Math.random() * 3.2;
    lifespans[i] = 1.6 + Math.random() * 2.0;
    phases[i] = Math.random() * Math.PI * 2;
    const mode = Math.random();
    let r, g, b;
    if (mode < 0.45) {
      r = 1.0;
      g = 0.95 - Math.random() * 0.2;
      b = 0.78 - Math.random() * 0.3;
    } else if (mode < 0.8) {
      const m = 0.4 + Math.random() * 0.5;
      r = focusedColor[0] * m + (1 - m) * 1.0;
      g = focusedColor[1] * m + (1 - m) * 0.9;
      b = focusedColor[2] * m + (1 - m) * 1.0;
    } else {
      r = focusedColor[0];
      g = focusedColor[1];
      b = focusedColor[2];
    }
    colors[i * 3] = r;
    colors[i * 3 + 1] = g;
    colors[i * 3 + 2] = b;
  }
  return { angles, radii, speeds, lifespans, phases, colors };
}

// Magic box / dais — hexagonal glowing pedestal that the orb descends into.
// After the orb enters, it pulses and a column of light shoots up while
// magic particles spiral upward.
function MagicBox({ elapsedRef, focusedColor }) {
  const groupRef = useRef();
  const baseRef = useRef();
  const ringRef = useRef();
  const ring2Ref = useRef();
  const pillarRef = useRef();
  const innerGlowRef = useRef();

  const tint = useMemo(
    () => new THREE.Color(focusedColor[0], focusedColor[1], focusedColor[2]),
    [focusedColor]
  );
  const lightTint = useMemo(
    () =>
      new THREE.Color(
        Math.min(1, focusedColor[0] * 0.5 + 0.5),
        Math.min(1, focusedColor[1] * 0.5 + 0.55),
        Math.min(1, focusedColor[2] * 0.5 + 0.6)
      ),
    [focusedColor]
  );

  useFrame(() => {
    const t = elapsedRef.current;
    if (!groupRef.current) return;

    let scale = 0;
    if (t > BOX_APPEAR_AT) {
      const u = Math.min(1, (t - BOX_APPEAR_AT) / 0.5);
      scale = u * u * (3 - 2 * u);
    }
    groupRef.current.scale.setScalar(scale);
    groupRef.current.position.y = -2.6 + Math.sin(t * 1.5) * 0.05;

    if (ringRef.current) ringRef.current.rotation.z = t * 0.4;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.25;

    const sinceBurst = Math.max(0, t - MAGIC_BURST_AT);
    const pulse = sinceBurst > 0
      ? 1 + Math.sin(t * 16) * 0.15 * Math.exp(-sinceBurst * 0.6)
      : 1 + Math.sin(t * 4) * 0.04;

    if (baseRef.current?.material) {
      baseRef.current.material.opacity = 0.85 * (sinceBurst > 0 ? pulse : 1);
    }
    if (innerGlowRef.current?.material) {
      const g = sinceBurst > 0 ? 1.0 : 0.5;
      innerGlowRef.current.material.opacity = g * pulse;
    }

    if (pillarRef.current) {
      if (sinceBurst <= 0) {
        pillarRef.current.scale.set(0.001, 0.001, 0.001);
      } else {
        const u = Math.min(1, sinceBurst / 0.6);
        const eased = 1 - Math.pow(1 - u, 3);
        pillarRef.current.scale.set(1, 1 + eased * 8, 1);
        if (pillarRef.current.material) {
          pillarRef.current.material.opacity = 0.6 * Math.exp(-sinceBurst * 0.5);
        }
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -2.6, 0]} scale={0.001}>
      <mesh ref={baseRef}>
        <cylinderGeometry args={[1.4, 1.55, 0.35, 6]} />
        <meshBasicMaterial color={tint} transparent opacity={0.85} />
      </mesh>
      <mesh
        ref={innerGlowRef}
        position={[0, 0.18, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial color={lightTint} transparent opacity={0.5} />
      </mesh>
      <mesh
        ref={ringRef}
        position={[0, 0.19, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[1.25, 1.45, 6, 1]} />
        <meshBasicMaterial
          color={lightTint}
          transparent
          opacity={0.75}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh
        ref={ring2Ref}
        position={[0, 0.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.85, 0.95, 12, 1]} />
        <meshBasicMaterial
          color={lightTint}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.CylinderGeometry(1.4, 1.55, 0.35, 6)]} />
        <lineBasicMaterial color={lightTint} transparent opacity={0.95} />
      </lineSegments>
      <mesh ref={pillarRef} position={[0, 0.5, 0]} scale={0.001}>
        <cylinderGeometry args={[0.55, 0.85, 1, 24, 1, true]} />
        <meshBasicMaterial
          color={lightTint}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// Particle field that emits UPWARD from the box with a swirling spiral.
function MagicParticles({ elapsedRef, focusedColor }) {
  const ref = useRef();
  const params = useMemo(() => makeParticles(focusedColor), [focusedColor]);
  const livePos = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const liveCol = useMemo(
    () => new Float32Array(params.colors),
    [params.colors]
  );

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
        posArr[i * 3 + 1] = -2.5;
        posArr[i * 3 + 2] = 0;
        colArr[i * 3] = 0;
        colArr[i * 3 + 1] = 0;
        colArr[i * 3 + 2] = 0;
      }
    } else {
      const baseY = -2.4;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const lifeT = sinceBurst / params.lifespans[i];
        if (lifeT > 1) {
          posArr[i * 3 + 1] = -100;
          continue;
        }
        const ease = 1 - Math.pow(1 - lifeT, 1.8);
        const y = baseY + params.speeds[i] * sinceBurst;
        const angle = params.angles[i] + sinceBurst * 1.6;
        const r = params.radii[i] * (0.4 + ease * 1.1);
        posArr[i * 3] = Math.cos(angle) * r;
        posArr[i * 3 + 1] = y;
        posArr[i * 3 + 2] = Math.sin(angle) * r;
        const twinkle = 0.6 + 0.4 * Math.sin(t * 14 + params.phases[i]);
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

const RING_DELAYS = [0.0, 0.22, 0.5];

function MagicRings({ elapsedRef, focusedColor }) {
  const ring0 = useRef();
  const ring1 = useRef();
  const ring2 = useRef();
  const refs = [ring0, ring1, ring2];
  const tint = useMemo(
    () =>
      new THREE.Color(
        Math.min(1, focusedColor[0] * 0.5 + 0.5),
        Math.min(1, focusedColor[1] * 0.5 + 0.55),
        Math.min(1, focusedColor[2] * 0.5 + 0.6)
      ),
    [focusedColor]
  );

  useFrame(() => {
    const t = elapsedRef.current;
    const sinceBurst = t - MAGIC_BURST_AT;
    refs.forEach((ref, i) => {
      if (!ref.current) return;
      const ringT = sinceBurst - RING_DELAYS[i];
      if (ringT < 0 || ringT > 2.0) {
        ref.current.scale.setScalar(0.001);
        if (ref.current.material) ref.current.material.opacity = 0;
        return;
      }
      const lifeU = ringT / 2.0;
      const ease = 1 - Math.pow(1 - lifeU, 2.4);
      const r = 0.5 + ease * 4;
      ref.current.scale.set(r, r, 1);
      ref.current.position.y = -2.4 + ringT * 1.6;
      if (ref.current.material) {
        ref.current.material.opacity = (1 - lifeU) * 0.7;
      }
    });
  });

  return (
    <>
      {RING_DELAYS.map((_, i) => (
        <mesh
          key={i}
          ref={refs[i]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={0.001}
        >
          <ringGeometry args={[0.95, 1, 32]} />
          <meshBasicMaterial
            color={tint}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}

export default function Completion({ active, focusedColor }) {
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
      <MagicBox elapsedRef={elapsedRef} focusedColor={focusedColor} />
      <MagicParticles elapsedRef={elapsedRef} focusedColor={focusedColor} />
      <MagicRings elapsedRef={elapsedRef} focusedColor={focusedColor} />
    </group>
  );
}
