// Auto-loaded from /src/orbs/. Filename convention:
//   color_artstyle_gamegenre.ext  (3 parts — full game vibe)
//   color_artstyle.ext            (2 parts — art-only, no specific genre)
//   artstyle.ext                  (1 part — fallback, treated as style only)
//
// Each part becomes a matchable dimension. Drill-down variants share ANY of
// the focused orb's dimensions, so clicking "pink_anime_adventure" gives
// other anime orbs, other adventure orbs, and other pink orbs.

const modules = import.meta.glob('../orbs/*.{png,jpg,jpeg,webp}', {
  eager: true,
});

// ---------- Color → palette mapping ----------
// Used to tint the rim glow + drive flavor variants. Falls back to a neutral
// palette for unrecognised colour names.
const COLOR_PALETTES = {
  pink:    [[1.0, 0.55, 0.78], [0.95, 0.78, 0.88], [0.55, 0.3, 0.45]],
  red:     [[1.0, 0.3, 0.25],  [0.85, 0.4, 0.3],   [0.3, 0.1, 0.08]],
  orange:  [[1.0, 0.6, 0.2],   [1.0, 0.78, 0.4],   [0.4, 0.22, 0.08]],
  yellow:  [[1.0, 0.85, 0.3],  [1.0, 0.95, 0.55],  [0.4, 0.3, 0.1]],
  green:   [[0.4, 0.85, 0.45], [0.65, 0.95, 0.55], [0.1, 0.25, 0.15]],
  teal:    [[0.2, 0.78, 0.78], [0.45, 0.92, 0.85], [0.05, 0.2, 0.25]],
  cyan:    [[0.4, 0.95, 1.0],  [0.65, 0.95, 1.0],  [0.1, 0.3, 0.4]],
  blue:    [[0.35, 0.55, 0.95],[0.55, 0.78, 1.0],  [0.08, 0.15, 0.3]],
  purple:  [[0.7, 0.42, 0.95], [0.85, 0.6, 1.0],   [0.25, 0.15, 0.4]],
  magenta: [[1.0, 0.2, 0.7],   [1.0, 0.45, 0.85],  [0.3, 0.1, 0.25]],
  gold:    [[0.95, 0.75, 0.32],[1.0, 0.92, 0.55],  [0.4, 0.3, 0.1]],
  silver:  [[0.78, 0.82, 0.9], [0.92, 0.94, 1.0],  [0.25, 0.28, 0.32]],
  bronze:  [[0.78, 0.5, 0.3],  [0.92, 0.7, 0.45],  [0.3, 0.18, 0.08]],
  copper:  [[0.85, 0.55, 0.3], [1.0, 0.75, 0.5],   [0.3, 0.15, 0.08]],
  black:   [[0.3, 0.3, 0.35],  [0.5, 0.5, 0.55],   [0.05, 0.05, 0.06]],
  white:   [[0.92, 0.92, 0.95],[1.0, 1.0, 1.0],    [0.45, 0.45, 0.5]],
  gray:    [[0.55, 0.58, 0.62],[0.78, 0.82, 0.85], [0.18, 0.2, 0.22]],
  grey:    [[0.55, 0.58, 0.62],[0.78, 0.82, 0.85], [0.18, 0.2, 0.22]],
  brown:   [[0.55, 0.35, 0.18],[0.78, 0.55, 0.32], [0.18, 0.1, 0.05]],
  sand:    [[0.92, 0.78, 0.5], [1.0, 0.9, 0.65],   [0.55, 0.4, 0.2]],
  sage:    [[0.62, 0.72, 0.55],[0.78, 0.85, 0.7],  [0.22, 0.3, 0.2]],
  warm:    [[1.0, 0.7, 0.4],   [1.0, 0.85, 0.6],   [0.4, 0.25, 0.15]],
  cool:    [[0.4, 0.6, 0.9],   [0.6, 0.8, 1.0],    [0.1, 0.15, 0.3]],
  pastel:  [[1.0, 0.85, 0.92], [0.78, 0.95, 0.92], [0.95, 0.95, 0.85]],
  neon:    [[1.0, 0.2, 0.85],  [0.3, 0.95, 1.0],   [0.1, 0.05, 0.15]],
  rainbow: [[1.0, 0.4, 0.45],  [0.4, 0.8, 1.0],    [0.95, 0.85, 0.2]],
  rose:    [[0.95, 0.65, 0.7], [1.0, 0.82, 0.85],  [0.45, 0.2, 0.3]],
  mint:    [[0.6, 0.95, 0.78], [0.78, 1.0, 0.88],  [0.18, 0.4, 0.3]],
  amber:   [[0.95, 0.7, 0.25], [1.0, 0.85, 0.4],   [0.4, 0.25, 0.05]],
  crimson: [[0.85, 0.1, 0.18], [1.0, 0.35, 0.3],   [0.25, 0.05, 0.1]],
  emerald: [[0.18, 0.78, 0.45],[0.4, 0.95, 0.6],   [0.05, 0.25, 0.18]],
  azure:   [[0.25, 0.6, 1.0],  [0.55, 0.82, 1.0],  [0.05, 0.18, 0.4]],
  violet:  [[0.55, 0.3, 0.95], [0.75, 0.55, 1.0],  [0.2, 0.1, 0.4]],
  lime:    [[0.6, 0.95, 0.25], [0.85, 1.0, 0.5],   [0.18, 0.35, 0.05]],
  ivory:   [[1.0, 0.95, 0.85], [1.0, 1.0, 0.95],   [0.5, 0.45, 0.35]],
  darkblue:[[0.25, 0.45, 0.85],[0.45, 0.65, 1.0],  [0.04, 0.08, 0.2]],
  navy:    [[0.18, 0.3, 0.65], [0.4, 0.55, 0.92],  [0.02, 0.05, 0.15]],
  indigo:  [[0.32, 0.25, 0.85],[0.55, 0.5, 1.0],   [0.08, 0.05, 0.25]],
  vivid:   [[1.0, 0.5, 0.3],   [0.4, 0.85, 1.0],   [1.0, 0.85, 0.3]],
  ruby:    [[0.85, 0.15, 0.35],[1.0, 0.4, 0.55],   [0.25, 0.05, 0.12]],
  jade:    [[0.18, 0.7, 0.55], [0.4, 0.92, 0.78],  [0.05, 0.22, 0.18]],
  coral:   [[1.0, 0.55, 0.45], [1.0, 0.78, 0.65],  [0.35, 0.18, 0.15]],
  salmon:  [[1.0, 0.65, 0.55], [1.0, 0.82, 0.72],  [0.4, 0.22, 0.18]],
  lavender:[[0.78, 0.7, 0.95], [0.92, 0.85, 1.0],  [0.4, 0.32, 0.55]],
  fuchsia: [[1.0, 0.25, 0.7],  [1.0, 0.5, 0.85],   [0.35, 0.05, 0.22]],
  bright:  [[1.0, 0.55, 0.4],  [1.0, 0.85, 0.4],   [0.4, 0.7, 1.0]],
  desaturated: [[0.55, 0.55, 0.6], [0.7, 0.7, 0.72], [0.25, 0.27, 0.32]],
  flat:    [[0.95, 0.65, 0.4], [0.4, 0.78, 0.95],  [0.25, 0.25, 0.3]],
  bluegreen:[[0.15, 0.7, 0.6], [0.4, 0.92, 0.78],  [0.05, 0.18, 0.22]],
  greenblue:[[0.2, 0.6, 0.78], [0.45, 0.82, 0.95], [0.05, 0.2, 0.3]],
  greenbrown:[[0.55, 0.55, 0.3],[0.75, 0.6, 0.35], [0.2, 0.18, 0.1]],
  vividbluegreen:[[0.2, 0.85, 0.85],[0.45, 1.0, 1.0], [0.05, 0.25, 0.3]],
};
const DEFAULT_PALETTE = [
  [0.7, 0.72, 0.78],
  [0.88, 0.9, 0.95],
  [0.18, 0.2, 0.25],
];

