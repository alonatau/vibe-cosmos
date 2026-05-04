// Abstract visual stimuli. Each stimulus is a deliberate measurement instrument
// — its appearance is fully determined by 4 axis loadings + a 3-color palette.
// Loadings range -2..+2; the shader normalises to -1..+1.
//
// Axes (each anchored in replicated literature, NOT folk hue→trait psychology):
//   complexity:  Openness×complexity (Silvia 2007, Cotter 2023; β ≈ 0.55, the
//                largest, most-replicated effect in personality-aesthetics)
//   order:       Need for Cognitive Closure / inverse Openness on broken-vs-strict
//                symmetry (Webster & Kruglanski 1994; Leder et al. 2019)
//   energy:      Saturation/motion-energy → Extraversion (Zhang et al. 2025;
//                Valdez & Mehrabian 1994)
//   softness:    Curvature + smooth motion → Agreeableness/inv. Neuroticism
//                (Bar & Neta 2006 amygdala threat for sharp; Cotter & Silvia 2017)
//
// Stimulus library is structured in clusters that exercise each axis end-to-end,
// plus diagonal compounds in cluster E that load multiple axes (the discriminating
// "tells"). Initial-pick set draws across all clusters so every depth-0 cluster
// covers the score-space.
export const VIBES = [
  // ---------- Cluster A — Complexity axis ----------
  {
    id: 'cream-droplet',
    palette: [[0.94, 0.88, 0.74], [1.0, 0.96, 0.86], [0.1, 0.1, 0.11]],
    radius: 1.0,
    scores: { complexity: -2, order: 1, energy: -1, softness: 1 },
  },
  {
    id: 'lavender-blur',
    palette: [[0.78, 0.72, 0.92], [0.92, 0.84, 0.95], [0.16, 0.14, 0.2]],
    radius: 1.05,
    scores: { complexity: -1, order: 1, energy: -1, softness: 2 },
  },
  {
    id: 'voronoi-stone',
    palette: [[0.55, 0.62, 0.72], [0.78, 0.82, 0.88], [0.12, 0.14, 0.18]],
    radius: 1.1,
    scores: { complexity: 1, order: 1, energy: -1, softness: 0 },
  },
  {
    id: 'fractal-moss',
    palette: [[0.5, 0.62, 0.42], [0.7, 0.55, 0.4], [0.1, 0.13, 0.08]],
    radius: 1.15,
    scores: { complexity: 2, order: 0, energy: 0, softness: 0 },
  },
  {
    id: 'particle-haze',
    palette: [[0.62, 0.6, 0.7], [0.85, 0.82, 0.88], [0.08, 0.08, 0.1]],
    radius: 1.1,
    scores: { complexity: 2, order: -1, energy: 0, softness: 1 },
  },
  {
    id: 'minimal-trace',
    palette: [[0.95, 0.95, 0.95], [1.0, 1.0, 1.0], [0.04, 0.04, 0.04]],
    radius: 0.92,
    scores: { complexity: -2, order: 2, energy: -1, softness: 1 },
  },

  // ---------- Cluster B — Order axis ----------
  {
    id: 'mandala-azure',
    palette: [[0.32, 0.5, 0.88], [0.95, 0.78, 0.4], [0.04, 0.04, 0.14]],
    radius: 1.1,
    scores: { complexity: 1, order: 2, energy: 0, softness: 0 },
  },
  {
    id: 'penrose-grey',
    palette: [[0.5, 0.5, 0.52], [0.88, 0.88, 0.9], [0.1, 0.1, 0.12]],
    radius: 1.0,
    scores: { complexity: 1, order: 2, energy: -2, softness: -1 },
  },
  {
    id: 'broken-blot',
    palette: [[0.94, 0.92, 0.84], [0.6, 0.45, 0.4], [0.13, 0.1, 0.1]],
    radius: 1.05,
    scores: { complexity: 1, order: -2, energy: 0, softness: 1 },
  },
  {
    id: 'asymmetric-bough',
    palette: [[0.45, 0.55, 0.38], [0.65, 0.58, 0.45], [0.95, 0.92, 0.85]],
    radius: 0.95,
    scores: { complexity: 0, order: -2, energy: -1, softness: 1 },
  },
  {
    id: 'grid-circles',
    palette: [[0.55, 0.6, 0.65], [0.85, 0.85, 0.88], [0.12, 0.12, 0.15]],
    radius: 1.0,
    scores: { complexity: 0, order: 2, energy: -1, softness: 1 },
  },
  {
    id: 'scatter-field',
    palette: [[0.65, 0.55, 0.45], [0.45, 0.55, 0.65], [0.1, 0.1, 0.13]],
    radius: 1.05,
    scores: { complexity: 1, order: -2, energy: 0, softness: 0 },
  },

  // ---------- Cluster C — Energy axis ----------
  {
    id: 'coral-electric',
    palette: [[1.0, 0.42, 0.36], [1.0, 0.92, 0.22], [0.1, 0.04, 0.04]],
    radius: 1.05,
    scores: { complexity: 0, order: 0, energy: 2, softness: -1 },
  },
  {
    id: 'pale-rose-slate',
    palette: [[0.65, 0.7, 0.75], [0.85, 0.7, 0.72], [0.18, 0.2, 0.22]],
    radius: 1.05,
    scores: { complexity: -1, order: 0, energy: -2, softness: 2 },
  },
  {
    id: 'magenta-cyan-pulse',
    palette: [[1.0, 0.18, 0.85], [0.22, 0.95, 1.0], [0.05, 0.0, 0.08]],
    radius: 1.1,
    scores: { complexity: 1, order: 1, energy: 2, softness: -1 },
  },
  {
    id: 'sage-cream',
    palette: [[0.55, 0.62, 0.5], [0.85, 0.83, 0.75], [0.18, 0.2, 0.18]],
    radius: 1.0,
    scores: { complexity: -1, order: 1, energy: -2, softness: 1 },
  },
  {
    id: 'tangerine-burn',
    palette: [[1.0, 0.55, 0.1], [1.0, 0.32, 0.12], [0.15, 0.05, 0.0]],
    radius: 1.0,
    scores: { complexity: -1, order: 0, energy: 2, softness: 0 },
  },
  {
    id: 'deep-night',
    palette: [[0.18, 0.22, 0.4], [0.32, 0.38, 0.55], [0.02, 0.02, 0.06]],
    radius: 1.0,
    scores: { complexity: -1, order: 1, energy: -2, softness: 1 },
  },

  // ---------- Cluster D — Softness axis ----------
  {
    id: 'pastel-blobs',
    palette: [[1.0, 0.85, 0.78], [0.85, 0.95, 0.85], [0.95, 0.92, 0.88]],
    radius: 1.1,
    scores: { complexity: 0, order: -1, energy: -1, softness: 2 },
  },
  {
    id: 'crystal-shards',
    palette: [[0.55, 0.6, 0.68], [0.88, 0.88, 0.92], [0.05, 0.06, 0.08]],
    radius: 1.0,
    scores: { complexity: 0, order: 0, energy: 0, softness: -2 },
  },
  {
    id: 'flowing-ribbon',
    palette: [[0.55, 0.72, 0.5], [0.78, 0.88, 0.65], [0.12, 0.18, 0.12]],
    radius: 1.05,
    scores: { complexity: 0, order: -1, energy: -1, softness: 2 },
  },
  {
    id: 'angular-rust',
    palette: [[0.68, 0.18, 0.16], [0.95, 0.5, 0.4], [0.05, 0.02, 0.02]],
    radius: 1.1,
    scores: { complexity: 1, order: -1, energy: 1, softness: -2 },
  },
  {
    id: 'soft-torus',
    palette: [[0.92, 0.86, 0.74], [1.0, 0.96, 0.86], [0.18, 0.15, 0.12]],
    radius: 1.0,
    scores: { complexity: -1, order: 1, energy: -1, softness: 2 },
  },
  {
    id: 'spike-formation',
    palette: [[0.4, 0.45, 0.5], [0.7, 0.7, 0.75], [0.05, 0.05, 0.08]],
    radius: 1.05,
    scores: { complexity: 1, order: 0, energy: 0, softness: -2 },
  },

  // ---------- Cluster E — Diagonal compounds (the strongest "tells") ----------
  {
    id: 'irregular-curved',
    palette: [[0.65, 0.6, 0.55], [0.85, 0.78, 0.7], [0.12, 0.1, 0.1]],
    radius: 1.15,
    scores: { complexity: 2, order: -2, energy: -1, softness: 1 },
  },
  {
    id: 'circle-in-square',
    palette: [[0.95, 0.4, 0.3], [1.0, 0.85, 0.3], [0.1, 0.08, 0.05]],
    radius: 0.95,
    scores: { complexity: -2, order: 2, energy: 1, softness: 0 },
  },
  {
    id: 'angular-vigilant',
    palette: [[0.85, 0.16, 0.16], [0.95, 0.5, 0.3], [0.0, 0.0, 0.0]],
    radius: 1.0,
    scores: { complexity: -1, order: -1, energy: 1, softness: -2 },
  },
  {
    id: 'curved-fractal-cool',
    palette: [[0.45, 0.6, 0.7], [0.65, 0.78, 0.85], [0.15, 0.18, 0.2]],
    radius: 1.1,
    scores: { complexity: 1, order: -1, energy: -2, softness: 2 },
  },
  {
    id: 'maximalist-grid',
    palette: [[1.0, 0.4, 0.7], [0.4, 0.95, 0.85], [0.95, 0.85, 0.3]],
    radius: 1.15,
    scores: { complexity: 2, order: 1, energy: 2, softness: -1 },
  },
  {
    id: 'minimal-pale',
    palette: [[0.85, 0.85, 0.9], [0.96, 0.96, 0.98], [0.7, 0.7, 0.75]],
    radius: 0.95,
    scores: { complexity: -2, order: 2, energy: -2, softness: 1 },
  },
  {
    id: 'edgy-creative',
    palette: [[1.0, 0.2, 0.5], [0.5, 0.95, 0.95], [0.05, 0.0, 0.1]],
    radius: 1.15,
    scores: { complexity: 2, order: -2, energy: 2, softness: -2 },
  },
  {
    id: 'rounded-warm',
    palette: [[0.95, 0.78, 0.65], [1.0, 0.92, 0.82], [0.4, 0.3, 0.25]],
    radius: 1.05,
    scores: { complexity: 0, order: 1, energy: 0, softness: 2 },
  },
];

