// Each VIBE has TWO key dimensions: `style` (art style) and `genre` (gameplay).
// The drill-down narrows on either or both — every variant after a click
// shares EITHER the clicked orb's style OR genre, so each click expresses
// "I want this look" or "I want this gameplay" without committing to both
// until later.
//
// 13 reference orbs (curated AI art). Each pairs an art style with a
// recognizable game genre.
export const VIBES = [
  {
    id: 'fantasy-rpg',
    image: '/orbs/fantasy.jpg',
    painter: 'fantasy',
    style: 'painterly',
    genre: 'rpg',
    palette: [[0.55, 0.85, 0.95], [0.85, 0.92, 0.78], [0.18, 0.22, 0.18]],
    radius: 1.2,
  },
  {
    id: 'anime-narrative',
    image: '/orbs/anime.jpg',
    painter: 'anime',
    style: 'anime',
    genre: 'narrative',
    palette: [[1.0, 0.7, 0.82], [0.45, 0.78, 1.0], [1.0, 0.96, 0.98]],
    radius: 1.1,
  },
  {
    id: 'pixel-adventure',
    image: '/orbs/pixel.jpg',
    painter: 'pixel',
    style: 'pixel',
    genre: 'adventure',
    palette: [[0.85, 0.55, 0.25], [0.55, 0.7, 0.4], [0.18, 0.22, 0.18]],
    radius: 1.0,
  },
  {
    id: 'pixel-platformer',
    image: '/orbs/pixel-side.jpg',
    painter: 'pixel',
    style: 'pixel',
    genre: 'platformer',
    palette: [[0.78, 0.6, 0.35], [0.6, 0.72, 0.55], [0.45, 0.4, 0.3]],
    radius: 1.0,
  },
  {
    id: 'pixel-racing',
    image: '/orbs/racing.jpg',
    painter: 'pixel',
    style: 'pixel',
    genre: 'racing',
    palette: [[0.85, 0.85, 0.85], [0.4, 0.7, 0.35], [0.2, 0.35, 0.18]],
    radius: 1.0,
  },
  {
    id: 'cellshaded-rpg',
    image: '/orbs/cellshaded.jpg',
    painter: 'cellshaded',
    style: 'cellshaded',
    genre: 'rpg',
    palette: [[0.6, 0.4, 0.85], [0.4, 0.85, 0.85], [0.95, 0.7, 0.4]],
    radius: 1.1,
  },
  {
    id: 'painterly-adventure',
    image: '/orbs/cozy.jpg',
    painter: 'cozy',
    style: 'painterly',
    genre: 'adventure',
    palette: [[0.95, 0.55, 0.4], [1.0, 0.78, 0.45], [0.35, 0.18, 0.45]],
    radius: 1.05,
  },
  {
    id: 'painterly-openworld',
    image: '/orbs/cosmic.jpg',
    painter: 'cosmichorror',
    style: 'painterly',
    genre: 'openworld',
    palette: [[1.0, 0.7, 0.3], [0.65, 0.5, 0.4], [0.18, 0.12, 0.1]],
    radius: 1.15,
  },
  {
    id: 'toon-platformer',
    image: '/orbs/platformer.jpg',
    painter: 'cellshaded',
    style: 'toon3d',
    genre: 'platformer',
    palette: [[1.0, 0.55, 0.4], [1.0, 0.85, 0.4], [0.45, 0.35, 0.85]],
    radius: 1.05,
  },
  {
    id: 'toon-strategy',
    image: '/orbs/battle.jpg',
    painter: 'cellshaded',
    style: 'toon3d',
    genre: 'strategy',
    palette: [[0.55, 0.7, 0.35], [0.65, 0.5, 0.3], [0.35, 0.25, 0.18]],
    radius: 1.1,
  },
  {
    id: 'photoreal-shooter',
    image: '/orbs/shooter.jpg',
    painter: 'fps',
    style: 'photoreal',
    genre: 'shooter',
    palette: [[0.65, 0.6, 0.55], [0.85, 0.78, 0.65], [0.18, 0.2, 0.22]],
    radius: 1.15,
  },
  {
    id: 'pastel-platformer',
    image: '/orbs/pastel.jpg',
    painter: 'cozy',
    style: 'pastel3d',
    genre: 'platformer',
    palette: [[1.0, 0.78, 0.85], [0.65, 0.85, 0.7], [0.4, 0.7, 1.0]],
    radius: 1.1,
  },
  {
    id: 'flatvector-arena',
    image: '/orbs/arena.jpg',
    painter: 'cosmichorror',
    style: 'flatvector',
    genre: 'arena',
    palette: [[1.0, 0.2, 0.65], [0.4, 0.95, 0.95], [0.18, 0.1, 0.3]],
    radius: 1.1,
  },
];

// Pretty labels for the final reveal.
export const STYLE_LABELS = {
  painterly: 'Painterly',
  anime: 'Anime',
  pixel: 'Pixel-art',
  cellshaded: 'Cell-shaded',
  toon3d: '3D Cartoon',
  photoreal: 'Photorealistic',
  pastel3d: 'Pastel 3D',
  flatvector: 'Flat Vector',
};
export const GENRE_LABELS = {
  rpg: 'RPG',
  narrative: 'Visual Novel',
  adventure: 'Adventure',
  platformer: 'Platformer',
  racing: 'Racing',
  openworld: 'Open World',
  strategy: 'Strategy',
  shooter: 'Shooter',
  arena: 'Arena Battler',
};

// ---------- Diverse initial pick ----------