// Pretty labels for the recipe reveal — derived from the parsed filename.
// Anything not in the map gets title-cased automatically.
export const STYLE_LABELS = {
  painterly: 'Painterly',
  anime: 'Anime',
  pixel: 'Pixel-art',
  cellshaded: 'Cell-shaded',
  toon3d: '3D Cartoon',
  '3d': '3D',
  photoreal: 'Photorealistic',
  pastel3d: 'Pastel 3D',
  flatvector: 'Flat Vector',
  comics: 'Comics',
  cyberpunk: 'Cyberpunk',
  voxel: 'Voxel',
  steampunk: 'Steampunk',
  noir: 'Noir',
  retro: 'Retro',
  cartoon: 'Cartoon',
  lowpoly: 'Low-poly',
  watercolor: 'Watercolour',
  ink: 'Ink',
  manga: 'Manga',
  realistic: 'Realistic',
  stylized: 'Stylized',
  handdrawn: 'Hand-drawn',
  sketch: 'Sketch',
  isometric: 'Isometric',
  flat: 'Flat',
  vector: 'Vector',
  oil: 'Oil-painted',
  chibi: 'Chibi',
  cartoonish: 'Cartoonish',
  cartoonish3d: '3D Cartoonish',
  childish: 'Childish',
  classic: 'Classic',
  egypt: 'Egyptian',
  japanese: 'Japanese',
};
export const GENRE_LABELS = {
  rpg: 'RPG',
  narrative: 'Visual Novel',
  visualnovel: 'Visual Novel',
  adventure: 'Adventure',
  platformer: 'Platformer',
  racing: 'Racing',
  openworld: 'Open World',
  strategy: 'Strategy',
  shooter: 'Shooter',
  fps: 'FPS',
  arena: 'Arena Battler',
  moba: 'MOBA',
  fighting: 'Fighting',
  puzzle: 'Puzzle',
  survival: 'Survival',
  horror: 'Horror',
  roguelike: 'Roguelike',
  runner: 'Endless Runner',
  arcade: 'Arcade',
  simulation: 'Simulation',
  sandbox: 'Sandbox',
  stealth: 'Stealth',
  sports: 'Sports',
  mmorpg: 'MMORPG',
  action: 'Action',
  tactics: 'Tactics',
  metroidvania: 'Metroidvania',
  flight: 'Flight Sim',
  spaceflight: 'Space Sim',
  cars: 'Driving',
  driving: 'Driving',
  flying: 'Flight',
  battleroyale: 'Battle Royale',
  mmo: 'MMO',
  card: 'Card Game',
  cooking: 'Cooking',
  rhythm: 'Rhythm',
  dating: 'Dating Sim',
  city: 'City Builder',
  builder: 'Builder',
  crafting: 'Crafting',
  fishing: 'Fishing',
  farming: 'Farming',
  party: 'Party',
  trivia: 'Trivia',
  adventurequest: 'Adventure Quest',
  battle: 'Battle',
  carrace: 'Car Racing',
  race: 'Racing',
  sea: 'Naval',
  space: 'Space',
  superheroes: 'Superhero',
  towerdefense: 'Tower Defense',
  village: 'Village Sim',
  war: 'Warfare',
};
export const COLOR_LABELS = {
  pink: 'Pink', red: 'Red', orange: 'Orange', yellow: 'Yellow', green: 'Green',
  teal: 'Teal', cyan: 'Cyan', blue: 'Blue', purple: 'Purple', magenta: 'Magenta',
  gold: 'Gold', silver: 'Silver', bronze: 'Bronze', copper: 'Copper',
  black: 'Black', white: 'White', gray: 'Gray', grey: 'Gray', brown: 'Brown',
  sand: 'Sand', sage: 'Sage', warm: 'Warm-toned', cool: 'Cool-toned',
  pastel: 'Pastel', neon: 'Neon', rainbow: 'Vibrant', rose: 'Rose',
  mint: 'Mint', amber: 'Amber', crimson: 'Crimson', emerald: 'Emerald',
  azure: 'Azure', violet: 'Violet', lime: 'Lime', ivory: 'Ivory',
  darkblue: 'Deep Blue', navy: 'Navy', indigo: 'Indigo', vivid: 'Vivid',
  ruby: 'Ruby', jade: 'Jade', coral: 'Coral', salmon: 'Salmon',
  lavender: 'Lavender', fuchsia: 'Fuchsia',
  bright: 'Bright', desaturated: 'Desaturated', flat: 'Flat-toned',
  bluegreen: 'Blue-green', greenblue: 'Green-blue', greenbrown: 'Green-brown',
  vividbluegreen: 'Vivid Teal',
};

