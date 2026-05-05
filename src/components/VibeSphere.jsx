import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from '../shaders/vibe.js';
import { paintToCanvas } from '../data/painters.js';

export default function VibeSphere({
  vibe,
  position,
  driftSeed,
  isSelected,
  isFocused,
  active = true,
  completing = false,
  onClick,
  dissolve,
  dissolveDelay = 0,
  fadeSpeed = 0.002,
}) {
  const meshRef = useRef();
  const matRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [staggeredDissolve, setStaggeredDissolve] = useState(false);
  const hoverRef = useRef(0);
  const selRef = useRef(0);
  const focusRef = useRef(0);
  const opacityRef = useRef(0); // 0 = invisible, 1 = full
  const homePos = useMemo(() => new THREE.Vector3(...position), [position]);
  const currentPos = useRef(homePos.clone());

  // Honour per-sphere dissolve delay symmetrically — spheres fade out AND back in waves
  useEffect(() => {
    if (dissolveDelay <= 0) {
      setStaggeredDissolve(dissolve);
      return;
    }
    const t = window.setTimeout(
      () => setStaggeredDissolve(dissolve),
      dissolveDelay * 1000
    );
    return () => window.clearTimeout(t);
  }, [dissolve, dissolveDelay]);

  // Texture: prefer the real reference image when present, otherwise use the
  // canvas painter as fallback. Image loading is async — we paint the canvas
  // immediately so the orb has *something* visible during the load, then swap
  // to the real image when it's ready.
  const fallbackTexture = useMemo(() => {
    const canvas = paintToCanvas(vibe.painter, vibe.palette);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  }, [vibe.painter, vibe.palette]);

  const [imageTexture, setImageTexture] = useState(null);
  useEffect(() => {
    if (!vibe.image) {
      setImageTexture(null);
      return;
    }
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.load(
      vibe.image,
      (tex) => {
        if (cancelled) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        setImageTexture(tex);
      },
      undefined,
      () => {
        // load error — silently fall back to canvas
      }
    );
    return () => {
      cancelled = true;
    };
  }, [vibe.image]);

  const texture = imageTexture || fallbackTexture;
  useEffect(() => () => fallbackTexture.dispose?.(), [fallbackTexture]);
  useEffect(() => () => imageTexture?.dispose?.(), [imageTexture]);

  const grade = vibe.grade || {
    tint: [1, 1, 1],
    saturation: 1,
    hueShift: 0,
    brightness: 1,
  };

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHover: { value: 0 },
      uSelected: { value: 0 },
      uCompletion: { value: 0 },
      uTexture: { value: texture },
      uTintRim: {
        value: new THREE.Color(
          vibe.palette[0][0] * 0.6 + 0.4,
          vibe.palette[0][1] * 0.6 + 0.4,
          vibe.palette[0][2] * 0.6 + 0.4
        ),
      },
      uTint: { value: new THREE.Color(grade.tint[0], grade.tint[1], grade.tint[2]) },
      uSaturation: { value: grade.saturation },
      uHueShift: { value: grade.hueShift },
      uBrightness: { value: grade.brightness },
    }),
    [texture, vibe.palette, grade]
  );

  // Keep texture uniform in sync if the vibe data changes (variant swap)
  useEffect(() => {
    if (matRef.current) {
      matRef.current.uniforms.uTexture.value = texture;
    }
  }, [texture]);

  const completionRef = useRef(0); // local timer in seconds since completion started
  const completionGlow = useRef(0);
  const completionScale = useRef(1);
  const completionFade = useRef(1);
  const completionDescent = useRef(0); // y-offset as the orb sinks into the box

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  useFrame((state, delta) => {
    if (!meshRef.current || !matRef.current) return;
    const t = state.clock.elapsedTime;

    // Smooth hover/selected/focus/opacity
    hoverRef.current = THREE.MathUtils.lerp(hoverRef.current, hovered ? 1 : 0, 1 - Math.pow(0.001, delta));
    selRef.current = THREE.MathUtils.lerp(selRef.current, isSelected ? 1 : 0, 1 - Math.pow(0.0005, delta));
    // Both directions slow and graceful; focus-out kept marginally slower for the elegant relax
    const focusBase = isFocused ? 0.003 : 0.018;
    focusRef.current = THREE.MathUtils.lerp(focusRef.current, isFocused ? 1 : 0, 1 - Math.pow(focusBase, delta));
    opacityRef.current = THREE.MathUtils.lerp(
      opacityRef.current,
      staggeredDissolve ? 0 : 1,
      1 - Math.pow(fadeSpeed, delta)
    );

    // Completion: orb gathers itself, descends, sinks into the magic box,
    // disappears. The box (rendered in Completion.jsx) then releases magic
    // upward. No more supernova explosion.
    if (completing && isFocused) {
      completionRef.current += delta;
      const ct = completionRef.current;
      if (ct < 0.6) {
        // Phase 1 — gentle hover at focus position, glow gathers
        completionScale.current = 1 + Math.sin(ct * 4) * 0.04;
        completionGlow.current = (ct / 0.6) * 0.55;
        completionFade.current = 1;
        completionDescent.current = 0;
      } else if (ct < 1.8) {
        // Phase 2 — pulled toward the box, accelerating descent
        const u = (ct - 0.6) / 1.2;
        const eased = u * u * (3 - 2 * u); // smoothstep
        completionScale.current = 1 - eased * 0.5;
        completionGlow.current = 0.55 + u * 0.35;
        completionFade.current = 1;
        completionDescent.current = -2.4 * eased;
      } else if (ct < 2.2) {
        // Phase 3 — final swallow into the box
        const u = (ct - 1.8) / 0.4;
        completionScale.current = 0.5 * (1 - u);
        completionGlow.current = 0.9 - u * 0.5;
        completionFade.current = Math.max(0, 1 - u);
        completionDescent.current = -2.4 - u * 0.2;
      } else {
        completionScale.current = 0;
        completionGlow.current = 0;
        completionFade.current = 0;
        completionDescent.current = -2.6;
      }
    } else {
      completionRef.current = 0;
      completionScale.current = THREE.MathUtils.lerp(completionScale.current, 1, 1 - Math.pow(0.01, delta));
      completionGlow.current = THREE.MathUtils.lerp(completionGlow.current, 0, 1 - Math.pow(0.01, delta));
      completionFade.current = THREE.MathUtils.lerp(completionFade.current, 1, 1 - Math.pow(0.01, delta));
    }

    matRef.current.uniforms.uTime.value = t;
    matRef.current.uniforms.uHover.value = hoverRef.current;
    // Treat focus like an amplified "selected" so the rim/glow stays strong
    matRef.current.uniforms.uSelected.value = Math.max(selRef.current, focusRef.current * 0.85);
    matRef.current.uniforms.uCompletion.value = completionGlow.current;

    // Drift in place — gentle bobbing on multiple axes
    const drift = new THREE.Vector3(
      Math.sin(t * 0.3 + driftSeed) * 0.15,
      Math.cos(t * 0.25 + driftSeed * 1.7) * 0.18,
      Math.sin(t * 0.2 + driftSeed * 2.3) * 0.12
    );

    // Selected and focused share the same destination — world origin (the orbit center).
    // OrbitControls targets origin too, so the focused vibe always reads as the cosmological
    // center and the cluster orbits visibly around it as the user rotates.
    let target;
    if (isSelected || isFocused) {
      // During completion, descend toward the magic box (y < 0 at world origin).
      target = new THREE.Vector3(
        drift.x * 0.3,
        drift.y * 0.3 + completionDescent.current,
        drift.z * 0.3
      );
    } else {
      target = homePos.clone().add(drift);
    }

    // Position lerp: gentle everywhere, gliding rather than snapping.
    let posBase;
    if (isSelected) posBase = 0.022;          // smooth zoom forward on click
    else if (isFocused) posBase = 0.03;       // gentle settle once focused
    else if (focusRef.current > 0.05) posBase = 0.04; // relaxing back into the cluster
    else posBase = 0.012;                     // ambient drift, slow ease toward home

    currentPos.current.lerp(target, 1 - Math.pow(posBase, delta));
    meshRef.current.position.copy(currentPos.current);

    // Scale: dissolve shrinks, hover grows slightly, selected grows more, focus ≈ 1.5x.
    // Completion overrides the focus chunk with its own animated scale + fade.
    const baseScale = 1.0 + hoverRef.current * 0.15 + selRef.current * 0.3 + focusRef.current * 0.5;
    const targetScale =
      opacityRef.current * completionFade.current * baseScale * completionScale.current;
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 1 - Math.pow(0.005, delta))
    );

    // Spin accelerates dramatically as the completion ramps up
    const spinBoost = completionGlow.current * 1.5;
    meshRef.current.rotation.y += delta * (0.05 + selRef.current * 0.4 + focusRef.current * 0.15 + spinBoost);
    meshRef.current.rotation.x += delta * (0.02 + spinBoost * 0.4);
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e) => {
        if (!active) return;
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        if (!active) return;
        e.stopPropagation();
        onClick?.();
      }}
      scale={0.001}
    >
      <sphereGeometry args={[vibe.radius, 48, 36]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={false}
      />
    </mesh>
  );
}
