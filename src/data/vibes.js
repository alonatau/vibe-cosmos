// Each stimulus = a clearly identifiable game-genre archetype. Visuals (shader
// `mode` + palette) are picked to evoke the genre instantly, so a user can
// scan the cluster and recognise "that one's the runner, that one's the FPS,
// that one's adventure". Tags drive the drill-down + final game recipe.
//
// Modes 0–15: aesthetic (sakura, lava, fog, aurora, chrome, neon-grid, cosmic,
// noir-rain, CRT, rust, ash, golden-hour, rose, panels, torch, forest).
// Modes 16–23: genre-specific (runner streaks, puzzle tiles, platformer dots,
// sports stadium, strategy map, adventure landscape, stealth shadow, fighting
// arena).
// Each VIBE is one game-genre archetype. `painter` selects the canvas painter
// that draws the orb's surface in that art-style + game-scene combination.
// Palette tints the painter's output so variants look distinct while sharing
// the same visual language.
export const VIBES = [
  // ---------- Action / Adventure ----------
  { id: 'adventure', painter: 'landscape', palette: [[0.95, 0.65, 0.35], [0.45, 0.7, 0.95], [0.25, 0.45, 0.3]], radius: 1.2,
    tags: { genre: ['adventure'], style: ['painterly', 'stylized'], mood: ['epic', 'mysterious'], setting: ['fantasy', 'wilderness'] } },
  { id: 'fantasy-rpg', painter: 'fantasy', palette: [[0.4, 0.95, 0.6], [0.95, 0.85, 0.55], [0.05, 0.15, 0.1]], radius: 1.25,
    tags: { genre: ['rpg', 'adventure'], style: ['painterly'], mood: ['epic', 'magical'], setting: ['fantasy'] } },
  { id: 'soulslike', painter: 'soulslike', palette: [[0.95, 0.45, 0.15], [0.7, 0.55, 0.4], [0.06, 0.05, 0.06]], radius: 1.2,
    tags: { genre: ['action', 'rpg'], style: ['photoreal', 'gritty'], mood: ['dark', 'epic', 'tense'], setting: ['darkfantasy'] } },
  { id: 'open-world', painter: 'landscape', palette: [[0.55, 0.85, 0.45], [0.35, 0.55, 0.95], [0.15, 0.3, 0.18]], radius: 1.2,
    tags: { genre: ['adventure', 'rpg'], style: ['photoreal'], mood: ['epic', 'chill'], setting: ['fantasy', 'wilderness'] } },
  { id: 'stealth-action', painter: 'stealth', palette: [[0.95, 0.85, 0.45], [0.45, 0.55, 0.7], [0.04, 0.05, 0.08]], radius: 1.0,
    tags: { genre: ['action', 'stealth'], style: ['photoreal', 'cellshaded'], mood: ['tense', 'dark'], setting: ['modern', 'cyberpunk'] } },

  // ---------- Anime / JRPG / Visual Novel ----------
  { id: 'anime-rpg', painter: 'anime', palette: [[1.0, 0.7, 0.85], [0.85, 0.92, 1.0], [1.0, 0.96, 0.98]], radius: 1.1,
    tags: { genre: ['rpg'], style: ['anime'], mood: ['cozy', 'whimsical'], setting: ['fantasy'] } },
  { id: 'jrpg', painter: 'fantasy', palette: [[1.0, 0.78, 0.35], [0.95, 0.55, 0.75], [0.4, 0.25, 0.55]], radius: 1.05,
    tags: { genre: ['rpg', 'turnbased'], style: ['anime'], mood: ['epic', 'whimsical'], setting: ['fantasy'] } },
  { id: 'visual-novel', painter: 'visualnovel', palette: [[1.0, 0.7, 0.82], [0.95, 0.6, 0.75], [0.65, 0.4, 0.55]], radius: 0.9,
    tags: { genre: ['visualnovel', 'narrative'], style: ['anime', 'painterly'], mood: ['romantic', 'melancholic'], setting: ['modern', 'fantasy'] } },
  { id: 'mecha', painter: 'mecha', palette: [[0.95, 0.45, 0.15], [0.6, 0.7, 0.85], [0.1, 0.12, 0.18]], radius: 1.15,
    tags: { genre: ['action', 'shooter'], style: ['anime', 'cellshaded'], mood: ['intense', 'kinetic'], setting: ['scifi', 'mecha'] } },

  // ---------- Shooters / Combat ----------
  { id: 'fps', painter: 'fps', palette: [[1.0, 0.2, 0.1], [0.5, 0.3, 0.25], [0.05, 0.04, 0.04]], radius: 1.2,
    tags: { genre: ['fps', 'shooter', 'action'], style: ['photoreal', 'gritty'], mood: ['intense', 'dark', 'kinetic'], setting: ['modern', 'horror'] } },
  { id: 'tactical-shooter', painter: 'tactical', palette: [[0.45, 0.85, 0.45], [0.65, 0.95, 0.55], [0.05, 0.1, 0.06]], radius: 1.05,
    tags: { genre: ['shooter', 'action'], style: ['photoreal'], mood: ['tense', 'kinetic'], setting: ['modern', 'military'] } },
  { id: 'arena-fighter', painter: 'fighting', palette: [[1.0, 0.35, 0.15], [1.0, 0.85, 0.3], [0.18, 0.08, 0.12]], radius: 1.1,
    tags: { genre: ['fighting', 'action'], style: ['cellshaded', 'anime'], mood: ['intense', 'kinetic'], setting: ['arena', 'modern'] } },

  // ---------- Speed / Arcade ----------
  { id: 'endless-runner', painter: 'runner', palette: [[0.4, 0.9, 1.0], [1.0, 0.85, 0.3], [0.05, 0.1, 0.18]], radius: 1.0,
    tags: { genre: ['runner', 'arcade'], style: ['cartoon', 'cellshaded'], mood: ['kinetic', 'bright'], setting: ['arcade', 'modern'] } },
  { id: 'racing', painter: 'racing', palette: [[1.0, 0.55, 0.1], [1.0, 0.95, 0.3], [0.4, 0.5, 0.3]], radius: 1.0,
    tags: { genre: ['racing', 'arcade'], style: ['photoreal', 'cellshaded'], mood: ['intense', 'kinetic'], setting: ['modern', 'arcade'] } },
  { id: 'platformer', painter: 'platformer', palette: [[1.0, 0.4, 0.45], [0.4, 0.8, 1.0], [0.95, 0.85, 0.2]], radius: 0.95,
    tags: { genre: ['platformer'], style: ['cartoon', 'cellshaded'], mood: ['bright', 'whimsical', 'kinetic'], setting: ['arcade', 'fantasy'] } },
  { id: 'retro-arcade', painter: 'pixel', palette: [[0.3, 1.0, 0.4], [1.0, 0.85, 0.2], [0.0, 0.1, 0.0]], radius: 0.85,
    tags: { genre: ['arcade', 'platformer'], style: ['pixel', 'retro'], mood: ['whimsical', 'kinetic'], setting: ['arcade'] } },

  // ---------- Puzzle / Strategy ----------
  { id: 'puzzle', painter: 'puzzle', palette: [[0.45, 0.85, 1.0], [1.0, 0.7, 0.45], [0.95, 0.55, 0.65]], radius: 0.9,
    tags: { genre: ['puzzle'], style: ['minimal', 'lowpoly'], mood: ['chill', 'mysterious'], setting: ['abstract'] } },
  { id: 'strategy', painter: 'strategy', palette: [[0.55, 0.85, 0.5], [0.85, 0.7, 0.4], [0.4, 0.6, 0.85]], radius: 1.1,
    tags: { genre: ['strategy', 'simulation'], style: ['lowpoly', 'painterly'], mood: ['epic', 'chill'], setting: ['fantasy', 'historical'] } },
  { id: 'sandbox-builder', painter: 'voxel', palette: [[0.55, 0.85, 0.5], [0.85, 0.65, 0.45], [0.35, 0.45, 0.25]], radius: 1.05,
    tags: { genre: ['simulation', 'sandbox'], style: ['lowpoly', 'cartoon'], mood: ['chill', 'whimsical'], setting: ['modern', 'fantasy'] } },

  // ---------- Sci-fi / Cyberpunk ----------
  { id: 'scifi-exploration', painter: 'scifi', palette: [[0.5, 0.75, 1.0], [0.85, 0.6, 0.95], [0.02, 0.03, 0.1]], radius: 1.1,
    tags: { genre: ['adventure', 'puzzle'], style: ['lowpoly', 'minimal'], mood: ['mysterious', 'chill'], setting: ['scifi', 'space'] } },
  { id: 'cyberpunk', painter: 'cyberpunk', palette: [[1.0, 0.15, 0.7], [0.2, 0.95, 0.95], [0.08, 0.02, 0.15]], radius: 1.15,
    tags: { genre: ['rpg', 'action'], style: ['cellshaded'], mood: ['intense', 'dark'], setting: ['cyberpunk'] } },
  { id: 'space-sim', painter: 'scifi', palette: [[0.85, 0.65, 0.95], [0.6, 0.85, 1.0], [0.0, 0.0, 0.06]], radius: 1.1,
    tags: { genre: ['simulation', 'adventure'], style: ['photoreal', 'minimal'], mood: ['chill', 'mysterious'], setting: ['space', 'scifi'] } },

  // ---------- Horror / Dark ----------
  { id: 'horror-survival', painter: 'horror', palette: [[1.0, 0.18, 0.18], [0.55, 0.1, 0.12], [0.04, 0.03, 0.04]], radius: 1.05,
    tags: { genre: ['horror', 'survival'], style: ['photoreal'], mood: ['dark', 'tense'], setting: ['modern'] } },
  { id: 'cosmic-horror', painter: 'cosmichorror', palette: [[0.5, 0.85, 0.55], [0.45, 0.15, 0.55], [0.05, 0.0, 0.12]], radius: 1.15,
    tags: { genre: ['horror', 'narrative'], style: ['painterly', 'abstract'], mood: ['mysterious', 'dark'], setting: ['cosmic', 'surreal'] } },
  { id: 'noir-mystery', painter: 'noir', palette: [[0.85, 0.85, 0.95], [1.0, 0.55, 0.45], [0.05, 0.06, 0.1]], radius: 0.95,
    tags: { genre: ['narrative', 'adventure'], style: ['cellshaded', 'stylized'], mood: ['mysterious', 'melancholic'], setting: ['noir', 'modern'] } },

  // ---------- Survival / Sim ----------
  { id: 'survival', painter: 'survival', palette: [[0.4, 0.65, 0.4], [0.65, 0.5, 0.3], [0.05, 0.1, 0.08]], radius: 1.05,
    tags: { genre: ['survival', 'simulation'], style: ['photoreal', 'lowpoly'], mood: ['chill', 'tense'], setting: ['wilderness'] } },
  { id: 'cozy-sim', painter: 'cozy', palette: [[0.65, 0.85, 0.55], [1.0, 0.85, 0.6], [0.85, 0.55, 0.45]], radius: 1.0,
    tags: { genre: ['simulation', 'rpg'], style: ['cartoon', 'lowpoly'], mood: ['cozy', 'chill', 'whimsical'], setting: ['pastoral', 'fantasy'] } },
  { id: 'postapoc', painter: 'postapoc', palette: [[0.85, 0.55, 0.3], [0.65, 0.5, 0.35], [0.18, 0.13, 0.1]], radius: 1.1,
    tags: { genre: ['survival', 'action'], style: ['photoreal', 'gritty'], mood: ['dark', 'tense'], setting: ['postapoc'] } },

  // ---------- Roguelike / Sports / MMO ----------
  { id: 'roguelike', painter: 'roguelike', palette: [[0.95, 0.55, 0.2], [0.5, 0.3, 0.2], [0.1, 0.07, 0.06]], radius: 1.0,
    tags: { genre: ['roguelike', 'action'], style: ['pixel', 'painterly'], mood: ['dark', 'tense', 'kinetic'], setting: ['darkfantasy', 'fantasy'] } },
  { id: 'sports', painter: 'sports', palette: [[0.95, 0.85, 0.3], [0.3, 0.85, 0.45], [0.4, 0.55, 0.85]], radius: 1.05,
    tags: { genre: ['sports'], style: ['photoreal', 'cellshaded'], mood: ['intense', 'kinetic', 'bright'], setting: ['arena', 'modern'] } },
  { id: 'mmorpg', painter: 'fantasy', palette: [[0.7, 0.5, 0.95], [0.95, 0.7, 0.4], [0.1, 0.1, 0.2]], radius: 1.2,
    tags: { genre: ['rpg', 'mmo'], style: ['painterly', 'cellshaded'], mood: ['epic', 'whimsical'], setting: ['fantasy'] } },
];

