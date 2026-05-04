// Aggregate the user's path of chosen vibes into a 4-axis score and pick an
// evidence-grounded insight template. Hedged language throughout — "often
// signals", "tends to predict" — never trait diagnoses. The replicated finding
// each template anchors on is annotated for honesty.

const ZERO = { openness: 0, intensity: 0, darkness: 0, structure: 0 };

export function aggregateScores(path) {
  if (!path.length) return { ...ZERO };
  const sum = { ...ZERO };
  for (const vibe of path) {
    if (!vibe?.scores) continue;
    sum.openness += vibe.scores.openness;
    sum.intensity += vibe.scores.intensity;
    sum.darkness += vibe.scores.darkness;
    sum.structure += vibe.scores.structure;
  }
  return sum;
}

// Insight templates ordered most-specific → most-general. First match wins.
// Each anchors on a replicated finding cited in the body so the reveal isn't
// fluff. `match` examines the aggregate score from 4 clicks (each axis ranges
// roughly -8 to +8). Thresholds tuned so multi-axis combos take precedence.
const TEMPLATES = [
  {
    id: 'unfamiliar-dark',
    match: (s) => s.darkness >= 4 && s.openness >= 3,
    headline: 'You drift toward the unfamiliar dark',
    body: 'Cosmic horror, weird fiction, the edges of beauty. Choices like yours often signal a comfort with complexity layered over what psychologists call morbid curiosity — a normal-range trait (Scrivner, 2021) that predicts engagement with strange, dark, narratively rich worlds.',
    anchor: 'Scrivner 2021 · Silvia 2007',
  },
  {
    id: 'vivid-order',
    match: (s) => s.intensity >= 4 && s.structure >= 3,
    headline: 'Vivid, ordered, alive',
    body: 'Saturation pulled you forward; geometry kept you anchored. This pattern — high arousal-seeking inside structured visual rules — tends to coincide with a taste for clean systems running at full intensity. Neon and mecha territory.',
    anchor: 'Valdez & Mehrabian 1994 · Spehar 2016',
  },
  {
    id: 'organic-strange',
    match: (s) => s.openness >= 4 && s.structure <= -3,
    headline: 'Layered and organic',
    body: 'Painterly, asymmetric, fractal forms over geometry. The strongest finding in personality-aesthetics is exactly this: openness to experience predicts preference for complex, abstract, non-conventional art (Silvia, 2007; Fayn, 2015). Reliable signal.',
    anchor: 'Silvia 2007 · Fayn 2015',
  },
  {
    id: 'soft-bright',
    match: (s) => s.darkness <= -3 && s.intensity <= -2,
    headline: 'You move toward the gentle',
    body: 'Soft, bright, restorative palettes guided every choice. Aesthetic preference for life-affirming visuals tends to track with lower sensation-seeking and a draw toward renewal over arousal — a calm signature, not a passive one.',
    anchor: 'Palmer & Schloss 2010',
  },
  {
    id: 'dominant-dark',
    match: (s) => s.darkness >= 4,
    headline: 'You linger in shadow',
    body: 'Dark, atmospheric, decay-textured worlds drew you at every step. Audiences for horror and noir consistently score higher on morbid curiosity (Scrivner, 2021) — a normally distributed trait, not a deficit, that predicts engagement with challenging stories.',
    anchor: 'Scrivner 2021',
  },
  {
    id: 'dominant-intensity',
    match: (s) => s.intensity >= 4,
    headline: 'You crave stimulation',
    body: 'Saturation and contrast guided every click. The arousal-driving properties of color (Valdez & Mehrabian, 1994) line up with sensation-seeking — preference for novel, intense, sometimes risky experiences. A high-engagement signature.',
    anchor: 'Valdez & Mehrabian 1994',
  },
  {
    id: 'dominant-openness',
    match: (s) => s.openness >= 3,
    headline: 'Drawn to the strange',
    body: 'Layered, unfamiliar, abstract aesthetics drew you. Openness to experience is the strongest known correlate of complexity preference in visual art (Silvia, 2007) — your path reads cleanly along that axis.',
    anchor: 'Silvia 2007',
  },
  {
    id: 'dominant-structure',
    match: (s) => s.structure >= 4,
    headline: 'You favor elegant order',
    body: 'Geometric, rule-based, intentional visual systems defined your path. Preference for clean structure tracks with a taste for clarity over chaos — designers and engineers often cluster here.',
    anchor: 'Spehar 2016',
  },
  {
    id: 'thoughtful-dark',
    match: (s) => s.darkness >= 2 && s.openness >= 2,
    headline: 'Thoughtful, atmospheric',
    body: 'Dark but narratively rich — mystery, noir, slow-burn worlds. People who consistently choose this kind of palette tend to be drawn to complexity in stories more than spectacle in colour.',
    anchor: 'Silvia 2007 · Scrivner 2021',
  },
  {
    id: 'low-darkness',
    match: (s) => s.darkness <= -3,
    headline: 'Bright by default',
    body: 'Light, life-affirming aesthetics carried you through. Ecological-valence research (Palmer & Schloss, 2010) suggests preference for these palettes mirrors associations with clear skies, water, growth — a positively valenced visual diet.',
    anchor: 'Palmer & Schloss 2010',
  },
  {
    id: 'balanced',
    match: () => true,
    headline: 'Your aesthetic signature is balanced',
    body: 'Your path mixed warm with cool, dark with bright, ordered with organic. Balanced profiles often correspond to broad openness without strong commitment to any extreme — flexibility itself is the signal.',
    anchor: 'Rentfrow & Gosling 2003',
  },
];

export function getInsight(path) {
  const scores = aggregateScores(path);
  const tpl = TEMPLATES.find((t) => t.match(scores)) || TEMPLATES[TEMPLATES.length - 1];
  return { ...tpl, scores };
}