export function similarity(a, b) {
  if (a.id === b.id) return -1;
  // Similarity now operates on score vectors (Euclidean distance, inverted).
  // Closer in axis-space = more similar.
  const da = a.scores;
  const db = b.scores;
  const d = Math.sqrt(
    (da.complexity - db.complexity) ** 2 +
      (da.order - db.order) ** 2 +
      (da.energy - db.energy) ** 2 +
      (da.softness - db.softness) ** 2
  );
  // Map distance (0..~8) to a similarity score (rougher = closer to original 0..5 range)
  return Math.max(0, 5 - d);
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
const clampScore = (x) => Math.max(-2, Math.min(2, x));

// Top-N closest stimuli by axis-space distance — used so 'pattern' variants
// always have related stimuli to draw direction from.
function topCousins(base, n = 6) {
  return VIBES.filter((v) => v.id !== base.id)
    .map((v) => ({ v, s: similarity(base, v) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((x) => x.v);
}

// Variation strategy:
//   'color'   — palette shifted strongly, axis values preserved (same shader
//               output structure, different chroma — tests color discrimination)
//   'pattern' — palette barely jittered, axis values pulled toward a cousin
//               (same color family, different visual structure — tests
//               complexity/order/softness preference)
//   'mixed'   — moderate of both
export function mutateVibe(base, seedKey, intensity = 0.25, strategy = 'mixed') {
  const rng = rngFromSeed(hashStr(seedKey));

  let paletteFactor;
  let axisFactor;
  if (strategy === 'color') {
    paletteFactor = 1.4;
    axisFactor = 0.0;
  } else if (strategy === 'pattern') {
    paletteFactor = 0.22;
    axisFactor = 1.0;
  } else {
    paletteFactor = 0.7;
    axisFactor = 0.45;
  }

  const palette = base.palette.map((rgb) => [
    clamp01(rgb[0] + (rng() - 0.5) * intensity * paletteFactor),
    clamp01(rgb[1] + (rng() - 0.5) * intensity * paletteFactor),
    clamp01(rgb[2] + (rng() - 0.5) * intensity * paletteFactor),
  ]);

  // For pattern/mixed: pull axes toward a cousin's profile so the variant
  // moves along the axis space, not random noise.
  let scores = { ...base.scores };
  if (axisFactor > 0) {
    const cousins = topCousins(base, 6);
    if (cousins.length > 0) {
      const target = cousins[Math.floor(rng() * cousins.length)].scores;
      for (const k of ['complexity', 'order', 'energy', 'softness']) {
        const dir = Math.sign(target[k] - scores[k]);
        if (dir !== 0 && rng() < 0.55 * axisFactor) {
          scores[k] = clampScore(scores[k] + dir);
        }
      }
    }
  }

  const radius = Math.max(
    0.8,
    Math.min(1.15, base.radius + (rng() - 0.5) * 0.25)
  );
  return {
    id: `${base.id}-v-${seedKey}-${strategy}`,
    palette,
    scores,
    radius,
  };
}

// Generate `count` variants. Each click pulls everyone 15% closer to the focus.
// Strategy mix: more 'color' (legible chroma variation), some 'pattern' (axis
// movement so the cluster offers structural choices), a few 'mixed'.
export function variantsOf(base, count, sessionKey, depth = 1) {
  const out = [];
  const rng = rngFromSeed(hashStr(`${sessionKey}-jitter`));
  const similarityScale = Math.pow(0.85, Math.max(0, depth - 1));

  const strategies = [];
  for (let i = 0; i < count; i++) {
    const r = rng();
    if (r < 0.55) strategies.push('color');
    else if (r < 0.85) strategies.push('pattern');
    else strategies.push('mixed');
  }
  if (count >= 3) {
    if (!strategies.includes('color')) strategies[0] = 'color';
    if (!strategies.includes('pattern')) strategies[1] = 'pattern';
  }

  for (let i = 0; i < count; i++) {
    const ramp = count <= 1 ? 0 : i / (count - 1);
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