// ---------- Parse one image module into a VIBE entry ----------
function parseFilename(path) {
  const filename = path.split('/').pop();
  const base = filename.replace(/\.(png|jpe?g|webp)$/i, '');
  const parts = base.split('_').map((s) => s.toLowerCase());
  let color = null;
  let style = null;
  let genre = null;
  if (parts.length >= 3) {
    [color, style, genre] = parts;
  } else if (parts.length === 2) {
    [color, style] = parts; // art-only
  } else if (parts.length === 1) {
    style = parts[0];
  }
  return { id: base, color, style, genre, _filename: filename };
}

// ---------- Build the catalog at module load ----------
export const VIBES = Object.entries(modules).map(([path, mod]) => {
  const meta = parseFilename(path);
  const palette = COLOR_PALETTES[meta.color] || DEFAULT_PALETTE;
  return {
    ...meta,
    image: mod.default,
    painter: 'fantasy', // canvas fallback if image fails to load
    palette,
    radius: 1.0 + ((meta.id.length % 5) - 2) * 0.05, // tiny size variation
  };
});

// ---------- Algorithm: MMR + taste vector + coverage + wild cards ----------
//
// Research-grounded 3-click drill-down. Anchored in:
//   Loepp et al. 2014   — choice-based cold-start beats rating-based
//   Carbonell & Goldstein 1998 — MMR diversity reranking (λ ∈ [0.3, 0.7])
//   Viappiani & Boutilier 2010 — greedy EUS near-optimal for choice queries
//   Tondello et al. 2019 — game preference: genre > style > color
//   Vargas & Castells 2011 — coverage as a diversification axis
//
// Three picks of (12 → 7 → 4) yields 8.4 bits = enough for ≤ 256 games. With
// 50 in the catalog, 3 clicks is provably sufficient.

