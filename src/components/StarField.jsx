import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function StarField({ count = 1500, radius = 60 }) {
  const ref = useRef();

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Spread across a thick spherical shell so depth feels real
      const r = radius * (0.4 + Math.random() * 0.6);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      // Subtly tinted whites
      const tint = 0.7 + Math.random() * 0.3;
      const warm = Math.random();
      colors[i * 3] = tint * (warm > 0.7 ? 1.0 : 0.8 + Math.random() * 0.2);
      colors[i * 3 + 1] = tint * (0.85 + Math.random() * 0.15);
      colors[i * 3 + 2] = tint * (0.95 + Math.random() * 0.05);
      sizes[i] = 0.5 + Math.random() * 1.8;
    }
    return { positions, colors, sizes };
  }, [count, radius]);

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.005;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}
