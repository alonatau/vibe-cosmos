// Aggregate the user's path of chosen stimuli into a game-type recipe.
// For each tag dimension (genre, style, mood, setting) we count how often
// each tag appears across the path and pick the top one — combining them
// gives the platform a concrete description of what to generate.

const DIMENSIONS = ['genre', 'style', 'mood', 'setting'];

// Pretty labels for tag values — used in the headline reveal.
const LABELS = {
  // genre
  rpg: 'RPG',
  action: 'Action',
  adventure: 'Adventure',
  horror: 'Horror',
  puzzle: 'Puzzle',
  racing: 'Racing',
  strategy: 'Strategy',
  simulation: 'Simulation',
  platformer: 'Platformer',
  shooter: 'Shooter',
  roguelike: 'Roguelike',
  visualnovel: 'Visual Novel',
  narrative: 'Narrative',
  survival: 'Survival',
  arcade: 'Arcade',
  turnbased: 'Turn-based',
  // style
  anime: 'Anime',
  pixel: 'Pixel-art',
  photoreal: 'Photorealistic',
  lowpoly: 'Low-poly',
  cartoon: 'Cartoon',
  cellshaded: 'Cell-shaded',
  painterly: 'Painterly',
  abstract: 'Abstract',
  minimal: 'Minimalist',
  retro: 'Retro',
  stylized: 'Stylized',
  gritty: 'Gritty',
  // mood
  cozy: 'Cozy',
  intense: 'Intense',
  dark: 'Dark',
  bright: 'Bright',
  mysterious: 'Mysterious',
  epic: 'Epic',
  chill: 'Chill',
  tense: 'Tense',
  whimsical: 'Whimsical',
  melancholic: 'Melancholic',
  romantic: 'Romantic',
  kinetic: 'Kinetic',
  // setting
  fantasy: 'Fantasy',
  darkfantasy: 'Dark Fantasy',
  scifi: 'Sci-fi',
  modern: 'Modern',
  historical: 'Historical',
  cyberpunk: 'Cyberpunk',
  postapoc: 'Post-apocalyptic',
  surreal: 'Surreal',
  noir: 'Noir',
  space: 'Space',
  horror: 'Horror',
  victorian: 'Victorian',
  cosmic: 'Cosmic',
  arcade: 'Arcade',
  pastoral: 'Pastoral',
  wilderness: 'Wilderness',
  wasteland: 'Wasteland',
  nature: 'Nature',
  magical: 'Magical',
  mecha: 'Mecha',
  mythical: 'Mythical',
  abstract: 'Abstract',
};

const label = (t) => LABELS[t] || t.charAt(0).toUpperCase() + t.slice(1);

export function aggregateTags(path) {
  const counts = { genre: {}, style: {}, mood: {}, setting: {} };
  for (const vibe of path) {
    for (const dim of DIMENSIONS) {
      const tags = vibe?.tags?.[dim] || [];
      for (const t of tags) counts[dim][t] = (counts[dim][t] || 0) + 1;
    }
  }
  return counts;
}

// Top-N most-frequent tags per dimension (with ties).
function topN(counts, n = 1) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return entries.slice(0, n);
}

// Compose a game-type recipe from the aggregated tag counts.
// Returns { headline, body, recipe: {genre, style, mood, setting} }.
export function getGameRecipe(path) {
  if (!path.length) {
    return {
      headline: 'No path yet',
      body: '',
      recipe: { genre: null, style: null, mood: null, setting: null },
    };
  }
  const counts = aggregateTags(path);
  const top = {};
  for (const dim of DIMENSIONS) {
    const ranked = topN(counts[dim], 2);
    top[dim] = ranked.map((e) => e[0]); // top tag values for this dim
  }

  const mood = top.mood[0];
  const style = top.style[0];
  const setting = top.setting[0];
  const genre = top.genre[0];

  const moodLabel = mood ? label(mood) : '';
  const styleLabel = style ? label(style) : '';
  const settingLabel = setting ? label(setting) : '';
  const genreLabel = genre ? label(genre) : 'Game';

  // Headline = "Mood Style Setting Genre" with sensible truncation.
  const parts = [moodLabel, styleLabel, settingLabel, genreLabel].filter(Boolean);
  const headline = parts.join(' ');

  // Secondary genre/style if there's a notable runner-up
  const secondaryGenre = top.genre[1];
  const secondaryStyle = top.style[1];

  // Body: short pitch describing the determined game.
  const body = composeBody({
    mood: moodLabel,
    style: styleLabel,
    setting: settingLabel,
    genre: genreLabel,
    secondaryGenre: secondaryGenre ? label(secondaryGenre) : null,
    secondaryStyle: secondaryStyle ? label(secondaryStyle) : null,
  });

  return {
    headline,
    body,
    recipe: { genre, style, mood, setting },
    counts,
  };
}

function composeBody({ mood, style, setting, genre, secondaryGenre, secondaryStyle }) {
  const moodPhrase = mood ? `${mood.toLowerCase()}` : '';
  const stylePhrase = style ? `${style.toLowerCase()}` : '';
  const settingPhrase = setting ? `${setting.toLowerCase()}` : '';
  const genrePhrase = genre ? `${genre.toLowerCase()}` : 'game';

  let lead;
  if (style && setting && mood) {
    lead = `A ${moodPhrase}, ${stylePhrase}-styled ${settingPhrase} ${genrePhrase}`;
  } else if (setting && mood) {
    lead = `A ${moodPhrase} ${settingPhrase} ${genrePhrase}`;
  } else if (style && mood) {
    lead = `A ${moodPhrase}, ${stylePhrase}-styled ${genrePhrase}`;
  } else {
    lead = `A ${[moodPhrase, stylePhrase, settingPhrase, genrePhrase].filter(Boolean).join(' ')}`;
  }

  const blendBits = [];
  if (secondaryGenre) blendBits.push(`with ${secondaryGenre.toLowerCase()} elements`);
  if (secondaryStyle) blendBits.push(`leaning ${secondaryStyle.toLowerCase()}`);

  const blend = blendBits.length ? ` ${blendBits.join(', ')}` : '';
  return `${lead}${blend}.`;
}

// Backwards-compat shim — older import of getInsight returns the recipe wrapped
// in the same { headline, body, anchor? } shape the overlay expects.
export function getInsight(path) {
  const recipe = getGameRecipe(path);
  return {
    headline: recipe.headline,
    body: recipe.body,
    anchor: null, // no citation chip in game-type mode
    recipe: recipe.recipe,
  };
}
