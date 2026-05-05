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

// ---------- Diversity + similarity ----------

// Number of dimensions shared between two orbs (color, style, genre).
function sharedDims(a, b) {
  if (!a || !b || a.id === b.id) return 0;
  let s = 0;
  if (a.color && a.color === b.color) s += 1;
  if (a.style && a.style === b.style) s += 1;
  if (a.genre && a.genre === b.genre) s += 1;
  return s;
}

export function similarity(a, b) {
  if (!a || !b || a.id === b.id) return -1;
  return sharedDims(a, b);
}

// Greedy max-diversity sampler — pick `count` orbs maximizing mutual
// dimensional difference across (color, style, genre).
export function diverseSample(count) {
  const picked = [];
  const remaining = [...VIBES];
  if (remaining.length === 0) return picked;
  picked.push(remaining.splice(Math.floor(Math.random() * remaining.length), 1)[0]);
  while (picked.length < count && remaining.length > 0) {
    let bestScore = -1;
    let bestIdx = 0;
    for (let i = 0; i < remaining.length; i++) {
      const cand = remaining[i];
      let score = 0;
      for (const p of picked) {
        if (cand.color !== p.color) score += 1;
        if (cand.style !== p.style) score += 1;
        if (cand.genre !== p.genre) score += 1;
      }
      score += Math.random() * 0.4; // gentle tiebreak so refresh feels fresh
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }
    picked.push(remaining.splice(bestIdx, 1)[0]);
  }
  return picked;
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

// Pick `count` orbs from `pool` that maximally differ from each other along
// `varyDim` (color/style/genre) and aren't already picked.
function diverseAlong(pool, count, varyDim, exclude) {
  const out = [];
  const remaining = pool.filter((p) => !exclude.has(p.id));
  while (out.length < count && remaining.length > 0) {
    if (out.length === 0) {
      const idx = Math.floor(Math.random() * remaining.length);
      out.push(remaining.splice(idx, 1)[0]);
      continue;
    }
    let best = -1;
    let bestIdx = 0;
    for (let i = 0; i < remaining.length; i++) {
      const cand = remaining[i];
      let score = 0;
      for (const p of out) {
        if (cand[varyDim] !== p[varyDim]) score += 1;
      }
      score += Math.random() * 0.3;
      if (score > best) {
        best = score;
        bestIdx = i;
      }
    }
    out.push(remaining.splice(bestIdx, 1)[0]);
  }
  return out;
}

// Build the next cluster after a click. Variants share ANY of the focus's
// non-null dimensions. Depth controls how tight the matches are.
//
//   depth 1 — first click → spread across same-color, same-style, same-genre
//             buckets so the user sees real options on each axis
//   depth 2 — second click → prefer high-overlap matches (2-3 shared dims)
export function variantsOf(base, count, sessionKey, depth = 1) {
  if (count <= 0) return [];

  const others = VIBES.filter((v) => v.id !== base.id);
  const sameColor  = base.color  ? others.filter((v) => v.color  === base.color)  : [];
  const sameStyle  = base.style  ? others.filter((v) => v.style  === base.style)  : [];
  const sameGenre  = base.genre  ? others.filter((v) => v.genre  === base.genre)  : [];
  const sameTwoOrMore = others.filter((v) => sharedDims(v, base) >= 2);

  const exclude = new Set([base.id]);
  const picks = [];

  if (depth === 1) {
    // 1-2 high-overlap matches up front, then balanced single-axis siblings.
    const overlapQuota = Math.min(2, sameTwoOrMore.length, Math.max(1, Math.floor(count * 0.3)));
    const overlap = sameTwoOrMore.slice(0, overlapQuota);
    overlap.forEach((p) => exclude.add(p.id));
    picks.push(...overlap);

    // Distribute remaining across color/style/genre buckets evenly.
    const dims = [
      { name: 'style',  pool: sameStyle,  vary: 'genre' },
      { name: 'genre',  pool: sameGenre,  vary: 'style' },
      { name: 'color',  pool: sameColor,  vary: 'style' },
    ].filter((d) => d.pool.length > 0);

    let remaining = count - picks.length;
    for (let pass = 0; pass < 3 && remaining > 0; pass++) {
      const slotsPerDim = Math.ceil(remaining / dims.length);
      for (const d of dims) {
        if (remaining <= 0) break;
        const wanted = Math.min(slotsPerDim, remaining);
        const got = diverseAlong(d.pool, wanted, d.vary, exclude);
        got.forEach((p) => exclude.add(p.id));
        picks.push(...got);
        remaining = count - picks.length;
      }
    }
  } else {
    // Depth 2+: prioritise high-overlap matches.
    const ranked = others
      .map((v) => ({ v, s: sharedDims(v, base) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s);
    for (const { v } of ranked) {
      if (picks.length >= count) break;
      if (!exclude.has(v.id)) {
        picks.push(v);
        exclude.add(v.id);
      }
    }
  }

  // Fill any shortfall with flavor variants of the focus.
  let i = 0;
  while (picks.length < count) {
    picks.push(flavorVariant(base, `${sessionKey}-${i++}`));
  }

  // Shuffle so different shared-dim buckets interleave.
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
