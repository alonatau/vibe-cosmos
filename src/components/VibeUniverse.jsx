import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import VibeSphere from './VibeSphere.jsx';
import Connections from './Connections.jsx';
import StarField from './StarField.jsx';
import Completion from './Completion.jsx';
import CompletionOverlay from './CompletionOverlay.jsx';
import { VIBES, variantsOf, diverseSample } from '../data/vibes.js';
import { getInsight } from '../data/scoring.js';

const SLOT_COUNT = 12;

// THREE clicks to a chosen game. Initial cluster shows 12 maximally-different
// orbs; click narrows to 7 sharing style or genre with the focus; click again
// narrows to 4 with tighter overlap; final click commits to a specific game.
const COUNT_SEQUENCE = [12, 7, 4, 1];
function activeCountForDepth(depth) {
  if (depth <= 0) return COUNT_SEQUENCE[0];
  return COUNT_SEQUENCE[Math.min(depth, COUNT_SEQUENCE.length - 1)];
}

// Layout radius shrinks slightly as the cluster thins, so spacing stays comfortable
function layoutRadius(count) {
  if (count <= 1) return 0;
  return 2.4 + Math.sqrt(count) * 1.55; // 14→8.2, 8→6.8, 5→5.9, 3→5.1, 2→4.6, 1→0
}

function fibonacciPositions(count, radius, seed = 1) {
  const positions = [];
  if (count <= 0) return positions;
  if (count === 1) return [[0, 0, 0]];
  const phi = Math.PI * (3 - Math.sqrt(5));
  const rng = mulberry32(seed);
  const jitter = 0.45;
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    positions.push([
      x * radius + (rng() - 0.5) * jitter,
      y * radius * 0.85 + (rng() - 0.5) * jitter,
      z * radius + (rng() - 0.5) * jitter,
    ]);
  }
  return positions;
}

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickInitialSlots() {
  // Maximally-diverse sample so the first cluster covers as much of the
  // style × genre space as possible.
  const sampled = diverseSample(SLOT_COUNT);
  return sampled.map((v) => ({ vibe: v, active: true }));
}