// Attribute weights: genre dominates revealed preference for games.
const W = { genre: 0.5, style: 0.3, color: 0.2 };

// MMR λ schedule — relevance share by depth (rest is diversity).
const LAMBDA = { 0: 0.2, 1: 0.4, 2: 0.6, 3: 1.0 };

// ε-greedy wild-card share by depth (fraction of cluster that's exploration).
const EPSILON = { 0: 0.25, 1: 0.15, 2: 0.0, 3: 0.0 };

// Min distinct values per axis at each depth (anti-clone coverage).
const COVERAGE_MIN = { 0: 3, 1: 3, 2: 2, 3: 1 };

// Recency decay: older clicks weight less when building the taste vector.
const RECENCY_DECAY = 0.7;

// ---- Tag IDF: rare tags are more informative than common ones ----
// log(N / (1 + count(tag))) per dimension, computed once at module load.
// Matching a niche tag like "narrative" (2 orbs) scores far higher than
// matching "vivid" (~25 orbs) — fixes the catalog-density dominance bug.
const IDF = (() => {
  const counts = { color: new Map(), style: new Map(), genre: new Map() };
  for (const v of VIBES) {
    if (v.color) counts.color.set(v.color, (counts.color.get(v.color) || 0) + 1);
    if (v.style) counts.style.set(v.style, (counts.style.get(v.style) || 0) + 1);
    if (v.genre) counts.genre.set(v.genre, (counts.genre.get(v.genre) || 0) + 1);
  }
  const N = Math.max(1, VIBES.length);
  const make = (m) => {
    const out = new Map();
    for (const [k, c] of m) out.set(k, Math.log((N + 1) / (c + 1)) + 1);
    return out;
  };
  return { color: make(counts.color), style: make(counts.style), genre: make(counts.genre) };
})();
const idfOf = (axis, value) => (value ? IDF[axis].get(value) || 1 : 0);

// ---- Tag-vector representation for cosine similarity ----
// Sparse vector keyed by `${axis}:${value}` with IDF-weighted values
// (× attribute weight). Used to compute continuous, fine-grained
// similarity between orbs.
const VEC_CACHE = new WeakMap();
function tagVector(orb) {
  if (!orb) return new Map();
  if (VEC_CACHE.has(orb)) return VEC_CACHE.get(orb);
  const v = new Map();
  if (orb.color) v.set(`color:${orb.color}`, W.color * idfOf('color', orb.color));
  if (orb.style) v.set(`style:${orb.style}`, W.style * idfOf('style', orb.style));
  if (orb.genre) v.set(`genre:${orb.genre}`, W.genre * idfOf('genre', orb.genre));
  VEC_CACHE.set(orb, v);
  return v;
}
function vecNorm(v) {
  let s = 0;
  for (const x of v.values()) s += x * x;
  return Math.sqrt(s) || 1;
}
function vecDot(a, b) {
  // Iterate the smaller map for speed.
  const [s, l] = a.size < b.size ? [a, b] : [b, a];
  let d = 0;
  for (const [k, x] of s) {
    const y = l.get(k);
    if (y !== undefined) d += x * y;
  }
  return d;
}
function cosineSim(a, b) {
  const va = tagVector(a);
  const vb = tagVector(b);
  if (va.size === 0 || vb.size === 0) return 0;
  return vecDot(va, vb) / (vecNorm(va) * vecNorm(vb));
}

