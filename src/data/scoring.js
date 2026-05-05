// Compose the final game type from the user's path. Three dimensions each
// get a winner via mode (most-frequent across path); compose into a recipe.

import {
  STYLE_LABELS,
  GENRE_LABELS,
  COLOR_LABELS,
} from './vibes.js';

function modeOf(values) {
  const counts = new Map();
  for (const v of values) {
    if (!v) continue;
    counts.set(v, (counts.get(v) || 0) + 1);
  }
  let best = null;
  let bestCount = -1;
  for (const [k, c] of counts) {
    if (c > bestCount) {
      bestCount = c;
      best = k;
    }
  }
  return best;
}

function titleCase(s) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const labelStyle = (s) => (s ? STYLE_LABELS[s] || titleCase(s) : '');
const labelGenre = (g) => (g ? GENRE_LABELS[g] || titleCase(g) : '');
const labelColor = (c) => (c ? COLOR_LABELS[c] || titleCase(c) : '');

export function getGameRecipe(path) {
  if (!path.length) {
    return { headline: '', body: '', recipe: { color: null, style: null, genre: null } };
  }
  const colors = path.map((v) => v?.color).filter(Boolean);
  const styles = path.map((v) => v?.style).filter(Boolean);
  const genres = path.map((v) => v?.genre).filter(Boolean);
  const color = modeOf(colors);
  const style = modeOf(styles);
  const genre = modeOf(genres);

  const colorLabel = labelColor(color);
  const styleLabel = labelStyle(style);
  const genreLabel = labelGenre(genre) || 'Game';

  const headline = [colorLabel, styleLabel, genreLabel].filter(Boolean).join(' ');
  const body = composeBody(colorLabel, styleLabel, genreLabel);

  return {
    headline,
    body,
    recipe: { color, style, genre },
  };
}

function composeBody() {
  // Headline carries the game name; body is the platform handoff line.
  return 'Playo will now generate your game…';
}

export function getInsight(path) {
  const recipe = getGameRecipe(path);
  return {
    headline: recipe.headline,
    body: recipe.body,
    anchor: null,
    recipe: recipe.recipe,
  };
}
