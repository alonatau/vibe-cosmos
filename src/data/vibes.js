// Each vibe is a unique aesthetic world. Shader mode + palette + tags drive
// look and similarity; `scores` drives the personality reveal at the end.
//
// Score axes (each -2 to +2). Grounded in replicated findings, NOT folk hue→trait
// claims (those don't replicate — see Lüscher critique, Wilms & Oberfeld 2018):
//   openness:  preference for complexity/novelty/abstraction
//              (Openness×complexity is THE most replicated personality-aesthetics
//              link — Silvia 2007, Fayn 2015)
//   intensity: arousal-seeking via saturation/contrast
//              (Valdez & Mehrabian 1994 — saturation drives arousal)
//   darkness:  preference for dark/decay/horror motifs
//              (Scrivner 2021 morbid curiosity scale; normally distributed,
//              not pathological)
//   structure: order/geometric vs organic/chaotic
//              (Spehar et al. 2016 fractal preference + Conscientiousness×design;
//              weakest of the four but design-useful)
export const VIBES = [
  {
    id: 'anime',
    mode: 0,
    palette: [[1.0, 0.75, 0.85], [0.55, 0.85, 1.0], [1.0, 0.95, 0.98]],
    tags: ['anime', 'pastel', 'stylized', 'japanese', 'soft'],
    radius: 1.1,
    scores: { openness: 1, intensity: -1, darkness: -2, structure: -1 },
  },
  {
    id: 'jrpg',
    mode: 11,
    palette: [[1.0, 0.78, 0.35], [0.95, 0.55, 0.75], [0.4, 0.25, 0.55]],
    tags: ['anime', 'fantasy', 'japanese', 'narrative', 'magical'],
    radius: 1.05,
    scores: { openness: 1, intensity: 0, darkness: -1, structure: -1 },
  },
  {
    id: 'mecha',
    mode: 13,
    palette: [[0.95, 0.45, 0.15], [0.6, 0.7, 0.85], [0.1, 0.12, 0.18]],
    tags: ['anime', 'scifi', 'industrial', 'japanese', 'mechanical'],
    radius: 1.2,
    scores: { openness: 1, intensity: 1, darkness: 0, structure: 2 },
  },
  {
    id: 'visualnovel',
    mode: 12,
    palette: [[1.0, 0.85, 0.92], [0.95, 0.6, 0.75], [0.7, 0.4, 0.6]],
    tags: ['anime', 'narrative', 'pastel', 'romance', 'soft'],
    radius: 0.85,
    scores: { openness: 0, intensity: -2, darkness: -2, structure: -1 },
  },
  {
    id: 'doom',
    mode: 1,
    palette: [[1.0, 0.15, 0.05], [0.4, 0.05, 0.0], [0.05, 0.02, 0.02]],
    tags: ['horror', 'violent', 'dark', 'fps', 'industrial'],
    radius: 1.3,
    scores: { openness: 0, intensity: 2, darkness: 2, structure: 0 },
  },
  {
    id: 'horror',
    mode: 1,
    palette: [[0.55, 0.05, 0.08], [0.15, 0.02, 0.04], [0.0, 0.0, 0.0]],
    tags: ['horror', 'dark', 'atmospheric', 'tense'],
    radius: 1.0,
    scores: { openness: 0, intensity: 1, darkness: 2, structure: -1 },
  },
  {
    id: 'cosmichorror',
    mode: 6,
    palette: [[0.35, 0.1, 0.5], [0.1, 0.0, 0.2], [0.6, 0.8, 0.5]],
    tags: ['horror', 'dark', 'atmospheric', 'weird', 'narrative'],
    radius: 1.15,
    scores: { openness: 2, intensity: 0, darkness: 2, structure: -2 },
  },
  {
    id: 'soulslike',
    mode: 10,
    palette: [[0.5, 0.5, 0.55], [0.95, 0.45, 0.15], [0.08, 0.06, 0.08]],
    tags: ['dark', 'violent', 'atmospheric', 'challenging', 'fantasy'],
    radius: 1.2,
    scores: { openness: 1, intensity: 1, darkness: 2, structure: 0 },
  },
  {
    id: 'mystery',
    mode: 2,
    palette: [[0.2, 0.25, 0.6], [0.55, 0.4, 0.85], [0.05, 0.08, 0.2]],
    tags: ['narrative', 'atmospheric', 'dark', 'thoughtful'],
    radius: 0.95,
    scores: { openness: 1, intensity: -1, darkness: 1, structure: -1 },
  },
  {
    id: 'noir',
    mode: 7,
    palette: [[0.45, 0.55, 0.75], [0.85, 0.85, 0.95], [0.05, 0.06, 0.1]],
    tags: ['narrative', 'atmospheric', 'dark', 'stylized', 'thoughtful'],
    radius: 0.9,
    scores: { openness: 1, intensity: -1, darkness: 1, structure: 0 },
  },
  {
    id: 'fantasy',
    mode: 3,
    palette: [[0.2, 0.95, 0.55], [0.4, 0.85, 0.7], [0.05, 0.2, 0.15]],
    tags: ['fantasy', 'narrative', 'magical', 'soft'],
    radius: 1.25,
    scores: { openness: 1, intensity: 0, darkness: -1, structure: -2 },
  },
  {
    id: 'scifi',
    mode: 4,
    palette: [[0.4, 0.75, 1.0], [0.85, 0.9, 1.0], [0.05, 0.1, 0.2]],
    tags: ['scifi', 'futuristic', 'mechanical'],
    radius: 1.1,
    scores: { openness: 1, intensity: 0, darkness: 0, structure: 1 },
  },
  {
    id: 'cyberpunk',
    mode: 5,
    palette: [[1.0, 0.15, 0.7], [0.2, 0.95, 0.95], [0.08, 0.02, 0.15]],
    tags: ['scifi', 'futuristic', 'neon', 'dystopian', 'stylized'],
    radius: 1.15,
    scores: { openness: 2, intensity: 2, darkness: 1, structure: 1 },
  },
  {
    id: 'postapoc',
    mode: 9,
    palette: [[0.85, 0.5, 0.25], [0.45, 0.3, 0.2], [0.15, 0.1, 0.08]],
    tags: ['dystopian', 'rust', 'survival', 'dark', 'atmospheric'],
    radius: 1.1,
    scores: { openness: 0, intensity: 0, darkness: 1, structure: -1 },
  },
  {
    id: 'survival',
    mode: 15,
    palette: [[0.25, 0.55, 0.35], [0.55, 0.7, 0.4], [0.05, 0.1, 0.08]],
    tags: ['survival', 'atmospheric', 'rust'],
    radius: 1.0,
    scores: { openness: 0, intensity: 0, darkness: 0, structure: -1 },
  },
  {
    id: 'racing',
    mode: 8,
    palette: [[1.0, 0.55, 0.1], [1.0, 0.95, 0.3], [0.1, 0.05, 0.0]],
    tags: ['arcade', 'fast', 'stylized'],
    radius: 0.95,
    scores: { openness: -1, intensity: 2, darkness: -1, structure: 0 },
  },
  {
    id: 'puzzle',
    mode: 4,
    palette: [[0.5, 0.85, 1.0], [1.0, 1.0, 1.0], [0.1, 0.15, 0.25]],
    tags: ['geometric', 'minimal', 'thoughtful'],
    radius: 0.8,
    scores: { openness: 0, intensity: -1, darkness: -1, structure: 2 },
  },
  {
    id: 'retro',
    mode: 8,
    palette: [[0.3, 1.0, 0.4], [1.0, 0.85, 0.2], [0.0, 0.1, 0.0]],
    tags: ['arcade', 'pixel', 'nostalgic', 'stylized'],
    radius: 0.85,
    scores: { openness: -1, intensity: 0, darkness: 0, structure: 2 },
  },
  {
    id: 'platformer',
    mode: 0,
    palette: [[0.95, 0.4, 0.4], [0.3, 0.7, 1.0], [1.0, 0.9, 0.3]],
    tags: ['arcade', 'stylized', 'soft'],
    radius: 0.9,
    scores: { openness: -1, intensity: 1, darkness: -2, structure: 0 },
  },
  {
    id: 'roguelike',
    mode: 14,
    palette: [[0.95, 0.55, 0.2], [0.4, 0.2, 0.1], [0.05, 0.03, 0.03]],
    tags: ['challenging', 'dark', 'fantasy', 'atmospheric'],
    radius: 1.0,
    scores: { openness: 1, intensity: 0, darkness: 2, structure: 0 },
  },
];