export default function VibeUniverse() {
  const [slots, setSlots] = useState(pickInitialSlots);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [focusedIdx, setFocusedIdx] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [shrinking, setShrinking] = useState(false);
  const [transitionKind, setTransitionKind] = useState(null);
  const [history, setHistory] = useState([]);
  const [completing, setCompleting] = useState(false);
  const [path, setPath] = useState([]); // chosen vibe at each click — drives the insight
  const [insight, setInsight] = useState(null); // computed once at terminal
  const sessionKeyRef = useRef(0);
  const completionTimerRef = useRef(null);
  const dragRef = useRef({ startX: 0, startY: 0, dragged: false });

  // Compute per-slot homePos. Active slots map by RANK to fibonacci positions
  // so the cluster reshapes as count changes; inactive slots park off-screen.
  const positions = useMemo(() => {
    const activeIndices = slots
      .map((s, i) => (s.active ? i : -1))
      .filter((i) => i >= 0);
    const n = activeIndices.length;
    const fibPos = fibonacciPositions(n, layoutRadius(n), 7);
    const result = new Array(SLOT_COUNT);
    for (let i = 0; i < SLOT_COUNT; i++) result[i] = [0, 0, -50]; // hidden park
    activeIndices.forEach((slotIdx, rank) => {
      result[slotIdx] = fibPos[rank];
    });
    return result;
  }, [slots]);

  const driftSeeds = useMemo(
    () => Array.from({ length: SLOT_COUNT }, (_, i) => i * 1.31 + 0.7),
    []
  );

  // Stagger by rank-among-active so dissolving feels like a ripple
  const dissolveDelays = useMemo(() => {
    const activeIndices = slots
      .map((s, i) => (s.active ? i : -1))
      .filter((i) => i >= 0);
    const distances = activeIndices.map((i) => {
      const p = positions[i];
      return Math.hypot(p[0], p[1], p[2]);
    });
    const order = activeIndices
      .map((idx, k) => ({ idx, d: distances[k] }))
      .sort((a, b) => a.d - b.d);
    const delays = new Array(SLOT_COUNT).fill(0);
    order.forEach((entry, rank) => {
      delays[entry.idx] = rank * 0.035;
    });
    return delays;
  }, [slots, positions]);

  const handleSphereClick = useCallback(
    (idx) => {
      if (transitioning) return;
      const slot = slots[idx];
      if (!slot.active) return;
      // Already at terminal depth (only the focused remains) — let escape handle exit
      const activeCount = slots.reduce((n, s) => n + (s.active ? 1 : 0), 0);
      if (activeCount <= 1) return;

      setTransitioning(true);
      setTransitionKind('forward');
      setFocusedIdx(null); // any prior focus relaxes back into the cluster
      setSelectedIdx(idx);
      setShrinking(true);

      window.setTimeout(() => {
        setHistory((h) => [...h, { slots, focusedIdx, path }]);

        const newDepth = history.length + 1;
        const targetCount = activeCountForDepth(newDepth);
        const clickedVibe = slot.vibe;
        const newPath = [...path, clickedVibe];
        setPath(newPath);
        sessionKeyRef.current += 1;
        const variants = variantsOf(
          clickedVibe,
          Math.max(0, targetCount - 1),
          `s${sessionKeyRef.current}`,
          newDepth
        );

        // Pick which currently-active slots survive into the next state.
        // Sort other-actives by distance from clicked slot — closer ones stay,
        // so the cluster contracts toward the focus rather than randomly thinning.
        const clickedPos = positions[idx];
        const others = slots
          .map((s, i) => ({ s, i }))
          .filter((x) => x.s.active && x.i !== idx);
        others.sort((a, b) => {
          const pa = positions[a.i];
          const pb = positions[b.i];
          const da = Math.hypot(pa[0] - clickedPos[0], pa[1] - clickedPos[1], pa[2] - clickedPos[2]);
          const db = Math.hypot(pb[0] - clickedPos[0], pb[1] - clickedPos[1], pb[2] - clickedPos[2]);
          return da - db;
        });
        const keep = others.slice(0, Math.max(0, targetCount - 1)).map((x) => x.i);
        const keepSet = new Set(keep);

        let v = 0;
        const newSlots = slots.map((s, i) => {
          if (i === idx) return { vibe: clickedVibe, active: true };
          if (keepSet.has(i)) return { vibe: variants[v++], active: true };
          return { vibe: s.vibe, active: false };
        });

        setSlots(newSlots);
        setFocusedIdx(idx);
        setSelectedIdx(null);
        setShrinking(false);
        // Terminal click — start the supernova immediately, and compute the
        // insight from the user's full path so the overlay can reveal it.
        if (targetCount === 1) {
          setInsight(getInsight(newPath));
          setCompleting(true);
        }
        window.setTimeout(() => {
          setTransitioning(false);
          setTransitionKind(null);
        }, 1200);
      }, 1100);
    },
    [slots, transitioning, focusedIdx, history.length, positions]
  );

  const handleBack = useCallback(() => {
    if (transitioning || history.length === 0) return;
    if (completionTimerRef.current) {
      window.clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }
    setCompleting(false);
    setInsight(null);
    setTransitioning(true);
    setTransitionKind('back');
    setSelectedIdx(null);
    setFocusedIdx(null);

    window.setTimeout(() => {
      setShrinking(true);
      window.setTimeout(() => {
        const prev = history[history.length - 1];
        setSlots(prev.slots);
        setFocusedIdx(prev.focusedIdx);
        setPath(prev.path || []);
        setHistory((h) => h.slice(0, -1));
        setShrinking(false);
        window.setTimeout(() => {
          setTransitioning(false);
          setTransitionKind(null);
        }, 1200);
      }, 1100);
    }, 900);
  }, [transitioning, history]);

  const handleReset = useCallback(() => {
    if (transitioning) return;
    if (completionTimerRef.current) {
      window.clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }
    setCompleting(false);
    setInsight(null);
    setTransitioning(true);
    setTransitionKind('reset');
    setSelectedIdx(null);
    setFocusedIdx(null);

    window.setTimeout(() => {
      setShrinking(true);
      window.setTimeout(() => {
        setSlots(pickInitialSlots());
        setHistory([]);
        setPath([]);
        setShrinking(false);
        window.setTimeout(() => {
          setTransitioning(false);
          setTransitionKind(null);
        }, 1200);
      }, 1000);
    }, 600);
  }, [transitioning]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (history.length > 0) handleBack();
        else handleReset();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleBack, handleReset, history.length]);

  const activeCount = slots.reduce((n, s) => n + (s.active ? 1 : 0), 0);
  const depth = history.length;

  return (
    <div className="universe-root">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 14], fov: 55, near: 0.1, far: 200 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onPointerDown={(e) => {
          dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            dragged: false,
          };
        }}
        onPointerMove={(e) => {
          const { startX, startY } = dragRef.current;
          if (Math.abs(e.clientX - startX) > 4 || Math.abs(e.clientY - startY) > 4) {
            dragRef.current.dragged = true;
          }
        }}
        onPointerMissed={() => {
          // Background click only counts when the user didn't drag
          if (dragRef.current.dragged) return;
          if (history.length > 0) handleBack();
          else handleReset();
        }}
      >
        <color attach="background" args={['#050510']} />
        <fog attach="fog" args={['#050510', 14, 42]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[8, 10, 8]} intensity={0.6} color="#9aa8ff" />
        <pointLight position={[-10, -6, 4]} intensity={0.4} color="#ff7aa8" />

        <StarField />

        <Connections
          slots={slots}
          positions={positions}
          excludeIdx={focusedIdx}
          dissolve={shrinking || transitioning}
        />

        {slots.map((slot, i) => (
          <VibeSphere
            key={i}
            vibe={slot.vibe}
            position={positions[i]}
            driftSeed={driftSeeds[i]}
            isSelected={selectedIdx === i}
            isFocused={focusedIdx === i && selectedIdx == null}
            active={slot.active}
            completing={completing && focusedIdx === i}
            dissolve={!slot.active || (shrinking && selectedIdx !== i)}
            dissolveDelay={dissolveDelays[i]}
            fadeSpeed={0.012}
            onClick={() => handleSphereClick(i)}
          />
        ))}

        <Completion
          active={completing}
          focusedColor={
            focusedIdx != null && slots[focusedIdx]
              ? slots[focusedIdx].vibe.palette[0]
              : [1, 1, 1]
          }
        />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={!completing}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.5}
          autoRotate={!completing}
          autoRotateSpeed={0.25}
          minDistance={14}
          maxDistance={14}
          target={[0, 0, 0]}
        />
      </Canvas>

      {!completing && (
        <div className="hint">
          <span className="dot" />
          drag to rotate · click a vibe to refine · esc to step back
        </div>
      )}
      {depth > 0 && !completing && (
        <div className="depth">
          depth · {depth} {activeCount === 1 ? '· final' : `· ${activeCount} vibes`}
        </div>
      )}
      <CompletionOverlay active={completing} insight={insight} />
    </div>
  );
}