// ---------- Tag-similarity & variant generation ----------

function tagOverlap(a, b) {
  let total = 0;
  for (const dim of ['genre', 'style', 'mood', 'setting']) {
    const setA = new Set(a.tags?.[dim] || []);
    for (const t of b.tags?.[dim] || []) if (setA.has(t)) total += 1;
  }
  return total;
}

export function similarity(a, b) {
  if (a.id === b.id) return -1;
  return tagOverlap(a, b);
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

// Top-N catalog stimuli ranked by tag overlap with the base.
function topCousins(base, n = 6) {
  return VIBES.filter((v) => v.id !== base.id)
    .map((v) => ({ v, s: similarity(base, v) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((x) => x.v);
}

// Variant strategy. Crucial design: ALWAYS preserve at least one tag from the
// base's PRIMARY genre — so drilling down into "fps" never gives variants that
// aren't FPS-flavored. The cluster always stays in the chosen game family.
export function mutateVibe(base, seedKey, intensity = 0.25, strategy = 'mixed') {
  const rng = rngFromSeed(hashStr(seedKey));

  let paletteFactor;
  let modeSwapChance;
  if (strategy === 'color') {
    paletteFactor = 1.4;
    modeSwapChance = 0;
  } else if (strategy === 'pattern') {
    paletteFactor = 0.22;
    modeSwapChance = 1.0;
  } else {
    paletteFactor = 0.7;
    modeSwapChance = 0.25;
  }

  const palette = base.palette.map((rgb) => [
    clamp01(rgb[0] + (rng() - 0.5) * intensity * paletteFactor),
    clamp01(rgb[1] + (rng() - 0.5) * intensity * paletteFactor),
    clamp01(rgb[2] + (rng() - 0.5) * intensity * paletteFactor),
  ]);

  let painter = base.painter;
  let tags = {
    genre: [...(base.tags?.genre || [])],
    style: [...(base.tags?.style || [])],
    mood: [...(base.tags?.mood || [])],
    setting: [...(base.tags?.setting || [])],
  };

  if (rng() < modeSwapChance) {
    const cousins = topCousins(base, 6);
    if (cousins.length) {
      const picked = cousins[Math.floor(rng() * cousins.length)];
      painter = picked.painter;
      const dims = ['style', 'mood', 'setting'];
      const dim = dims[Math.floor(rng() * dims.length)];
      const cousinTags = picked.tags?.[dim] || [];
      if (cousinTags.length) {
        const newTag = cousinTags[Math.floor(rng() * cousinTags.length)];
        if (!tags[dim].includes(newTag)) {
          tags[dim] = [newTag, ...tags[dim].slice(0, -1)];
        }
      }
    }
  }

  const radius = Math.max(
    0.85,
    Math.min(1.2, base.radius + (rng() - 0.5) * 0.25)
  );

  return {
    id: `${base.id}-v-${seedKey}-${strategy}`,
    painter,
    palette,
    tags,
    radius,
  };
}

// After a click, the cluster narrows toward RELATED-BUT-DIFFERENT game types,
// not palette clones of the focus. ~70% of variants are top-cousins from the
// catalog (each keeping its own icon + identity) and ~30% are flavor variants
// of the focus itself (same icon, palette-shifted) so the user sees the chosen
// genre alongside related options.
export function variantsOf(base, count, sessionKey, depth = 1) {
  const out = [];
  const rng = rngFromSeed(hashStr(`${sessionKey}-mix`));
  const similarityScale = Math.pow(0.85, Math.max(0, depth - 1));
  const cousins = topCousins(base, Math.max(count + 4, 12));

  const cousinCount = Math.min(cousins.length, Math.max(2, Math.floor(count * 0.7)));
  const flavorCount = count - cousinCount;

  // Cousin variants — different game types in the focus's tag neighbourhood.
  // Each keeps its own catalog icon/label/mode/tags; only palette is gently
  // nudged so the cluster feels coherent rather than a catalog dump.
  for (let i = 0; i < cousinCount; i++) {
    const cousin = cousins[i];
    const cousinIntensity = 0.16 * similarityScale;
    out.push(
      mutateVibe(cousin, `${sessionKey}-cousin-${i}`, cousinIntensity, 'color')
    );
  }

  // Flavor variants — same game family as focus (same icon), palette-shifted
  // so the user has options to refine WITHIN the focus genre too.
  for (let i = 0; i < flavorCount; i++) {
    const ramp = flavorCount <= 1 ? 0 : i / (flavorCount - 1);
    const intensity = (0.28 + ramp * 0.25) * similarityScale + (rng() - 0.5) * 0.08;
    out.push(
      mutateVibe(base, `${sessionKey}-flavor-${i}`, Math.max(0.1, intensity), 'color')
    );
  }

  // Shuffle so cousins and flavors interleave in the cluster
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }

  return out;
}
