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
// Each VIBE carries an `icon` (lucide icon name) + `label` (genre name shown
// on hover) so the sphere reads as its game type at a glance.
export const VIBES = [
  // ---------- Action / Adventure ----------
  {
    id: 'adventure', icon: 'Mountain', label: 'Adventure',
    mode: 21,
    palette: [[0.95, 0.65, 0.35], [0.45, 0.7, 0.95], [0.25, 0.45, 0.3]],
    radius: 1.2,
    tags: { genre: ['adventure'], style: ['painterly', 'stylized'], mood: ['epic', 'mysterious'], setting: ['fantasy', 'wilderness'] },
  },
  {
    id: 'fantasy-rpg', icon: 'Sword', label: 'Fantasy RPG',
    mode: 3,
    palette: [[0.2, 0.95, 0.55], [0.4, 0.85, 0.7], [0.05, 0.2, 0.15]],
    radius: 1.25,
    tags: { genre: ['rpg', 'adventure'], style: ['painterly'], mood: ['epic', 'magical'], setting: ['fantasy'] },
  },
  {
    id: 'soulslike', icon: 'Shield', label: 'Soulslike',
    mode: 10,
    palette: [[0.5, 0.5, 0.55], [0.95, 0.45, 0.15], [0.08, 0.06, 0.08]],
    radius: 1.2,
    tags: { genre: ['action', 'rpg'], style: ['photoreal', 'gritty'], mood: ['dark', 'epic', 'tense'], setting: ['darkfantasy'] },
  },
  {
    id: 'open-world', icon: 'Globe', label: 'Open World',
    mode: 21,
    palette: [[0.55, 0.85, 0.45], [0.35, 0.55, 0.95], [0.15, 0.3, 0.18]],
    radius: 1.2,
    tags: { genre: ['adventure', 'rpg'], style: ['photoreal'], mood: ['epic', 'chill'], setting: ['fantasy', 'wilderness'] },
  },
  {
    id: 'stealth-action', icon: 'EyeOff', label: 'Stealth',
    mode: 22,
    palette: [[0.95, 0.85, 0.45], [0.45, 0.55, 0.7], [0.04, 0.05, 0.08]],
    radius: 1.0,
    tags: { genre: ['action', 'stealth'], style: ['photoreal', 'cellshaded'], mood: ['tense', 'dark'], setting: ['modern', 'cyberpunk'] },
  },

  // ---------- Anime / JRPG / Visual Novel ----------
  {
    id: 'anime-rpg', icon: 'Sparkles', label: 'Anime RPG',
    mode: 0,
    palette: [[1.0, 0.75, 0.85], [0.55, 0.85, 1.0], [1.0, 0.95, 0.98]],
    radius: 1.1,
    tags: { genre: ['rpg'], style: ['anime'], mood: ['cozy', 'whimsical'], setting: ['fantasy'] },
  },
  {
    id: 'jrpg', icon: 'Crown', label: 'JRPG',
    mode: 11,
    palette: [[1.0, 0.78, 0.35], [0.95, 0.55, 0.75], [0.4, 0.25, 0.55]],
    radius: 1.05,
    tags: { genre: ['rpg', 'turnbased'], style: ['anime'], mood: ['epic', 'whimsical'], setting: ['fantasy'] },
  },
  {
    id: 'visual-novel', icon: 'BookOpen', label: 'Visual Novel',
    mode: 12,
    palette: [[1.0, 0.85, 0.92], [0.95, 0.6, 0.75], [0.7, 0.4, 0.6]],
    radius: 0.9,
    tags: { genre: ['visualnovel', 'narrative'], style: ['anime', 'painterly'], mood: ['romantic', 'melancholic'], setting: ['modern', 'fantasy'] },
  },
  {
    id: 'mecha', icon: 'Bot', label: 'Mecha',
    mode: 13,
    palette: [[0.95, 0.45, 0.15], [0.6, 0.7, 0.85], [0.1, 0.12, 0.18]],
    radius: 1.15,
    tags: { genre: ['action', 'shooter'], style: ['anime', 'cellshaded'], mood: ['intense', 'kinetic'], setting: ['scifi', 'mecha'] },
  },

  // ---------- Shooters / Combat ----------
  {
    id: 'fps', icon: 'Crosshair', label: 'FPS',
    mode: 1,
    palette: [[1.0, 0.15, 0.05], [0.4, 0.05, 0.0], [0.05, 0.02, 0.02]],
    radius: 1.25,
    tags: { genre: ['fps', 'shooter', 'action'], style: ['photoreal', 'gritty'], mood: ['intense', 'dark', 'kinetic'], setting: ['modern', 'horror'] },
  },
  {
    id: 'tactical-shooter', icon: 'Target', label: 'Tactical Shooter',
    mode: 22,
    palette: [[0.45, 0.55, 0.4], [0.85, 0.75, 0.5], [0.05, 0.06, 0.08]],
    radius: 1.05,
    tags: { genre: ['shooter', 'action'], style: ['photoreal'], mood: ['tense', 'kinetic'], setting: ['modern', 'military'] },
  },
  {
    id: 'arena-fighter', icon: 'Swords', label: 'Fighting',
    mode: 23,
    palette: [[1.0, 0.35, 0.15], [1.0, 0.85, 0.3], [0.08, 0.04, 0.08]],
    radius: 1.1,
    tags: { genre: ['fighting', 'action'], style: ['cellshaded', 'anime'], mood: ['intense', 'kinetic'], setting: ['arena', 'modern'] },
  },

  // ---------- Speed / Arcade ----------
  {
    id: 'endless-runner', icon: 'Zap', label: 'Endless Runner',
    mode: 16,
    palette: [[0.4, 0.9, 1.0], [1.0, 0.85, 0.3], [0.05, 0.1, 0.15]],
    radius: 1.0,
    tags: { genre: ['runner', 'arcade'], style: ['cartoon', 'cellshaded'], mood: ['kinetic', 'bright'], setting: ['arcade', 'modern'] },
  },
  {
    id: 'racing', icon: 'Car', label: 'Racing',
    mode: 16,
    palette: [[1.0, 0.55, 0.1], [1.0, 0.95, 0.3], [0.1, 0.05, 0.0]],
    radius: 1.0,
    tags: { genre: ['racing', 'arcade'], style: ['photoreal', 'cellshaded'], mood: ['intense', 'kinetic'], setting: ['modern', 'arcade'] },
  },
  {
    id: 'platformer', icon: 'Gamepad2', label: 'Platformer',
    mode: 18,
    palette: [[1.0, 0.4, 0.45], [0.4, 0.8, 1.0], [0.95, 0.85, 0.2]],
    radius: 0.95,
    tags: { genre: ['platformer'], style: ['cartoon', 'cellshaded'], mood: ['bright', 'whimsical', 'kinetic'], setting: ['arcade', 'fantasy'] },
  },
  {
    id: 'retro-arcade', icon: 'Joystick', label: 'Retro Arcade',
    mode: 8,
    palette: [[0.3, 1.0, 0.4], [1.0, 0.85, 0.2], [0.0, 0.1, 0.0]],
    radius: 0.85,
    tags: { genre: ['arcade', 'platformer'], style: ['pixel', 'retro'], mood: ['whimsical', 'kinetic'], setting: ['arcade'] },
  },

  // ---------- Puzzle / Strategy ----------
  {
    id: 'puzzle', icon: 'Puzzle', label: 'Puzzle',
    mode: 17,
    palette: [[0.45, 0.85, 1.0], [1.0, 0.95, 0.7], [0.1, 0.18, 0.28]],
    radius: 0.9,
    tags: { genre: ['puzzle'], style: ['minimal', 'lowpoly'], mood: ['chill', 'mysterious'], setting: ['abstract'] },
  },
  {
    id: 'strategy', icon: 'Brain', label: 'Strategy',
    mode: 20,
    palette: [[0.85, 0.7, 0.4], [0.4, 0.6, 0.85], [0.1, 0.1, 0.18]],
    radius: 1.1,
    tags: { genre: ['strategy', 'simulation'], style: ['lowpoly', 'painterly'], mood: ['epic', 'chill'], setting: ['fantasy', 'historical'] },
  },
  {
    id: 'sandbox-builder', icon: 'Boxes', label: 'Sandbox',
    mode: 17,
    palette: [[0.95, 0.75, 0.35], [0.5, 0.85, 0.55], [0.15, 0.18, 0.22]],
    radius: 1.05,
    tags: { genre: ['simulation', 'sandbox'], style: ['lowpoly', 'cartoon'], mood: ['chill', 'whimsical'], setting: ['modern', 'fantasy'] },
  },

  // ---------- Sci-fi / Cyberpunk ----------
  {
    id: 'scifi-exploration', icon: 'Telescope', label: 'Sci-fi Exploration',
    mode: 4,
    palette: [[0.4, 0.75, 1.0], [0.85, 0.9, 1.0], [0.05, 0.1, 0.2]],
    radius: 1.1,
    tags: { genre: ['adventure', 'puzzle'], style: ['lowpoly', 'minimal'], mood: ['mysterious', 'chill'], setting: ['scifi', 'space'] },
  },
  {
    id: 'cyberpunk', icon: 'Cpu', label: 'Cyberpunk',
    mode: 5,
    palette: [[1.0, 0.15, 0.7], [0.2, 0.95, 0.95], [0.08, 0.02, 0.15]],
    radius: 1.15,
    tags: { genre: ['rpg', 'action'], style: ['cellshaded'], mood: ['intense', 'dark'], setting: ['cyberpunk'] },
  },
  {
    id: 'space-sim', icon: 'Rocket', label: 'Space Sim',
    mode: 6,
    palette: [[0.6, 0.8, 1.0], [0.85, 0.65, 0.9], [0.02, 0.0, 0.08]],
    radius: 1.1,
    tags: { genre: ['simulation', 'adventure'], style: ['photoreal', 'minimal'], mood: ['chill', 'mysterious'], setting: ['space', 'scifi'] },
  },

  // ---------- Horror / Dark ----------
  {
    id: 'horror-survival', icon: 'Skull', label: 'Horror',
    mode: 1,
    palette: [[0.55, 0.05, 0.08], [0.15, 0.02, 0.04], [0.0, 0.0, 0.0]],
    radius: 1.05,
    tags: { genre: ['horror', 'survival'], style: ['photoreal'], mood: ['dark', 'tense'], setting: ['modern'] },
  },
  {
    id: 'cosmic-horror', icon: 'Eye', label: 'Cosmic Horror',
    mode: 6,
    palette: [[0.35, 0.1, 0.5], [0.1, 0.0, 0.2], [0.6, 0.8, 0.5]],
    radius: 1.15,
    tags: { genre: ['horror', 'narrative'], style: ['painterly', 'abstract'], mood: ['mysterious', 'dark'], setting: ['cosmic', 'surreal'] },
  },
  {
    id: 'noir-mystery', icon: 'Search', label: 'Noir Mystery',
    mode: 7,
    palette: [[0.45, 0.55, 0.75], [0.85, 0.85, 0.95], [0.05, 0.06, 0.1]],
    radius: 0.95,
    tags: { genre: ['narrative', 'adventure'], style: ['cellshaded', 'stylized'], mood: ['mysterious', 'melancholic'], setting: ['noir', 'modern'] },
  },

  // ---------- Survival / Sim ----------
  {
    id: 'survival', icon: 'Tent', label: 'Survival',
    mode: 15,
    palette: [[0.25, 0.55, 0.35], [0.55, 0.7, 0.4], [0.05, 0.1, 0.08]],
    radius: 1.05,
    tags: { genre: ['survival', 'simulation'], style: ['photoreal', 'lowpoly'], mood: ['chill', 'tense'], setting: ['wilderness'] },
  },
  {
    id: 'cozy-sim', icon: 'Sprout', label: 'Cozy Sim',
    mode: 15,
    palette: [[0.95, 0.78, 0.55], [0.65, 0.85, 0.55], [0.18, 0.2, 0.15]],
    radius: 1.0,
    tags: { genre: ['simulation', 'rpg'], style: ['cartoon', 'lowpoly'], mood: ['cozy', 'chill', 'whimsical'], setting: ['pastoral', 'fantasy'] },
  },
  {
    id: 'postapoc', icon: 'Skull', label: 'Post-apocalyptic',
    mode: 9,
    palette: [[0.85, 0.5, 0.25], [0.45, 0.3, 0.2], [0.15, 0.1, 0.08]],
    radius: 1.1,
    tags: { genre: ['survival', 'action'], style: ['photoreal', 'gritty'], mood: ['dark', 'tense'], setting: ['postapoc'] },
  },

  // ---------- Roguelike / Sports / MMO ----------
  {
    id: 'roguelike', icon: 'Castle', label: 'Roguelike',
    mode: 14,
    palette: [[0.95, 0.55, 0.2], [0.4, 0.2, 0.1], [0.05, 0.03, 0.03]],
    radius: 1.0,
    tags: { genre: ['roguelike', 'action'], style: ['pixel', 'painterly'], mood: ['dark', 'tense', 'kinetic'], setting: ['darkfantasy', 'fantasy'] },
  },
  {
    id: 'sports', icon: 'Trophy', label: 'Sports',
    mode: 19,
    palette: [[0.95, 0.85, 0.3], [0.3, 0.85, 0.45], [0.1, 0.15, 0.25]],
    radius: 1.05,
    tags: { genre: ['sports'], style: ['photoreal', 'cellshaded'], mood: ['intense', 'kinetic', 'bright'], setting: ['arena', 'modern'] },
  },
  {
    id: 'mmorpg', icon: 'Users', label: 'MMORPG',
    mode: 11,
    palette: [[0.7, 0.5, 0.95], [0.95, 0.7, 0.4], [0.1, 0.1, 0.2]],
    radius: 1.2,
    tags: { genre: ['rpg', 'mmo'], style: ['painterly', 'cellshaded'], mood: ['epic', 'whimsical'], setting: ['fantasy'] },
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

  let mode = base.mode;
  // Always keep ALL of the base's genre tags (the primary identity must persist)
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
      mode = picked.mode;
      // Borrow one tag for STYLE / MOOD / SETTING only — never genre. So a
      // drilled-into FPS variant might shift to anime style or dark mood,
      // but stays an FPS.
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
    icon: base.icon, // variants keep the parent's icon — same game family
    label: base.label,
    mode,
    palette,
    tags,
    radius,
  };
}

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
