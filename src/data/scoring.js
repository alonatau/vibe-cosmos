// Compute the final game type from the user's path of 3 chosen vibes.
// Each vibe carries a single `style` and a single `genre`. The dominant
// style and dominant genre across the path drive the recipe.

import { STYLE_LABELS, GENRE_LABELS } from './vibes.js';

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

export function getGameRecipe(path) {
  if (!path.length) {
    return { headline: '', body: '', recipe: { style: null, genre: null } };
  }
  const styles = path.map((v) => v?.style).filter(Boolean);
  const genres = path.map((v) => v?.genre).filter(Boolean);
  const style = modeOf(styles);
  const genre = modeOf(genres);

  const styleLabel = style ? STYLE_LABELS[style] || style : '';
  const genreLabel = genre ? GENRE_LABELS[genre] || genre : 'Game';

  const headline = [styleLabel, genreLabel].filter(Boolean).join(' ');
  const body = composeBody(styleLabel, genreLabel);

  return {
    headline,
    body,
    recipe: { style, genre },
  };
}

function composeBody(styleLabel, genreLabel) {
  if (styleLabel && genreLabel) {
    return `A ${styleLabel.toLowerCase()} ${genreLabel.toLowerCase()}.`;
  }
  if (genreLabel) return `A ${genreLabel.toLowerCase()} game.`;
  return '';
}

// Backwards-compat shim for the overlay's `insight` prop shape.
export function getInsight(path) {
  const recipe = getGameRecipe(path);
  return {
    headline: recipe.headline,
    body: recipe.body,
    anchor: null,
    recipe: recipe.recipe,
  };
}