export function similarity(a, b) {
  if (a.id === b.id) return -1;
  const setB = new Set(b.tags);
  let overlap = 0;
  for (const t of a.tags) if (setB.has(t)) overlap += 1;
  return overlap;
}

function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rngFromSeed(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (x) => Math.max(0, Math.min(1, x));

// Top-N most-similar VIBES by tag overlap — used so 'pattern' variants always
// have a meaningful set of related shader modes to swap into, even when the
// strict cousin threshold (similarity >= 2) leaves few candidates.
function topCousins(base, n = 6) {
  return VIBES.filter((v) => v.id !== base.id)
    .map((v) => ({ v, s: similarity(base, v) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((x) => x.v);
}

// Variation strategy:
//   'color'   — same shader pattern (mode kept), palette shifted strongly
//   'pattern' — same color family (palette barely jittered), DIFFERENT mode
//   'mixed'   — moderate of both, anchors the cluster
// Each variant in a cluster picks one strategy so siblings differ along
// distinct axes — clicking any feels like a meaningful directional choice.
export function mutateVibe(base, seedKey, intensity = 0.25, strategy = 'mixed') {
  const rng = rngFromSeed(hashStr(seedKey));

  let paletteFactor;
  let forceModeSwap;
  if (strategy === 'color') {
    paletteFactor = 1.4; // strong palette shift, mode preserved
    forceModeSwap = false;
  } else if (strategy === 'pattern') {
    paletteFactor = 0.22; // palette nearly identical, mode forcibly different
    forceModeSwap = true;
  } else {
    paletteFactor = 0.7;
    forceModeSwap = false;
  }

  const palette = base.palette.map((rgb) => [
    clamp01(rgb[0] + (rng() - 0.5) * intensity * paletteFactor),
    clamp01(rgb[1] + (rng() - 0.5) * intensity * paletteFactor),
    clamp01(rgb[2] + (rng() - 0.5) * intensity * paletteFactor),
  ]);

  let mode = base.mode;
  let scores = base.scores;
  // Score propagation: pattern variants take on the cousin's score signature
  // (a different aesthetic family is the whole point of the swap). Color and
  // mixed variants stay anchored to the base; minor palette-driven adjustment
  // applied below.
  if (forceModeSwap) {
    const cousins = topCousins(base, 6);
    if (cousins.length) {
      const picked = cousins[Math.floor(rng() * cousins.length)];
      mode = picked.mode;
      scores = picked.scores;
    }
  } else if (strategy === 'mixed' && rng() < 0.18) {
    const cousins = topCousins(base, 4);
    if (cousins.length) {
      const picked = cousins[Math.floor(rng() * cousins.length)];
      mode = picked.mode;
      // Mixed swap blends scores half-and-half toward the cousin
      scores = {
        openness: Math.round((base.scores.openness + picked.scores.openness) / 2),
        intensity: Math.round((base.scores.intensity + picked.scores.intensity) / 2),
        darkness: Math.round((base.scores.darkness + picked.scores.darkness) / 2),
        structure: Math.round((base.scores.structure + picked.scores.structure) / 2),
      };
    }
  }

  // Color variants: nudge intensity/darkness based on actual palette shift
  // (Valdez-Mehrabian — saturation drives arousal; brightness drives valence).
  if (strategy === 'color') {
    const primary = palette[0];
    const brightness = (primary[0] + primary[1] + primary[2]) / 3;
    const saturation = Math.max(...primary) - Math.min(...primary);
    const basePrimary = base.palette[0];
    const baseBrightness =
      (basePrimary[0] + basePrimary[1] + basePrimary[2]) / 3;
    const baseSaturation =
      Math.max(...basePrimary) - Math.min(...basePrimary);
    const dB = brightness - baseBrightness; // positive = brighter
    const dS = saturation - baseSaturation; // positive = more saturated
    scores = {
      openness: scores.openness,
      intensity: Math.max(-2, Math.min(2, scores.intensity + Math.sign(dS) * (Math.abs(dS) > 0.15 ? 1 : 0))),
      darkness: Math.max(-2, Math.min(2, scores.darkness - Math.sign(dB) * (Math.abs(dB) > 0.15 ? 1 : 0))),
      structure: scores.structure,
    };
  }

  const radius = Math.max(
    0.75,
    Math.min(1.1, base.radius + (rng() - 0.5) * 0.35)
  );
  return {
    id: `${base.id}-v-${seedKey}-${strategy}`,
    mode,
    palette,
    tags: [...base.tags],
    radius,
    scores,
  };
}

// Generate `count` variants distributed across the variation axes.
// Each click pulls everyone 15% closer to the focus, but the strategy mix
// guarantees that some siblings always vary by colour and others by pattern —
// so every choice is a meaningful step in the right direction.
export function variantsOf(base, count, sessionKey, depth = 1) {
  const out = [];
  const rng = rngFromSeed(hashStr(`${sessionKey}-jitter`));
  const similarityScale = Math.pow(0.85, Math.max(0, depth - 1));

  // Distribute strategies — bias toward 'color' (most legible variation),
  // sprinkle 'pattern' for shape changes, a few 'mixed' to anchor the cluster.
  const strategies = [];
  for (let i = 0; i < count; i++) {
    const r = rng();
    if (r < 0.55) strategies.push('color');
    else if (r < 0.85) strategies.push('pattern');
    else strategies.push('mixed');
  }
  // Ensure at least one of each type when count >= 3
  if (count >= 3) {
    if (!strategies.includes('color')) strategies[0] = 'color';
    if (!strategies.includes('pattern')) strategies[1] = 'pattern';
  }

  for (let i = 0; i < count; i++) {
    const ramp = count <= 1 ? 0 : i / (count - 1);
    // Wider intensity band so 'color' variants feel genuinely different
    const baseIntensity = (0.32 + ramp * 0.32) * similarityScale;
    const jitter = (rng() - 0.5) * 0.1;
    const intensity = Math.max(0.1, Math.min(0.7, baseIntensity + jitter));
    out.push(
      mutateVibe(
        base,
        `${sessionKey}-${base.id}-${i}`,
        intensity,
        strategies[i]
      )
    );
  }
  return out;
}
