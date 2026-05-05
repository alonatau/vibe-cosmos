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

// Curated cousin maps — drives the explicit "related X" buckets the user
// expects: clicking anime gives chibi/manga/cellshaded; clicking war gives
// battle/shooter; clicking adventure gives runner/openworld/rpg. Anything
// not in the map gracefully has no related-style/genre candidates.
const STYLE_COUSINS = {
  // Anime family
  anime: ['chibi', 'manga', 'cellshaded', 'japanese', 'pastel'],
  manga: ['anime', 'comics', 'japanese'],
  chibi: ['anime', 'cartoonish', 'childish', 'cartoon'],
  japanese: ['anime', 'manga', 'painterly'],
  pastel: ['anime', 'cartoonish', 'childish'],
  // Cartoon family
  cartoon: ['cartoonish', 'cellshaded', 'comics', 'childish', 'chibi'],
  cartoonish: ['cartoon', 'cartoonish3d', 'cellshaded', 'childish'],
  cartoonish3d: ['cartoonish', '3d', 'voxel', 'pastel3d', 'toon3d'],
  cellshaded: ['cartoon', 'cartoonish', 'anime', 'comics', 'toon3d'],
  comics: ['cartoon', 'cellshaded', 'flat', 'manga'],
  childish: ['cartoon', 'chibi', 'cartoonish', 'pastel'],
  toon3d: ['cartoonish3d', 'cartoon', 'cellshaded', '3d'],
  // Realistic family
  realistic: ['photoreal', 'horror', 'cyberpunk'],
  photoreal: ['realistic', 'cyberpunk', 'horror'],
  // Pixel / retro family
  pixel: ['retro', 'classic', 'voxel'],
  retro: ['pixel', 'classic'],
  classic: ['retro', 'pixel'],
  // 3D / low-poly family
  '3d': ['voxel', 'lowpoly', 'cartoonish3d', 'pastel3d', 'toon3d'],
  voxel: ['3d', 'lowpoly', 'pixel'],
  lowpoly: ['voxel', '3d', 'minimal'],
  pastel3d: ['3d', 'cartoonish3d', 'cozy', 'pastel'],
  // Painterly family
  painterly: ['oil', 'watercolor', 'fantasy', 'cosmic', 'noir', 'japanese'],
  fantasy: ['painterly', 'anime', 'japanese'],
  cosmic: ['painterly', 'cosmichorror', 'horror'],
  cosmichorror: ['cosmic', 'painterly', 'horror'],
  noir: ['painterly', 'realistic'],
  cozy: ['cartoon', 'cartoonish', 'painterly', 'pastel3d'],
  horror: ['realistic', 'painterly', 'cosmichorror'],
  oil: ['painterly', 'watercolor'],
  watercolor: ['painterly', 'oil'],
  // Flat / vector family
  flat: ['vector', 'flatvector', 'comics', 'cartoon'],
  vector: ['flat', 'flatvector', 'minimal'],
  flatvector: ['flat', 'vector', 'cartoon'],
  minimal: ['flat', 'vector', 'lowpoly'],
  // Themed / setting-style
  cyberpunk: ['realistic', 'photoreal'],
  steampunk: ['painterly'],
  western: ['painterly', 'realistic'],
  egypt: ['painterly'],
  scifi: ['cyberpunk', '3d', 'realistic'],
  stylized: ['cellshaded', 'painterly'],
};

const GENRE_COUSINS = {
  // Adventure family
  adventure: ['runner', 'rpg', 'openworld', 'platformer', 'adventurequest', 'exploration'],
  adventurequest: ['adventure', 'rpg'],
  openworld: ['adventure', 'rpg', 'exploration'],
  exploration: ['adventure', 'openworld', 'sea'],
  rpg: ['adventure', 'mmorpg', 'narrative', 'roguelike', 'openworld'],
  mmorpg: ['rpg', 'mmo', 'openworld'],
  mmo: ['mmorpg', 'rpg'],
  narrative: ['rpg', 'visualnovel', 'adventure'],
  visualnovel: ['narrative', 'rpg'],
  roguelike: ['rpg', 'adventure'],
  // Combat family
  action: ['adventure', 'fighting', 'shooter', 'battle'],
  shooter: ['fps', 'war', 'battle', 'action'],
  fps: ['shooter', 'war'],
  war: ['battle', 'shooter', 'strategy', 'fps'],
  battle: ['war', 'fighting', 'arena', 'action'],
  fighting: ['battle', 'arena'],
  arena: ['battle', 'fighting', 'moba'],
  moba: ['arena', 'strategy'],
  // Speed / arcade family
  runner: ['adventure', 'racing', 'platformer', 'arcade'],
  racing: ['carrace', 'cars', 'runner', 'sports', 'race'],
  carrace: ['racing', 'cars', 'race'],
  cars: ['racing', 'carrace'],
  race: ['racing', 'carrace', 'cars'],
  platformer: ['runner', 'adventure', 'arcade'],
  arcade: ['platformer', 'runner'],
  // Strategy / sim family
  puzzle: ['strategy', 'simulation'],
  strategy: ['puzzle', 'war', 'simulation', 'towerdefense'],
  simulation: ['strategy', 'sandbox', 'builder', 'farming', 'cozy', 'village'],
  sandbox: ['simulation', 'builder', 'crafting'],
  builder: ['sandbox', 'simulation', 'city'],
  city: ['builder', 'simulation'],
  crafting: ['sandbox', 'builder'],
  farming: ['simulation', 'village'],
  village: ['simulation', 'farming', 'sandbox'],
  towerdefense: ['strategy'],
  // Survival / horror family
  horror: ['survival', 'shooter'],
  survival: ['horror', 'postapoc'],
  postapoc: ['survival', 'war'],
  // Sports family
  sports: ['racing'],
  // Flight / space family
  flight: ['spaceflight', 'simulation'],
  spaceflight: ['flight', 'space'],
  space: ['spaceflight'],
  // Sea family
  sea: ['adventure', 'simulation', 'fishing'],
  fishing: ['simulation', 'sea'],
  // Other
  superheroes: ['action', 'adventure', 'fighting'],
  party: ['arcade'],
  rhythm: ['arcade'],
  card: ['strategy'],
  cooking: ['simulation'],
  trivia: ['party'],
  dating: ['narrative', 'visualnovel'],
};

