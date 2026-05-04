// Each stimulus is a game-flavor vibe. Visual style (shader `mode` + palette)
// + tag profile across four dimensions (genre, style, mood, setting). The
// drill-down narrows toward a specific blend so the platform can decide what
// kind of game to generate. Tags are designed so combinations are legible:
// "Cozy Anime Fantasy RPG" or "Dark Cyberpunk Roguelike Action" etc.
export const VIBES = [
  // ---------- Pure-archetype stimuli ----------
  {
    id: 'anime-pastel-rpg',
    mode: 0,
    palette: [[1.0, 0.75, 0.85], [0.55, 0.85, 1.0], [1.0, 0.95, 0.98]],
    radius: 1.1,
    tags: { genre: ['rpg', 'narrative'], style: ['anime', 'painterly'], mood: ['cozy', 'whimsical', 'bright'], setting: ['fantasy'] },
  },
  {
    id: 'jrpg-golden',
    mode: 11,
    palette: [[1.0, 0.78, 0.35], [0.95, 0.55, 0.75], [0.4, 0.25, 0.55]],
    radius: 1.05,
    tags: { genre: ['rpg', 'turnbased'], style: ['anime'], mood: ['epic', 'bright', 'whimsical'], setting: ['fantasy'] },
  },
  {
    id: 'mecha-industrial',
    mode: 13,
    palette: [[0.95, 0.45, 0.15], [0.6, 0.7, 0.85], [0.1, 0.12, 0.18]],
    radius: 1.15,
    tags: { genre: ['action', 'shooter'], style: ['anime', 'cellshaded'], mood: ['intense', 'kinetic'], setting: ['scifi', 'mecha'] },
  },
  {
    id: 'visualnovel-rose',
    mode: 12,
    palette: [[1.0, 0.85, 0.92], [0.95, 0.6, 0.75], [0.7, 0.4, 0.6]],
    radius: 0.85,
    tags: { genre: ['visualnovel', 'narrative'], style: ['anime', 'painterly'], mood: ['romantic', 'melancholic'], setting: ['modern', 'fantasy'] },
  },
  {
    id: 'doom-fps',
    mode: 1,
    palette: [[1.0, 0.15, 0.05], [0.4, 0.05, 0.0], [0.05, 0.02, 0.02]],
    radius: 1.3,
    tags: { genre: ['shooter', 'action'], style: ['photoreal', 'cellshaded'], mood: ['intense', 'dark', 'kinetic'], setting: ['scifi', 'horror'] },
  },
  {
    id: 'horror-blood',
    mode: 1,
    palette: [[0.55, 0.05, 0.08], [0.15, 0.02, 0.04], [0.0, 0.0, 0.0]],
    radius: 1.0,
    tags: { genre: ['horror', 'survival'], style: ['photoreal'], mood: ['dark', 'tense'], setting: ['modern', 'horror'] },
  },
  {
    id: 'cosmic-horror',
    mode: 6,
    palette: [[0.35, 0.1, 0.5], [0.1, 0.0, 0.2], [0.6, 0.8, 0.5]],
    radius: 1.15,
    tags: { genre: ['horror', 'narrative', 'adventure'], style: ['painterly', 'abstract'], mood: ['mysterious', 'dark', 'melancholic'], setting: ['cosmic', 'surreal'] },
  },
  {
    id: 'soulslike-ash',
    mode: 10,
    palette: [[0.5, 0.5, 0.55], [0.95, 0.45, 0.15], [0.08, 0.06, 0.08]],
    radius: 1.2,
    tags: { genre: ['rpg', 'action'], style: ['photoreal', 'gritty'], mood: ['dark', 'epic', 'melancholic'], setting: ['fantasy', 'darkfantasy'] },
  },
  {
    id: 'mystery-fog',
    mode: 2,
    palette: [[0.2, 0.25, 0.6], [0.55, 0.4, 0.85], [0.05, 0.08, 0.2]],
    radius: 0.95,
    tags: { genre: ['adventure', 'narrative'], style: ['painterly'], mood: ['mysterious', 'melancholic'], setting: ['victorian', 'historical'] },
  },
  {
    id: 'noir-mono',
    mode: 7,
    palette: [[0.45, 0.55, 0.75], [0.85, 0.85, 0.95], [0.05, 0.06, 0.1]],
    radius: 0.9,
    tags: { genre: ['narrative', 'adventure'], style: ['cellshaded', 'stylized'], mood: ['mysterious', 'melancholic'], setting: ['noir', 'modern'] },
  },
  {
    id: 'fantasy-aurora',
    mode: 3,
    palette: [[0.2, 0.95, 0.55], [0.4, 0.85, 0.7], [0.05, 0.2, 0.15]],
    radius: 1.25,
    tags: { genre: ['rpg', 'adventure'], style: ['painterly'], mood: ['epic', 'mysterious', 'bright'], setting: ['fantasy', 'magical'] },
  },
  {
    id: 'scifi-chrome',
    mode: 4,
    palette: [[0.4, 0.75, 1.0], [0.85, 0.9, 1.0], [0.05, 0.1, 0.2]],
    radius: 1.1,
    tags: { genre: ['adventure', 'simulation'], style: ['lowpoly', 'minimal'], mood: ['mysterious', 'chill'], setting: ['scifi', 'space'] },
  },
  {
    id: 'cyberpunk-neon',
    mode: 5,
    palette: [[1.0, 0.15, 0.7], [0.2, 0.95, 0.95], [0.08, 0.02, 0.15]],
    radius: 1.15,
    tags: { genre: ['rpg', 'action', 'shooter'], style: ['cellshaded'], mood: ['intense', 'dark', 'kinetic'], setting: ['cyberpunk', 'scifi'] },
  },
  {
    id: 'postapoc-rust',
    mode: 9,
    palette: [[0.85, 0.5, 0.25], [0.45, 0.3, 0.2], [0.15, 0.1, 0.08]],
    radius: 1.1,
    tags: { genre: ['survival', 'action'], style: ['photoreal', 'gritty'], mood: ['dark', 'melancholic'], setting: ['postapoc', 'wasteland'] },
  },
  {
    id: 'survival-forest',
    mode: 15,
    palette: [[0.25, 0.55, 0.35], [0.55, 0.7, 0.4], [0.05, 0.1, 0.08]],
    radius: 1.0,
    tags: { genre: ['survival', 'simulation'], style: ['photoreal', 'lowpoly'], mood: ['chill', 'mysterious'], setting: ['nature', 'wilderness'] },
  },
  {
    id: 'racing-speed',
    mode: 8,
    palette: [[1.0, 0.55, 0.1], [1.0, 0.95, 0.3], [0.1, 0.05, 0.0]],
    radius: 0.95,
    tags: { genre: ['racing'], style: ['cellshaded', 'stylized'], mood: ['intense', 'kinetic', 'bright'], setting: ['arcade', 'modern'] },
  },
  {
    id: 'puzzle-clean',
    mode: 4,
    palette: [[0.5, 0.85, 1.0], [1.0, 1.0, 1.0], [0.1, 0.15, 0.25]],
    radius: 0.85,
    tags: { genre: ['puzzle'], style: ['minimal', 'lowpoly'], mood: ['chill', 'mysterious'], setting: ['abstract', 'surreal'] },
  },
  {
    id: 'retro-pixel',
    mode: 8,
    palette: [[0.3, 1.0, 0.4], [1.0, 0.85, 0.2], [0.0, 0.1, 0.0]],
    radius: 0.85,
    tags: { genre: ['platformer', 'arcade'], style: ['pixel', 'retro'], mood: ['whimsical', 'kinetic', 'bright'], setting: ['arcade'] },
  },
  {
    id: 'platformer-bright',
    mode: 0,
    palette: [[0.95, 0.4, 0.4], [0.3, 0.7, 1.0], [1.0, 0.9, 0.3]],
    radius: 0.9,
    tags: { genre: ['platformer'], style: ['cartoon', 'cellshaded'], mood: ['bright', 'whimsical', 'kinetic'], setting: ['fantasy', 'arcade'] },
  },
  {
    id: 'roguelike-torch',
    mode: 14,
    palette: [[0.95, 0.55, 0.2], [0.4, 0.2, 0.1], [0.05, 0.03, 0.03]],
    radius: 1.0,
    tags: { genre: ['roguelike', 'action'], style: ['pixel', 'painterly'], mood: ['dark', 'tense'], setting: ['fantasy', 'darkfantasy'] },
  },

  // ---------- Cross-combination stimuli — the interesting blends ----------
  {
    id: 'cozy-cyberpunk-cafe',
    mode: 5,
    palette: [[1.0, 0.55, 0.75], [0.4, 0.8, 0.85], [0.18, 0.12, 0.25]],
    radius: 1.0,
    tags: { genre: ['simulation', 'narrative'], style: ['anime', 'cellshaded'], mood: ['cozy', 'chill', 'melancholic'], setting: ['cyberpunk', 'modern'] },
  },
  {
    id: 'anime-horror-dark',
    mode: 0,
    palette: [[0.55, 0.15, 0.4], [0.25, 0.05, 0.5], [0.05, 0.02, 0.1]],
    radius: 1.05,
    tags: { genre: ['horror', 'narrative', 'rpg'], style: ['anime', 'painterly'], mood: ['dark', 'mysterious', 'melancholic'], setting: ['fantasy', 'horror'] },
  },
  {
    id: 'scifi-noir',
    mode: 7,
    palette: [[0.35, 0.55, 0.85], [0.95, 0.7, 0.45], [0.05, 0.06, 0.12]],
    radius: 1.0,
    tags: { genre: ['adventure', 'narrative'], style: ['cellshaded', 'painterly'], mood: ['mysterious', 'melancholic', 'dark'], setting: ['scifi', 'cyberpunk', 'noir'] },
  },
  {
    id: 'cosmic-puzzle',
    mode: 6,
    palette: [[0.4, 0.7, 0.95], [0.6, 0.95, 0.85], [0.05, 0.05, 0.15]],
    radius: 1.05,
    tags: { genre: ['puzzle', 'adventure'], style: ['lowpoly', 'minimal'], mood: ['mysterious', 'chill'], setting: ['space', 'cosmic'] },
  },
  {
    id: 'dark-fantasy-shooter',
    mode: 10,
    palette: [[0.7, 0.25, 0.55], [0.4, 0.1, 0.3], [0.08, 0.04, 0.08]],
    radius: 1.15,
    tags: { genre: ['shooter', 'rpg'], style: ['painterly', 'gritty'], mood: ['dark', 'epic', 'intense'], setting: ['darkfantasy', 'fantasy'] },
  },
  {
    id: 'retro-horror',
    mode: 8,
    palette: [[0.85, 0.15, 0.15], [0.2, 0.0, 0.0], [0.0, 0.0, 0.05]],
    radius: 0.9,
    tags: { genre: ['horror', 'adventure'], style: ['pixel', 'retro'], mood: ['dark', 'tense', 'mysterious'], setting: ['horror', 'modern'] },
  },
  {
    id: 'cyberpunk-roguelike',
    mode: 5,
    palette: [[1.0, 0.35, 0.2], [0.3, 0.85, 0.95], [0.04, 0.0, 0.12]],
    radius: 1.05,
    tags: { genre: ['roguelike', 'action', 'shooter'], style: ['pixel', 'cellshaded'], mood: ['intense', 'kinetic', 'dark'], setting: ['cyberpunk', 'scifi'] },
  },
  {
    id: 'anime-roguelike',
    mode: 14,
    palette: [[1.0, 0.45, 0.35], [0.95, 0.85, 0.45], [0.15, 0.05, 0.1]],
    radius: 1.0,
    tags: { genre: ['roguelike', 'action'], style: ['anime', 'cellshaded'], mood: ['kinetic', 'epic', 'intense'], setting: ['fantasy', 'mythical'] },
  },
  {
    id: 'soulslike-scifi',
    mode: 4,
    palette: [[0.45, 0.5, 0.6], [0.8, 0.4, 0.25], [0.05, 0.06, 0.1]],
    radius: 1.1,
    tags: { genre: ['rpg', 'action'], style: ['photoreal', 'gritty'], mood: ['dark', 'epic', 'melancholic'], setting: ['scifi', 'darkfantasy'] },
  },
  {
    id: 'cozy-survival-village',
    mode: 15,
    palette: [[0.8, 0.6, 0.4], [0.55, 0.75, 0.55], [0.18, 0.15, 0.12]],
    radius: 1.0,
    tags: { genre: ['simulation', 'survival', 'rpg'], style: ['cartoon', 'lowpoly'], mood: ['cozy', 'chill', 'whimsical'], setting: ['pastoral', 'fantasy'] },
  },
  {
    id: 'dark-platformer',
    mode: 7,
    palette: [[0.15, 0.18, 0.22], [0.4, 0.45, 0.5], [0.0, 0.0, 0.0]],
    radius: 0.9,
    tags: { genre: ['platformer', 'adventure'], style: ['stylized', 'minimal'], mood: ['dark', 'melancholic', 'mysterious'], setting: ['surreal', 'horror'] },
  },
  {
    id: 'epic-strategy',
    mode: 11,
    palette: [[0.95, 0.7, 0.3], [0.6, 0.4, 0.85], [0.1, 0.08, 0.18]],
    radius: 1.15,
    tags: { genre: ['strategy', 'simulation'], style: ['painterly', 'lowpoly'], mood: ['epic', 'mysterious'], setting: ['fantasy', 'historical'] },
  },
  {
    id: 'melancholic-rpg',
    mode: 10,
    palette: [[0.55, 0.55, 0.7], [0.85, 0.7, 0.6], [0.1, 0.1, 0.15]],
    radius: 1.05,
    tags: { genre: ['rpg', 'narrative'], style: ['painterly', 'stylized'], mood: ['melancholic', 'mysterious'], setting: ['surreal', 'fantasy'] },
  },
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

// Variation strategy:
//   'color'   — same shader mode, palette shifted (test colour preference)
//   'pattern' — different shader mode (a tag-cousin's), palette barely shifted
//               (test visual-language preference within a tag family)
//   'mixed'   — moderate shifts on both, plus a tag from a related stimulus
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
    modeSwapChance = 0.18;
  }

  const palette = base.palette.map((rgb) => [
    clamp01(rgb[0] + (rng() - 0.5) * intensity * paletteFactor),
    clamp01(rgb[1] + (rng() - 0.5) * intensity * paletteFactor),
    clamp01(rgb[2] + (rng() - 0.5) * intensity * paletteFactor),
  ]);

  let mode = base.mode;
  let tags = {
    genre: [...(base.tags?.genre || [])],
    style: [...(base.tags?.style || [])],
    mood: [...(base.tags?.mood || [])],
    setting: [...(base.tags?.setting || [])],
  };

  // Pattern variants: borrow mode + 1-2 tag dimensions from a top-cousin so the
  // variant feels like a different facet of the same overall family.
  if (rng() < modeSwapChance) {
    const cousins = topCousins(base, 6);
    if (cousins.length) {
      const picked = cousins[Math.floor(rng() * cousins.length)];
      mode = picked.mode;
      // Borrow one tag from the cousin for one dimension at random
      const dims = ['genre', 'style', 'mood', 'setting'];
      const dim = dims[Math.floor(rng() * dims.length)];
      const cousinTags = picked.tags?.[dim] || [];
      if (cousinTags.length) {
        const newTag = cousinTags[Math.floor(rng() * cousinTags.length)];
        if (!tags[dim].includes(newTag)) {
          // Replace one of the base tags so we don't grow the array indefinitely
          if (tags[dim].length > 0) {
            tags[dim] = [newTag, ...tags[dim].slice(0, -1)];
          } else {
            tags[dim] = [newTag];
          }
        }
      }
    }
  }

  const radius = Math.max(
    0.8,
    Math.min(1.2, base.radius + (rng() - 0.5) * 0.3)
  );

  return {
    id: `${base.id}-v-${seedKey}-${strategy}`,
    mode,
    palette,
    tags,
    radius,
  };
}

// Generate `count` variants distributed across the variation strategies.
// Each click pulls everyone 15% closer; strategy mix guarantees some siblings
// vary by colour and others by pattern/tag at every depth.
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