export function similarity(a, b) {
  if (!a || !b || a.id === b.id) return -1;
  // Public similarity API kept as 0..3 dimension-overlap count for back-compat.
  let s = 0;
  if (a.color && a.color === b.color) s += 1;
  if (a.style && a.style === b.style) s += 1;
  if (a.genre && a.genre === b.genre) s += 1;
  return s;
}

// Build a recency-decayed taste vector from the user's click path.
// Most recent click weight 1; each step back multiplied by RECENCY_DECAY.
function buildTaste(path) {
  const taste = {
    color: new Map(),
    style: new Map(),
    genre: new Map(),
    total: 0,
  };
  const n = path.length;
  for (let i = 0; i < n; i++) {
    const orb = path[i];
    if (!orb) continue;
    const w = Math.pow(RECENCY_DECAY, n - 1 - i);
    taste.total += w;
    if (orb.color) taste.color.set(orb.color, (taste.color.get(orb.color) || 0) + w);
    if (orb.style) taste.style.set(orb.style, (taste.style.get(orb.style) || 0) + w);
    if (orb.genre) taste.genre.set(orb.genre, (taste.genre.get(orb.genre) || 0) + w);
  }
  return taste;
}

// IDF-weighted relevance. A match on a rare tag (e.g. "narrative", 2 orbs)
// scores far higher than a match on a common tag (e.g. "vivid", ~25 orbs),
// so clicking a niche orb pulls the cluster toward the niche instead of
// toward whichever tag values dominate the catalog.
function relevance(orb, taste) {
  if (!orb || taste.total === 0) return 0;
  let s = 0;
  if (orb.color) {
    s += W.color * (taste.color.get(orb.color) || 0) * idfOf('color', orb.color);
  }
  if (orb.style) {
    s += W.style * (taste.style.get(orb.style) || 0) * idfOf('style', orb.style);
  }
  if (orb.genre) {
    s += W.genre * (taste.genre.get(orb.genre) || 0) * idfOf('genre', orb.genre);
  }
  // Normalise by both the taste mass and the max possible IDF per dim so the
  // result stays roughly in [0, 1] regardless of catalog skew.
  const maxIdf = Math.max(
    ...IDF.color.values(),
    ...IDF.style.values(),
    ...IDF.genre.values(),
    1
  );
  return s / (taste.total * maxIdf);
}

// Soft coverage bonus: prefer candidates that introduce a new value to an
// axis that's still under its minimum distinct-value count.
function coverageBonus(orb, picks, minDistinct) {
  let bonus = 0;
  for (const axis of ['color', 'style', 'genre']) {
    if (!orb[axis]) continue;
    const distinct = new Set(picks.map((p) => p[axis]).filter(Boolean));
    if (distinct.size < minDistinct && !distinct.has(orb[axis])) {
      bonus += 0.18;
    }
  }
  return bonus;
}

// Greedy MMR pick with coverage bonus: balance relevance, diversity, axis
// coverage. λ=0 → pure diversity; λ=1 → pure relevance.
function mmrPick(candidates, count, taste, lambda, minDistinct, sessionKey) {
  const picks = [];
  let pool = [...candidates];
  // Tiny per-session jitter so identical taste vectors give slightly varied
  // clusters across sessions — feels alive without compromising relevance.
  const jitter = sessionKey ? rngFromSeed(hashStr(sessionKey)) : Math.random;
  while (picks.length < count && pool.length > 0) {
    let best = null;
    let bestScore = -Infinity;
    for (const c of pool) {
      const rel = relevance(c, taste);
      // Cosine similarity over IDF-weighted tag vectors gives continuous
      // 0..1 values — diversity ranking actually differentiates candidates
      // that all share 0 dimensions (the binary version tied them).
      const maxSim = picks.length === 0
        ? 0
        : Math.max(...picks.map((p) => cosineSim(c, p)));
      const cov = coverageBonus(c, picks, minDistinct);
      const score = lambda * rel - (1 - lambda) * maxSim + cov + jitter() * 0.04;
      if (score > bestScore) {
        bestScore = score;
        best = c;
      }
    }
    if (!best) break;
    picks.push(best);
    pool = pool.filter((p) => p.id !== best.id);
  }
  return picks;
}