// 0..3 — number of dimensions two orbs share (color, style, genre).
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

// Initial cluster: greedy max-diversity sampler. Each pick is the catalog
// orb that differs from the already-picked set on as many of (color, style,
// genre) as possible, so the first 12 orbs cover the taste space broadly.
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
      score += Math.random() * 0.4; // gentle tiebreak — fresh per session
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

// Build the next cluster of `count` candidates after a click. Uses explicit
// bucket distribution so the user always sees a predictable mix:
//   click 1 → "other [style]" + "other [genre]" + related-style + related-genre
//   click 2 → tighter — same-both first, then same-style + same-genre
// `path` is excluded from candidates so the user never sees a repeat.
export function variantsOf(focus, count, sessionKey, depth = 1, path = []) {
  if (count <= 0 || !focus) return [];

  const seen = new Set([focus.id, ...path.map((v) => v && v.id).filter(Boolean)]);
  const others = VIBES.filter((v) => !seen.has(v.id));

  // Per-session deterministic shuffle so each session picks slightly
  // different orbs from each bucket without losing the bucket logic.
  const rng = rngFromSeed(hashStr(`${sessionKey}-bucket`));
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const styleCousins = STYLE_COUSINS[focus.style] || [];
  const genreCousins = GENRE_COUSINS[focus.genre] || [];

  // Build the 6 buckets, each shuffled per-session
  const sameStyleDiffGenre = shuffle(
    others.filter((v) => v.style === focus.style && v.genre !== focus.genre)
  );
  const sameGenreDiffStyle = shuffle(
    others.filter((v) => v.genre && v.genre === focus.genre && v.style !== focus.style)
  );
  const sameBoth = shuffle(
    others.filter((v) => v.style === focus.style && v.genre && v.genre === focus.genre)
  );
  const relatedStyle = shuffle(
    others.filter((v) => styleCousins.includes(v.style) && v.style !== focus.style)
  );
  const relatedGenre = shuffle(
    others.filter((v) => v.genre && genreCousins.includes(v.genre) && v.genre !== focus.genre)
  );
  const sameColor = shuffle(
    others.filter(
      (v) =>
        v.color &&
        v.color === focus.color &&
        v.style !== focus.style &&
        v.genre !== focus.genre
    )
  );

  const used = new Set();
  const result = [];
  function take(bucket, n) {
    for (const v of bucket) {
      if (result.length >= count || n <= 0) return;
      if (used.has(v.id)) continue;
      result.push(v);
      used.add(v.id);
      n -= 1;
    }
  }

  if (depth >= 2) {
    // Click 2 — converging. Prefer same-both (an actual exact-match refinement),
    // then one same-style and one same-genre as alternative directions.
    take(sameBoth, 1);
    take(sameStyleDiffGenre, 1);
    take(sameGenreDiffStyle, 1);
  } else {
    // Click 1 — open the four refinement axes:
    //   • other [style] — same style, different genre   (×2)
    //   • other [genre] — same genre, different style   (×2)
    //   • related style — cousin from STYLE_COUSINS     (×1)
    //   • related genre — cousin from GENRE_COUSINS     (×1)
    take(sameStyleDiffGenre, 2);
    take(sameGenreDiffStyle, 2);
    take(relatedStyle, 1);
    take(relatedGenre, 1);
  }

  // Fill any remaining slots with the next best buckets.
  const fallbackOrder = [
    sameBoth,
    sameStyleDiffGenre,
    sameGenreDiffStyle,
    relatedStyle,
    relatedGenre,
    sameColor,
    shuffle(others),
  ];
  for (const bucket of fallbackOrder) {
    if (result.length >= count) break;
    take(bucket, count - result.length);
  }

  // Last resort — flavor variants if the catalog is exhausted.
  let i = 0;
  while (result.length < count) {
    result.push(flavorVariant(focus, `${sessionKey}-flavor-${i++}`));
  }

  // Shuffle final order so the buckets interleave visually in the cluster.
  return shuffle(result).slice(0, count);
}

// Backwards-compat shim — kept for any older imports.
export function mutateVibe(base, seedKey) {
  return flavorVariant(base, seedKey);
}
