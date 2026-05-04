// Aggregate the user's path of chosen stimuli into a 4-axis score and pick an
// evidence-grounded insight. The 4 axes are anchored in REPLICATED literature
// findings (see data/vibes.js header comment for the citations). Hedged
// language throughout — "often signals", "tends to predict" — never trait
// diagnoses; effect sizes are real but modest, paths are aggregate signals.
//
// With 5 clicks and axis loadings -2..+2, each axis sums to roughly -10..+10.
// Thresholds tuned against that range.

const ZERO = { complexity: 0, order: 0, energy: 0, softness: 0 };

export function aggregateScores(path) {
  if (!path.length) return { ...ZERO };
  const sum = { ...ZERO };
  for (const vibe of path) {
    if (!vibe?.scores) continue;
    sum.complexity += vibe.scores.complexity;
    sum.order += vibe.scores.order;
    sum.energy += vibe.scores.energy;
    sum.softness += vibe.scores.softness;
  }
  return sum;
}

// Returns -1..+1 for "how committed" the path was to each axis (consistency
// metric). Higher = more decisive signal, suitable for confidence wording.
export function consistency(path) {
  if (!path.length) return { ...ZERO };
  const out = { ...ZERO };
  for (const k of Object.keys(ZERO)) {
    const vals = path.map((v) => v?.scores?.[k] ?? 0);
    if (!vals.length) continue;
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    out[k] = mean / 2; // normalize to -1..+1
  }
  return out;
}

