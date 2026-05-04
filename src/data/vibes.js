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
// 14 art-style orbs. Each is a pure visual style — fantasy, anime, sci-fi,
// western, comics, etc. Game-style (genre) variation comes later in the
// drill-down hierarchy. For this iteration the orbs answer: WHAT VISUAL
// LANGUAGE does the user want their game in?
export const VIBES = [
  { id: 'fantasy', painter: 'fantasy', palette: [[0.4, 0.95, 0.6], [0.95, 0.85, 0.55], [0.05, 0.15, 0.1]], radius: 1.2,
    tags: { style: ['fantasy', 'painterly'], mood: ['epic', 'magical'], setting: ['fantasy'] } },
  { id: 'anime', painter: 'anime', palette: [[1.0, 0.7, 0.85], [0.85, 0.92, 1.0], [1.0, 0.96, 0.98]], radius: 1.1,
    tags: { style: ['anime'], mood: ['whimsical', 'romantic'], setting: ['fantasy'] } },
  { id: 'scifi', painter: 'scifi', palette: [[0.5, 0.75, 1.0], [0.85, 0.6, 0.95], [0.02, 0.03, 0.1]], radius: 1.15,
    tags: { style: ['scifi', 'futuristic'], mood: ['mysterious', 'chill'], setting: ['space', 'scifi'] } },
  { id: 'western', painter: 'western', palette: [[0.95, 0.55, 0.2], [1.0, 0.78, 0.4], [0.45, 0.25, 0.18]], radius: 1.15,
    tags: { style: ['western', 'painterly'], mood: ['epic', 'melancholic'], setting: ['western', 'desert'] } },
  { id: 'comics', painter: 'comics', palette: [[1.0, 0.85, 0.25], [0.95, 0.4, 0.4], [0.25, 0.55, 1.0]], radius: 1.05,
    tags: { style: ['comics', 'stylized'], mood: ['kinetic', 'bright', 'whimsical'], setting: ['heroic'] } },
  { id: 'cyberpunk', painter: 'cyberpunk', palette: [[1.0, 0.15, 0.7], [0.2, 0.95, 0.95], [0.08, 0.02, 0.15]], radius: 1.15,
    tags: { style: ['cyberpunk', 'cellshaded'], mood: ['intense', 'dark'], setting: ['cyberpunk'] } },
  { id: 'pixel', painter: 'pixel', palette: [[0.3, 1.0, 0.4], [1.0, 0.85, 0.2], [0.05, 0.1, 0.05]], radius: 0.95,
    tags: { style: ['pixel', 'retro'], mood: ['whimsical', 'kinetic'], setting: ['arcade'] } },
  { id: 'voxel', painter: 'voxel', palette: [[0.55, 0.85, 0.5], [0.85, 0.65, 0.45], [0.35, 0.45, 0.25]], radius: 1.1,
    tags: { style: ['voxel', 'lowpoly'], mood: ['chill', 'whimsical'], setting: ['fantasy', 'pastoral'] } },
  { id: 'cellshaded', painter: 'cellshaded', palette: [[0.45, 0.78, 1.0], [0.55, 0.85, 0.45], [0.4, 0.3, 0.6]], radius: 1.05,
    tags: { style: ['cellshaded', 'cartoon'], mood: ['bright', 'whimsical'], setting: ['fantasy', 'modern'] } },
  { id: 'steampunk', painter: 'steampunk', palette: [[0.95, 0.65, 0.25], [0.75, 0.5, 0.25], [0.18, 0.1, 0.05]], radius: 1.1,
    tags: { style: ['steampunk', 'painterly'], mood: ['epic', 'mysterious'], setting: ['victorian'] } },
  { id: 'cozy', painter: 'cozy', palette: [[0.65, 0.85, 0.55], [1.0, 0.85, 0.6], [0.85, 0.55, 0.45]], radius: 1.0,
    tags: { style: ['cozy', 'cartoon'], mood: ['cozy', 'chill', 'whimsical'], setting: ['pastoral'] } },
  { id: 'horror', painter: 'horror', palette: [[1.0, 0.18, 0.18], [0.55, 0.1, 0.12], [0.04, 0.03, 0.04]], radius: 1.0,
    tags: { style: ['horror', 'photoreal'], mood: ['dark', 'tense'], setting: ['horror'] } },
  { id: 'noir', painter: 'noir', palette: [[0.85, 0.85, 0.95], [1.0, 0.55, 0.45], [0.05, 0.06, 0.1]], radius: 0.95,
    tags: { style: ['noir', 'monochrome'], mood: ['mysterious', 'melancholic'], setting: ['noir', 'modern'] } },
  { id: 'cosmic', painter: 'cosmichorror', palette: [[0.5, 0.85, 0.55], [0.45, 0.15, 0.55], [0.05, 0.0, 0.12]], radius: 1.15,
    tags: { style: ['cosmic', 'painterly'], mood: ['mysterious', 'dark'], setting: ['cosmic', 'surreal'] } },
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

  // For art-style focus, prefer flavor variants of the picked style — same
  // painter, palette-shifted — so the user explores variations within their
  // chosen style. A handful of cousins still appear to allow pivoting.
  const cousinCount = Math.min(cousins.length, Math.max(1, Math.floor(count * 0.35)));
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