// Wild-card picks: random catalog orbs maximally different from the current
// picks. Provides exploration so the user doesn't get trapped on click 1.
function pickWildCards(pool, count, picks, sessionKey) {
  if (count <= 0 || pool.length === 0) return [];
  const rng = rngFromSeed(hashStr(`${sessionKey}-wild`));
  const out = [];
  let remaining = pool.filter((p) => !picks.find((q) => q.id === p.id));
  while (out.length < count && remaining.length > 0) {
    // Pick the candidate with lowest cosine similarity to existing picks
    let best = null;
    let bestScore = -Infinity;
    for (const c of remaining) {
      const ref = [...picks, ...out];
      const maxSim = ref.length === 0
        ? 0
        : Math.max(...ref.map((p) => cosineSim(c, p)));
      const score = (1 - maxSim) + rng() * 0.3;
      if (score > bestScore) {
        bestScore = score;
        best = c;
      }
    }
    if (!best) break;
    out.push(best);
    remaining = remaining.filter((p) => p.id !== best.id);
  }
  return out;
}

// Public: maximally diverse initial sample. Used for click 0 (the first
// 12 orbs the user sees). Pure diversity — no taste signal yet.
export function diverseSample(count) {
  return mmrPick(VIBES, count, buildTaste([]), LAMBDA[0], COVERAGE_MIN[0], `init-${Date.now()}`);
}

// ---------- Variant generation ----------

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
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp01 = (x) => Math.max(0, Math.min(1, x));

function flavorVariant(base, seedKey) {
  const rng = rngFromSeed(hashStr(seedKey));
  const palette = base.palette.map((rgb) => [
    clamp01(rgb[0] + (rng() - 0.5) * 0.25),
    clamp01(rgb[1] + (rng() - 0.5) * 0.25),
    clamp01(rgb[2] + (rng() - 0.5) * 0.25),
  ]);
  const grade = base.image
    ? {
        tint: [0.85 + rng() * 0.3, 0.85 + rng() * 0.3, 0.85 + rng() * 0.3],
        saturation: 0.78 + rng() * 0.55,
        hueShift: (rng() - 0.5) * 0.5,
        brightness: 0.88 + rng() * 0.25,
      }
    : null;
  const radius = Math.max(0.85, Math.min(1.2, base.radius + (rng() - 0.5) * 0.2));
  return {
    id: `${base.id}-flavor-${seedKey}`,
    image: base.image,
    painter: base.painter,
    color: base.color,
    style: base.style,
    genre: base.genre,
    palette,
    radius,
    grade,
  };
}

// Build the next cluster of `count` candidates after a click. `path` is the
// full sequence of clicked orbs (including the current focus). The taste
// vector is built from the path with recency decay; candidates are scored by
// MMR with depth-dependent λ; coverage and ε-greedy wild cards keep the user
// from getting trapped on their first click.
export function variantsOf(focus, count, sessionKey, depth = 1, path = []) {
  if (count <= 0) return [];

  const fullPath = [...path];
  if (focus && !fullPath.find((v) => v && v.id === focus.id)) {
    fullPath.push(focus);
  }

  const taste = buildTaste(fullPath);
  const lambda = LAMBDA[depth] ?? 0.6;
  const epsilon = EPSILON[depth] ?? 0;
  const minDistinct = COVERAGE_MIN[depth] ?? 1;

  const wildCount = Math.floor(count * epsilon);
  const mainCount = Math.max(0, count - wildCount);

  // Candidate pool: every catalog orb except the focus and previously-clicked.
  const seen = new Set(fullPath.map((v) => v && v.id).filter(Boolean));
  const pool = VIBES.filter((v) => !seen.has(v.id));

  // 1) Main MMR pick — relevance × diversity × coverage.
  const main = mmrPick(pool, mainCount, taste, lambda, minDistinct, sessionKey);

  // 2) Wild cards — random-ish catalog orbs far from the main picks.
  const wild = pickWildCards(pool, wildCount, main, sessionKey);

  let picks = [...main, ...wild];

  // 3) Last resort — fill any shortfall with flavor variants of the focus
  // (only if catalog runs out, which shouldn't happen with 50 orbs).
  let i = 0;
  while (picks.length < count) {
    picks.push(flavorVariant(focus, `${sessionKey}-${i++}`));
  }

  // 4) Shuffle so wild cards interleave with main picks.
  const rng = rngFromSeed(hashStr(`${sessionKey}-mix`));
  for (let k = picks.length - 1; k > 0; k--) {
    const j = Math.floor(rng() * (k + 1));
    [picks[k], picks[j]] = [picks[j], picks[k]];
  }

  return picks;
}

// Backwards-compat shim — kept for any older imports.
export function mutateVibe(base, seedKey) {
  return flavorVariant(base, seedKey);
}