// Greedy max-diversity sampler — pick `count` orbs that maximally differ from
// each other across (style, genre). The first orb is random; each subsequent
// orb is the catalog entry that maximizes total dimensional difference from
// the already-picked set.
export function diverseSample(count) {
  const picked = [];
  const remaining = [...VIBES];
  if (remaining.length === 0) return picked;
  const firstIdx = Math.floor(Math.random() * remaining.length);
  picked.push(remaining.splice(firstIdx, 1)[0]);
  while (picked.length < count && remaining.length > 0) {
    let bestScore = -1;
    let bestIdx = 0;
    for (let i = 0; i < remaining.length; i++) {
      const cand = remaining[i];
      let score = 0;
      for (const p of picked) {
        if (cand.style !== p.style) score += 1;
        if (cand.genre !== p.genre) score += 1;
      }
      // small random tiebreak so refresh feels fresh
      score += Math.random() * 0.5;
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

// Pick `count` orbs from `pool` that are maximally different along `alongDim`.
function diverseAlong(pool, count, alongDim, exclude = new Set()) {
  const out = [];
  const remaining = pool.filter((p) => !exclude.has(p.id));
  while (out.length < count && remaining.length > 0) {
    if (out.length === 0) {
      const idx = Math.floor(Math.random() * remaining.length);
      out.push(remaining.splice(idx, 1)[0]);
      continue;
    }
    let bestScore = -1;
    let bestIdx = 0;
    for (let i = 0; i < remaining.length; i++) {
      const cand = remaining[i];
      let score = 0;
      for (const p of out) {
        if (cand[alongDim] !== p[alongDim]) score += 1;
      }
      score += Math.random() * 0.3;
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }
    out.push(remaining.splice(bestIdx, 1)[0]);
  }
  return out;
}

// Build a flavor-only variant of `base` (palette + grade shift, same image).
function flavorVariant(base, seedKey) {
  const rng = rngFromSeed(hashStr(seedKey));
  const palette = base.palette.map((rgb) => [
    clamp01(rgb[0] + (rng() - 0.5) * 0.25),
    clamp01(rgb[1] + (rng() - 0.5) * 0.25),
    clamp01(rgb[2] + (rng() - 0.5) * 0.25),
  ]);
  const grade = base.image
    ? {
        tint: [
          0.85 + rng() * 0.3,
          0.85 + rng() * 0.3,
          0.85 + rng() * 0.3,
        ],
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
    style: base.style,
    genre: base.genre,
    palette,
    radius,
    grade,
  };
}

// Generate `count` variants for the next cluster after the user clicked `base`.
// Strategy:
//   depth 1 (after first click) — split between same-style-different-genre and
//                                  same-genre-different-style catalog orbs
//   depth 2 (after second click) — prefer same-both, then mix; tighter convergence
// Catalog match shortfalls are filled with flavor variants of the focus.
export function variantsOf(base, count, sessionKey, depth = 1) {
  if (count <= 0) return [];

  const exclude = new Set([base.id]);
  const sameStyle = VIBES.filter((v) => v.style === base.style && v.id !== base.id);
  const sameGenre = VIBES.filter((v) => v.genre === base.genre && v.id !== base.id);
  const sameBoth = VIBES.filter(
    (v) => v.style === base.style && v.genre === base.genre && v.id !== base.id
  );

  const picks = [];

  if (depth === 1) {
    // ~half style-shared (varied by genre), ~half genre-shared (varied by style)
    const styleQuota = Math.ceil(count / 2);
    const genreQuota = count - styleQuota;
    const stylePicks = diverseAlong(sameStyle, styleQuota, 'genre', exclude);
    stylePicks.forEach((p) => exclude.add(p.id));
    const genrePicks = diverseAlong(sameGenre, genreQuota, 'style', exclude);
    genrePicks.forEach((p) => exclude.add(p.id));
    picks.push(...stylePicks, ...genrePicks);
  } else {
    // Depth 2+: prefer overlap on both dims, then style-shared, then genre-shared
    const bothPicks = sameBoth.slice(0, count);
    bothPicks.forEach((p) => exclude.add(p.id));
    picks.push(...bothPicks);
    const remaining = count - picks.length;
    if (remaining > 0) {
      const split = Math.ceil(remaining / 2);
      const stylePicks = diverseAlong(sameStyle, split, 'genre', exclude);
      stylePicks.forEach((p) => exclude.add(p.id));
      const genrePicks = diverseAlong(
        sameGenre,
        remaining - stylePicks.length,
        'style',
        exclude
      );
      genrePicks.forEach((p) => exclude.add(p.id));
      picks.push(...stylePicks, ...genrePicks);
    }
  }

  // Fill any shortfall with flavor variants of the base
  let flavorIdx = 0;
  while (picks.length < count) {
    picks.push(flavorVariant(base, `${sessionKey}-${flavorIdx++}`));
  }

  // Shuffle so style-shared and genre-shared interleave
  const rng = rngFromSeed(hashStr(`${sessionKey}-shuffle`));
  for (let i = picks.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [picks[i], picks[j]] = [picks[j], picks[i]];
  }

  return picks;
}

// Backwards-compat shim — used by initial-cluster code.
export function similarity(a, b) {
  if (!a || !b || a.id === b.id) return -1;
  return (a.style === b.style ? 1 : 0) + (a.genre === b.genre ? 1 : 0);
}

// Backwards-compat shim — kept for any older callers; just returns flavor variant.
export function mutateVibe(base, seedKey) {
  return flavorVariant(base, seedKey);
}