// Templates ordered most-specific → most-general. Each anchors on a replicated
// finding cited in the body, with effect-size context where it's known. Match
// thresholds tuned for 5 clicks (axis range -10..+10).
const TEMPLATES = [
  {
    id: 'complex-broken-curved',
    match: (s) => s.complexity >= 5 && s.order <= -3 && s.softness >= 2,
    headline: 'Complex, broken, curved',
    body: 'Dense, irregular, smoothly curved forms — broken-symmetry over strict order, organic over angular. This combination is the strongest aesthetic signature for openness to experience in the literature: high complexity preference (Cotter et al., 2023; β ≈ 0.55) plus preference for curved over angular irregular shapes (Cotter, Silvia & Vartanian, 2017).',
    anchor: 'Cotter 2023 · Cotter & Silvia 2017',
  },
  {
    id: 'high-complexity-broken',
    match: (s) => s.complexity >= 5 && s.order <= -2,
    headline: 'You move through complexity',
    body: 'Dense, irregular, broken-symmetry visuals at every step. Openness × complexity is the largest replicated effect in personality-aesthetics research (Eysenck 1940 → Cotter et al. 2023, β ≈ 0.55). This isn\'t a hue claim — it\'s the gold-standard finding.',
    anchor: 'Cotter et al. 2023',
  },
  {
    id: 'order-need',
    match: (s) => s.order >= 5,
    headline: 'Drawn to clean order',
    body: 'Symmetric, regular, geometric structure pulled you forward. Strong preference for strict order over broken symmetry tracks with what psychologists call need for cognitive closure (Webster & Kruglanski, 1994) — a draw toward clear answers and structured environments. The discriminating signal is rejecting broken-symmetry stimuli, not just liking symmetric ones.',
    anchor: 'Webster & Kruglanski 1994 · Leder 2019',
  },
  {
    id: 'high-energy-vivid',
    match: (s) => s.energy >= 5,
    headline: 'You crave intensity',
    body: 'High saturation, fast motion, warm palettes guided every choice. Saturation preference is the most reliable color-personality link in the literature (Zhang et al., 2025) — a small-to-moderate but consistent association with extraversion and arousal-seeking. Hue claims are mostly noise; saturation is signal.',
    anchor: 'Zhang 2025 · Valdez & Mehrabian 1994',
  },
  {
    id: 'calm-curved',
    match: (s) => s.energy <= -4 && s.softness >= 3,
    headline: 'Calm and curved',
    body: 'Desaturated, soft, smoothly flowing visuals consistently. Low arousal-seeking paired with strong curvature preference reads in the literature as restorative-aesthetic taste — drawn to renewal over stimulation. Bar & Neta (2006) tied this to reduced amygdala response to curved versus angular forms.',
    anchor: 'Bar & Neta 2006 · Valdez & Mehrabian 1994',
  },
  {
    id: 'angular-vigilance',
    match: (s) => s.softness <= -5,
    headline: 'You favor sharp edges',
    body: 'Angular, crystalline, hard-edged forms over curves at every step. Bar & Neta (2006) localized amygdala activation specifically to sharp contours — interpreted as a threat signal. Persistent preference for them tracks with higher vigilance, a normal-range trait, not pathology.',
    anchor: 'Bar & Neta 2006',
  },
  {
    id: 'broken-asymmetry',
    match: (s) => s.order <= -5,
    headline: 'You favor the asymmetric',
    body: 'Broken symmetry, irregular composition, off-center arrangements drew you. Aesthetic experts and high-openness participants consistently prefer mild asymmetry over strict regularity (Leder et al., 2019; Gartus & Leder, 2013). A signature of unconventional or expert taste.',
    anchor: 'Leder 2019 · Gartus & Leder 2013',
  },
  {
    id: 'minimal',
    match: (s) => s.complexity <= -5,
    headline: 'You move toward simplicity',
    body: 'Sparse, minimal, low-density visuals carried you through. The inverse pole of the complexity axis — preference for clean, uncluttered visuals over dense ones — is associated with conventional aesthetic taste and lower openness scores. Smaller effect than the complex pole, but consistent.',
    anchor: 'Eysenck 1940 · Cotter 2023',
  },
  {
    id: 'maximalist-extravert',
    match: (s) => s.complexity >= 4 && s.energy >= 4,
    headline: 'Bright, dense, alive',
    body: 'Saturated and complex at every step. Combining the openness-complexity link (Cotter, 2023) with the extraversion-saturation link (Zhang, 2025) — your path puts you in maximalist territory: high stimulation tolerance with high complexity tolerance. Uncommon combination.',
    anchor: 'Cotter 2023 · Zhang 2025',
  },
  {
    id: 'creative-edgy',
    match: (s) => s.complexity >= 3 && s.order <= -3 && s.softness <= -2,
    headline: 'Sharp, complex, broken',
    body: 'Dense, jagged, asymmetric, angular forms throughout. This combination — high complexity with broken symmetry and angular preference — has been linked in studies of art-trained participants and creative professionals to non-conventional, edge-seeking aesthetic taste.',
    anchor: 'Cotter & Silvia 2017 · Leder 2019',
  },
  {
    id: 'gentle-conventional',
    match: (s) => s.softness >= 4 && s.order >= 3,
    headline: 'Gentle and ordered',
    body: 'Curved, smooth, near-symmetric forms throughout. The softness-plus-order signature reads as comfort-seeking — a draw toward visually safe, predictable, restorative environments. Often associated with higher agreeableness in the trait literature.',
    anchor: 'Bar & Neta 2006 · Jacobsen 2006',
  },
  {
    id: 'thoughtful-introvert',
    match: (s) => s.complexity >= 3 && s.energy <= -3,
    headline: 'Quiet complexity',
    body: 'Dense, layered visuals — but desaturated and slow. The combination of high complexity preference and low arousal-seeking is associated with reflective-introverted taste: drawn to depth without spectacle, to intricacy without intensity.',
    anchor: 'Cotter 2023 · Rentfrow & Gosling 2003',
  },
  {
    id: 'low-energy-pole',
    match: (s) => s.energy <= -5,
    headline: 'You move at low frequency',
    body: 'Quiet, slow, desaturated visuals at every step. Low arousal-seeking paired with desaturation preference is a coherent pattern — research links it to introverted aesthetic taste and a draw toward calm over stimulation.',
    anchor: 'Valdez & Mehrabian 1994 · Zhang 2025',
  },
  {
    id: 'high-softness',
    match: (s) => s.softness >= 4,
    headline: 'You favor curves',
    body: 'Smooth, rounded, organic forms over angular ones. The curvature-preference effect is one of the better-replicated findings in visual aesthetics (Bar & Neta 2006; Chuquichambi et al. 2023 meta-analysis, g = 0.39). Strongly preferring curves tracks with higher openness in irregular-shape studies, and inversely with threat-attention.',
    anchor: 'Bar & Neta 2006 · Chuquichambi 2023',
  },
  {
    id: 'fallback',
    match: () => true,
    headline: 'A balanced aesthetic signature',
    body: 'Your path mixed simple with complex, ordered with broken, energetic with calm, sharp with curved. Balanced profiles across the major aesthetic axes often indicate openness without strong commitment to any extreme — flexibility itself is the signal, not a deficit.',
    anchor: 'Rentfrow & Gosling 2003',
  },
];

export function getInsight(path) {
  const scores = aggregateScores(path);
  const cons = consistency(path);
  const tpl =
    TEMPLATES.find((t) => t.match(scores)) || TEMPLATES[TEMPLATES.length - 1];
  return { ...tpl, scores, consistency: cons };
}
