import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { similarity } from '../data/vibes.js';

// Build edges between active spheres whose tag-similarity exceeds a threshold.
// Skips the focused slot — it sits at origin and lines into it would clutter.
export default function Connections({ slots, positions, dissolve, excludeIdx }) {
  const ref = useRef();
  const matRef = useRef();
  const opacity = useRef(0);

  const { geometry } = useMemo(() => {
    const verts = [];
    const colors = [];
    for (let i = 0; i < slots.length; i++) {
      if (!slots[i].active) continue;
      if (i === excludeIdx) continue;
      for (let j = i + 1; j < slots.length; j++) {
        if (!slots[j].active) continue;
        if (j === excludeIdx) continue;
        const s = similarity(slots[i].vibe, slots[j].vibe);
        if (s >= 2) {
          const a = positions[i];
          const b = positions[j];
          verts.push(a[0], a[1], a[2], b[0], b[1], b[2]);
          const cA = slots[i].vibe.palette[0];
          const cB = slots[j].vibe.palette[0];
          colors.push(cA[0] * 0.6, cA[1] * 0.6, cA[2] * 0.6);
          colors.push(cB[0] * 0.6, cB[1] * 0.6, cB[2] * 0.6);
        }
      }
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return { geometry: geom };
  }, [slots, positions, excludeIdx]);

  useFrame((state, delta) => {
    if (!matRef.current) return;
    opacity.current = THREE.MathUtils.lerp(
      opacity.current,
      dissolve ? 0 : 0.32,
      1 - Math.pow(0.005, delta)
    );
    matRef.current.opacity =
      opacity.current * (0.6 + 0.4 * Math.sin(state.clock.elapsedTime * 0.5));
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial
        ref={matRef}
        vertexColors
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}
