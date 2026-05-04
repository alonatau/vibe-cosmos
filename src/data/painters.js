// Refined canvas painters. Each one composes a scene like an illustrator
// would: atmospheric sky → distant silhouettes (atmospheric perspective) →
// mid-ground subject → foreground details → highlights → grain + vignette.
// Shared helpers below produce the painterly polish (paper grain, lens halos,
// layered mountains) that elevate the orbs from "shape primitives" to
// "crafted illustration".

const SIZE = 512;

// ---------- Color utilities ----------
const rgb = (c, a = 1) =>
  `rgba(${Math.round(c[0] * 255)}, ${Math.round(c[1] * 255)}, ${Math.round(
    c[2] * 255
  )}, ${a})`;

const lighten = (c, k) => [
  Math.min(1, c[0] + k),
  Math.min(1, c[1] + k),
  Math.min(1, c[2] + k),
];
const darken = (c, k) => [
  Math.max(0, c[0] - k),
  Math.max(0, c[1] - k),
  Math.max(0, c[2] - k),
];
const mix = (a, b, t) => [
  a[0] * (1 - t) + b[0] * t,
  a[1] * (1 - t) + b[1] * t,
  a[2] * (1 - t) + b[2] * t,
];

const seedRng = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// ---------- Texture / atmosphere helpers ----------

// Pre-generated noise canvas for grain overlay (single drawImage = fast)
let _grain = null;
function getGrain() {
  if (_grain) return _grain;
  _grain = document.createElement('canvas');
  _grain.width = _grain.height = SIZE;
  const gctx = _grain.getContext('2d');
  const id = gctx.createImageData(SIZE, SIZE);
  for (let i = 0; i < id.data.length; i += 4) {
    const v = Math.floor(Math.random() * 255);
    id.data[i] = v;
    id.data[i + 1] = v;
    id.data[i + 2] = v;
    id.data[i + 3] = 255;
  }
  gctx.putImageData(id, 0, 0);
  return _grain;
}

function applyGrain(ctx, opacity = 0.07, blendMode = 'overlay') {
  ctx.save();
  ctx.globalCompositeOperation = blendMode;
  ctx.globalAlpha = opacity;
  ctx.drawImage(getGrain(), 0, 0);
  ctx.restore();
}

function applyVignette(ctx, strength = 0.5, innerRatio = 0.32) {
  const grad = ctx.createRadialGradient(
    SIZE / 2,
    SIZE / 2,
    SIZE * innerRatio,
    SIZE / 2,
    SIZE / 2,
    SIZE * 0.72
  );
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, `rgba(0,0,0,${strength})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE);
}

function atmosphericSky(ctx, top, mid, horizon, fadeAt = 0.7) {
  const grad = ctx.createLinearGradient(0, 0, 0, SIZE * fadeAt);
  grad.addColorStop(0, rgb(top));
  grad.addColorStop(0.45, rgb(mid));
  grad.addColorStop(0.85, rgb(horizon));
  grad.addColorStop(1, rgb(horizon, 0.85));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE * fadeAt);
}

// Soft halo around a point (sun, moon, lamp)
function lensHalo(ctx, x, y, r, color, peak = 0.95) {
  const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
  grad.addColorStop(0, rgb(color, peak));
  grad.addColorStop(0.35, rgb(color, peak * 0.5));
  grad.addColorStop(1, rgb(color, 0));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE);
}

// Layered silhouette terrain — atmospheric perspective when stacked.
function silhouetteRidge(ctx, baseY, color, peakHeight, peakWidth, seed) {
  const rng = seedRng(seed);
  ctx.fillStyle = rgb(color);
  ctx.beginPath();
  ctx.moveTo(0, SIZE);
  ctx.lineTo(0, baseY);
  let x = 0;
  while (x <= SIZE) {
    const ph = (0.6 + rng() * 0.8) * peakHeight;
    const pw = (0.7 + rng() * 0.6) * peakWidth;
    ctx.lineTo(x + pw * 0.5, baseY - ph);
    ctx.lineTo(x + pw, baseY);
    x += pw;
  }
  ctx.lineTo(SIZE, SIZE);
  ctx.closePath();
  ctx.fill();
}

// Soft watercolor-like wash circle
function wash(ctx, x, y, r, color, alpha) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgb(color, alpha));
  g.addColorStop(1, rgb(color, 0));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SIZE, SIZE);
}

function starfield(ctx, count, seed, brightTint = [1, 1, 1]) {
  const rng = seedRng(seed);
  for (let i = 0; i < count; i++) {
    const x = rng() * SIZE;
    const y = rng() * SIZE;
    const s = rng();
    ctx.fillStyle = rgb(brightTint, 0.3 + s * 0.7);
    ctx.beginPath();
    ctx.arc(x, y, 0.6 + s * 1.6, 0, Math.PI * 2);
    ctx.fill();
    if (s > 0.85) {
      // cross flare
      ctx.fillRect(x - 4, y - 0.5, 8, 1);
      ctx.fillRect(x - 0.5, y - 4, 1, 8);
    }
  }
}

// ---------- Painters ----------

function paintFantasy(ctx, palette) {
  // Layered atmospheric world with a sword in stone
  const sky = darken(palette[2], 0.05);
  const skyMid = mix(palette[2], palette[0], 0.4);
  const horizon = mix(palette[1], palette[0], 0.4);
  atmosphericSky(ctx, sky, skyMid, horizon, 0.68);

  // Soft moon/sun
  lensHalo(ctx, SIZE * 0.7, SIZE * 0.22, SIZE * 0.32, lighten(palette[1], 0.2), 0.5);
  ctx.fillStyle = rgb(lighten(palette[1], 0.35), 0.95);
  ctx.beginPath();
  ctx.arc(SIZE * 0.7, SIZE * 0.22, SIZE * 0.06, 0, Math.PI * 2);
  ctx.fill();

  // Distant mountain layers — atmospheric perspective
  silhouetteRidge(ctx, SIZE * 0.55, mix(palette[2], palette[1], 0.55), 90, 130, 11);
  silhouetteRidge(ctx, SIZE * 0.62, mix(palette[2], palette[1], 0.35), 70, 110, 23);
  silhouetteRidge(ctx, SIZE * 0.7, palette[2], 50, 90, 31);

  // Ground plane with a faint magic shimmer
  const ground = ctx.createLinearGradient(0, SIZE * 0.7, 0, SIZE);
  ground.addColorStop(0, rgb(darken(palette[2], 0.05)));
  ground.addColorStop(1, rgb(darken(palette[2], 0.15)));
  ctx.fillStyle = ground;
  ctx.fillRect(0, SIZE * 0.7, SIZE, SIZE * 0.3);

  // Stone base under sword
  ctx.fillStyle = rgb(darken(palette[2], 0.08));
  ctx.beginPath();
  ctx.ellipse(SIZE / 2, SIZE * 0.84, SIZE * 0.18, SIZE * 0.04, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = rgb(darken(palette[2], 0.18));
  ctx.fillRect(SIZE / 2 - 60, SIZE * 0.78, 120, 22);

  // Sword — blade
  const cx = SIZE / 2;
  const bladeGrad = ctx.createLinearGradient(cx - 6, 0, cx + 6, 0);
  bladeGrad.addColorStop(0, rgb([0.7, 0.78, 0.85]));
  bladeGrad.addColorStop(0.5, rgb([0.95, 0.97, 1.0]));
  bladeGrad.addColorStop(1, rgb([0.55, 0.6, 0.7]));
  ctx.fillStyle = bladeGrad;
  ctx.beginPath();
  ctx.moveTo(cx, SIZE * 0.18); // tip
  ctx.lineTo(cx + 7, SIZE * 0.21);
  ctx.lineTo(cx + 7, SIZE * 0.62);
  ctx.lineTo(cx - 7, SIZE * 0.62);
  ctx.lineTo(cx - 7, SIZE * 0.21);
  ctx.closePath();
  ctx.fill();
  // Blade fuller (center groove)
  ctx.fillStyle = rgb([0.45, 0.5, 0.6], 0.45);
  ctx.fillRect(cx - 1.5, SIZE * 0.21, 3, SIZE * 0.4);

  // Crossguard with curls
  ctx.fillStyle = rgb([0.85, 0.7, 0.35]);
  ctx.fillRect(cx - 60, SIZE * 0.62, 120, 12);
  ctx.beginPath();
  ctx.arc(cx - 60, SIZE * 0.625, 7, 0, Math.PI * 2);
  ctx.arc(cx + 60, SIZE * 0.625, 7, 0, Math.PI * 2);
  ctx.fill();
  // Highlight
  ctx.fillStyle = rgb([1, 0.92, 0.55], 0.7);
  ctx.fillRect(cx - 58, SIZE * 0.622, 116, 3);

  // Hilt grip (wrapped)
  ctx.fillStyle = rgb([0.35, 0.2, 0.12]);
  ctx.fillRect(cx - 6, SIZE * 0.64, 12, SIZE * 0.1);
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = rgb([0.55, 0.35, 0.2], 0.7);
    ctx.fillRect(cx - 6, SIZE * (0.65 + i * 0.018), 12, 1.5);
  }
  // Pommel with glowing gem
  ctx.fillStyle = rgb([0.85, 0.7, 0.35]);
  ctx.beginPath();
  ctx.arc(cx, SIZE * 0.755, 13, 0, Math.PI * 2);
  ctx.fill();
  const gemGrad = ctx.createRadialGradient(cx, SIZE * 0.755, 0, cx, SIZE * 0.755, 8);
  gemGrad.addColorStop(0, rgb(lighten(palette[1], 0.3)));
  gemGrad.addColorStop(0.7, rgb(palette[1]));
  gemGrad.addColorStop(1, rgb(darken(palette[1], 0.2)));
  ctx.fillStyle = gemGrad;
  ctx.beginPath();
  ctx.arc(cx, SIZE * 0.755, 6, 0, Math.PI * 2);
  ctx.fill();
  // Gem glow
  lensHalo(ctx, cx, SIZE * 0.755, 50, palette[1], 0.4);

  // Floating magic particles
  const rng = seedRng(7);
  for (let i = 0; i < 30; i++) {
    const x = cx + (rng() - 0.5) * 200;
    const y = SIZE * 0.3 + rng() * SIZE * 0.45;
    const s = 1.5 + rng() * 2.5;
    ctx.fillStyle = rgb(lighten(palette[1], 0.3), 0.6 + rng() * 0.4);
    ctx.beginPath();
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.fill();
  }

  // Light shafts from above
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 3; i++) {
    const x = SIZE * (0.3 + i * 0.2);
    const grad = ctx.createLinearGradient(x, 0, x + 40, SIZE * 0.55);
    grad.addColorStop(0, rgb(lighten(palette[0], 0.3), 0.3));
    grad.addColorStop(1, rgb(palette[0], 0));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(x - 30, 0);
    ctx.lineTo(x + 30, 0);
    ctx.lineTo(x + 80, SIZE * 0.55);
    ctx.lineTo(x - 80, SIZE * 0.55);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  applyGrain(ctx, 0.05);
  applyVignette(ctx, 0.45, 0.3);
}

function paintAnime(ctx, palette) {
  // Soft watercolor sky + cherry blossom branch + petals + sun rays
  const sky = lighten(palette[1], 0.05);
  const skyMid = lighten(palette[0], 0.1);
  const horizon = mix(palette[0], [1, 0.95, 0.88], 0.3);
  atmosphericSky(ctx, sky, skyMid, horizon, 0.95);

  // Sun glow
  lensHalo(ctx, SIZE * 0.78, SIZE * 0.22, SIZE * 0.4, [1, 0.96, 0.85], 0.55);
  ctx.fillStyle = rgb([1, 0.98, 0.92], 0.95);
  ctx.beginPath();
  ctx.arc(SIZE * 0.78, SIZE * 0.22, SIZE * 0.05, 0, Math.PI * 2);
  ctx.fill();

  // Watercolor washes
  const rng = seedRng(3);
  for (let i = 0; i < 12; i++) {
    wash(
      ctx,
      rng() * SIZE,
      rng() * SIZE,
      80 + rng() * 120,
      palette[0],
      0.08 + rng() * 0.1
    );
  }

  // Distant pagoda silhouette
  ctx.fillStyle = rgb(mix(palette[0], palette[2], 0.6), 0.4);
  ctx.fillRect(SIZE * 0.12, SIZE * 0.55, 6, SIZE * 0.18);
  ctx.fillRect(SIZE * 0.1, SIZE * 0.55, 30, 8);
  ctx.fillRect(SIZE * 0.108, SIZE * 0.62, 22, 6);
  ctx.fillRect(SIZE * 0.106, SIZE * 0.69, 26, 6);

  // Cherry blossom branch — curved silhouette extending from upper-left
  ctx.strokeStyle = rgb(darken([0.35, 0.2, 0.12], 0));
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, SIZE * 0.05);
  ctx.bezierCurveTo(SIZE * 0.2, SIZE * 0.1, SIZE * 0.35, SIZE * 0.25, SIZE * 0.55, SIZE * 0.32);
  ctx.stroke();
  // Sub-branches
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(SIZE * 0.18, SIZE * 0.08);
  ctx.bezierCurveTo(SIZE * 0.22, SIZE * 0.0, SIZE * 0.3, SIZE * 0.05, SIZE * 0.32, SIZE * 0.15);
  ctx.moveTo(SIZE * 0.4, SIZE * 0.27);
  ctx.bezierCurveTo(SIZE * 0.45, SIZE * 0.34, SIZE * 0.5, SIZE * 0.42, SIZE * 0.45, SIZE * 0.5);
  ctx.stroke();

  // Sakura blossoms on branch (5-petal flowers)
  const blossomSpots = [
    [SIZE * 0.18, SIZE * 0.1],
    [SIZE * 0.32, SIZE * 0.16],
    [SIZE * 0.42, SIZE * 0.28],
    [SIZE * 0.5, SIZE * 0.35],
    [SIZE * 0.46, SIZE * 0.5],
    [SIZE * 0.28, SIZE * 0.22],
    [SIZE * 0.08, SIZE * 0.18],
    [SIZE * 0.55, SIZE * 0.34],
  ];
  blossomSpots.forEach(([bx, by]) => drawSakura(ctx, bx, by, 14, palette));

  // Floating petals
  for (let i = 0; i < 28; i++) {
    const x = rng() * SIZE;
    const y = rng() * SIZE;
    const s = 4 + rng() * 6;
    drawPetal(ctx, x, y, s, rng() * Math.PI * 2, palette[0], 0.55 + rng() * 0.4);
  }

  // Sparkles
  for (let i = 0; i < 35; i++) {
    const x = rng() * SIZE;
    const y = rng() * SIZE;
    const s = 1.5 + rng() * 2;
    ctx.fillStyle = `rgba(255,255,255,${0.5 + rng() * 0.5})`;
    ctx.beginPath();
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.fill();
    if (rng() > 0.6) {
      ctx.fillRect(x - 4, y - 0.4, 8, 0.8);
      ctx.fillRect(x - 0.4, y - 4, 0.8, 8);
    }
  }

  applyGrain(ctx, 0.04);
  applyVignette(ctx, 0.25, 0.45);
}

function drawSakura(ctx, x, y, r, palette) {
  ctx.save();
  ctx.translate(x, y);
  for (let i = 0; i < 5; i++) {
    ctx.rotate((Math.PI * 2) / 5);
    const grad = ctx.createRadialGradient(0, -r * 0.4, 0, 0, -r * 0.4, r * 0.6);
    grad.addColorStop(0, rgb([1, 1, 1]));
    grad.addColorStop(0.5, rgb(lighten(palette[0], 0.15)));
    grad.addColorStop(1, rgb(palette[0]));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.4, r * 0.4, r * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Center
  ctx.fillStyle = rgb([1, 0.85, 0.45]);
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPetal(ctx, x, y, r, rot, color, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = rgb(color, alpha);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(r * 0.4, -r * 0.5, r * 1.0, -r * 0.3, r * 1.2, 0);
  ctx.bezierCurveTo(r * 1.0, r * 0.3, r * 0.4, r * 0.5, 0, 0);
  ctx.fill();
  ctx.restore();
}

function paintScifi(ctx, palette) {
  // Deep space + nebula + ringed planet + spaceship + lens flare
  ctx.fillStyle = rgb(palette[2]);
  ctx.fillRect(0, 0, SIZE, SIZE);
  // Nebula clouds
  wash(ctx, SIZE * 0.3, SIZE * 0.4, SIZE * 0.5, palette[1], 0.32);
  wash(ctx, SIZE * 0.7, SIZE * 0.7, SIZE * 0.4, palette[0], 0.25);
  wash(ctx, SIZE * 0.15, SIZE * 0.75, SIZE * 0.35, mix(palette[0], palette[1], 0.5), 0.22);

  // Stars (3 layers for depth)
  starfield(ctx, 200, 73, [1, 1, 1]);
  starfield(ctx, 80, 79, [0.8, 0.9, 1]);
  starfield(ctx, 30, 83, lighten(palette[0], 0.4));

  // Ringed planet
  const px = SIZE * 0.66;
  const py = SIZE * 0.42;
  const pr = SIZE * 0.18;
  // Atmosphere glow
  lensHalo(ctx, px, py, pr * 1.5, palette[0], 0.35);
  // Ring (back half)
  ctx.strokeStyle = rgb(mix(palette[0], palette[1], 0.5), 0.7);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(px, py + 5, pr * 1.8, pr * 0.4, 0.18, Math.PI, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(px, py + 5, pr * 1.55, pr * 0.32, 0.18, Math.PI, Math.PI * 2);
  ctx.stroke();
  // Planet body
  const planetGrad = ctx.createRadialGradient(px - pr * 0.3, py - pr * 0.3, 0, px, py, pr);
  planetGrad.addColorStop(0, rgb(lighten(palette[0], 0.2)));
  planetGrad.addColorStop(0.55, rgb(palette[0]));
  planetGrad.addColorStop(1, rgb(darken(palette[0], 0.3)));
  ctx.fillStyle = planetGrad;
  ctx.beginPath();
  ctx.arc(px, py, pr, 0, Math.PI * 2);
  ctx.fill();
  // Continents (irregular blobs)
  ctx.save();
  ctx.beginPath();
  ctx.arc(px, py, pr, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = rgb(darken(palette[0], 0.18), 0.7);
  for (let i = 0; i < 6; i++) {
    const rng = seedRng(91 + i);
    const cx = px + (rng() - 0.5) * pr * 1.6;
    const cy = py + (rng() - 0.5) * pr * 1.3;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 8 + rng() * 22, 4 + rng() * 14, rng() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  // Ring (front half)
  ctx.strokeStyle = rgb(mix(palette[0], palette[1], 0.5));
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(px, py + 5, pr * 1.8, pr * 0.4, 0.18, 0, Math.PI);
  ctx.stroke();

  // Spaceship silhouette
  ctx.fillStyle = '#dde4ee';
  ctx.beginPath();
  ctx.ellipse(SIZE * 0.25, SIZE * 0.78, 28, 7, 0.2, 0, Math.PI * 2);
  ctx.fill();
  // Ship details
  ctx.fillStyle = '#8f9aa5';
  ctx.fillRect(SIZE * 0.25 - 12, SIZE * 0.78 - 3, 24, 2);
  // Engine glow
  lensHalo(ctx, SIZE * 0.21, SIZE * 0.79, 28, palette[1], 0.6);

  // Distant lens flare
  const flareGrad = ctx.createRadialGradient(SIZE * 0.92, SIZE * 0.08, 0, SIZE * 0.92, SIZE * 0.08, SIZE * 0.35);
  flareGrad.addColorStop(0, 'rgba(255, 240, 220, 0.55)');
  flareGrad.addColorStop(1, 'rgba(255, 240, 220, 0)');
  ctx.fillStyle = flareGrad;
  ctx.fillRect(0, 0, SIZE, SIZE);

  applyGrain(ctx, 0.05);
  applyVignette(ctx, 0.55, 0.32);
}

function paintWestern(ctx, palette) {
  // Dramatic sunset, layered mesas, saguaro cactus, hawk, dust
  // Deep purple top → orange → red horizon
  const grad = ctx.createLinearGradient(0, 0, 0, SIZE * 0.72);
  grad.addColorStop(0, rgb(darken([0.35, 0.18, 0.4], 0)));
  grad.addColorStop(0.4, rgb(palette[0]));
  grad.addColorStop(0.78, rgb([1, 0.5, 0.18]));
  grad.addColorStop(1, rgb([0.85, 0.32, 0.15]));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE * 0.72);

  // Sun with massive halo
  const sunX = SIZE * 0.32;
  const sunY = SIZE * 0.55;
  lensHalo(ctx, sunX, sunY, SIZE * 0.45, [1, 0.85, 0.5], 0.7);
  lensHalo(ctx, sunX, sunY, SIZE * 0.18, [1, 0.95, 0.7], 0.9);
  ctx.fillStyle = rgb([1, 0.96, 0.78]);
  ctx.beginPath();
  ctx.arc(sunX, sunY, SIZE * 0.075, 0, Math.PI * 2);
  ctx.fill();

  // Distant mesa layer
  ctx.fillStyle = rgb(darken([0.55, 0.25, 0.18], 0));
  ctx.beginPath();
  ctx.moveTo(0, SIZE * 0.62);
  ctx.lineTo(SIZE * 0.05, SIZE * 0.6);
  ctx.lineTo(SIZE * 0.16, SIZE * 0.6);
  ctx.lineTo(SIZE * 0.18, SIZE * 0.62);
  ctx.lineTo(SIZE * 0.4, SIZE * 0.62);
  ctx.lineTo(SIZE * 0.42, SIZE * 0.58);
  ctx.lineTo(SIZE * 0.58, SIZE * 0.58);
  ctx.lineTo(SIZE * 0.6, SIZE * 0.62);
  ctx.lineTo(SIZE * 0.78, SIZE * 0.62);
  ctx.lineTo(SIZE * 0.8, SIZE * 0.59);
  ctx.lineTo(SIZE * 0.94, SIZE * 0.59);
  ctx.lineTo(SIZE * 0.96, SIZE * 0.62);
  ctx.lineTo(SIZE, SIZE * 0.62);
  ctx.lineTo(SIZE, SIZE * 0.72);
  ctx.lineTo(0, SIZE * 0.72);
  ctx.closePath();
  ctx.fill();

  // Closer mesa silhouettes (sharp dark)
  ctx.fillStyle = '#1a0a08';
  // Big mesa right
  ctx.beginPath();
  ctx.moveTo(SIZE * 0.5, SIZE * 0.72);
  ctx.lineTo(SIZE * 0.5, SIZE * 0.5);
  ctx.lineTo(SIZE * 0.55, SIZE * 0.48);
  ctx.lineTo(SIZE * 0.78, SIZE * 0.48);
  ctx.lineTo(SIZE * 0.82, SIZE * 0.5);
  ctx.lineTo(SIZE * 0.82, SIZE * 0.72);
  ctx.closePath();
  ctx.fill();
  // Smaller mesa left
  ctx.beginPath();
  ctx.moveTo(SIZE * 0.0, SIZE * 0.72);
  ctx.lineTo(SIZE * 0.0, SIZE * 0.62);
  ctx.lineTo(SIZE * 0.08, SIZE * 0.6);
  ctx.lineTo(SIZE * 0.18, SIZE * 0.6);
  ctx.lineTo(SIZE * 0.2, SIZE * 0.62);
  ctx.lineTo(SIZE * 0.2, SIZE * 0.72);
  ctx.closePath();
  ctx.fill();

  // Desert ground gradient
  const ground = ctx.createLinearGradient(0, SIZE * 0.72, 0, SIZE);
  ground.addColorStop(0, rgb([0.7, 0.4, 0.22]));
  ground.addColorStop(0.4, rgb([0.55, 0.32, 0.18]));
  ground.addColorStop(1, rgb([0.3, 0.18, 0.1]));
  ctx.fillStyle = ground;
  ctx.fillRect(0, SIZE * 0.72, SIZE, SIZE * 0.28);

  // Dust haze along horizon
  const haze = ctx.createLinearGradient(0, SIZE * 0.7, 0, SIZE * 0.85);
  haze.addColorStop(0, rgb([1, 0.65, 0.35], 0.45));
  haze.addColorStop(1, rgb([1, 0.65, 0.35], 0));
  ctx.fillStyle = haze;
  ctx.fillRect(0, SIZE * 0.7, SIZE, SIZE * 0.15);

  // Saguaro cactus (detailed, with bumps)
  const cx = SIZE * 0.7;
  const cy = SIZE * 0.5;
  ctx.fillStyle = '#1f2e1a';
  // trunk
  ctx.fillRect(cx, cy, 22, SIZE * 0.34);
  // bumps along trunk
  for (let y = cy + 8; y < cy + SIZE * 0.34; y += 14) {
    ctx.fillStyle = '#2a3f22';
    ctx.beginPath();
    ctx.arc(cx + 4, y, 2.5, 0, Math.PI * 2);
    ctx.arc(cx + 18, y + 6, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#1f2e1a';
  // left arm
  ctx.fillRect(cx - 26, cy + 30, 26, 16);
  ctx.fillRect(cx - 26, cy, 16, 36);
  // right arm
  ctx.fillRect(cx + 22, cy + 50, 28, 16);
  ctx.fillRect(cx + 36, cy + 18, 16, 50);
  // Spike highlights (saguaro vertical lines)
  ctx.strokeStyle = 'rgba(255, 200, 100, 0.4)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const lx = cx + 3 + i * 5;
    ctx.beginPath();
    ctx.moveTo(lx, cy);
    ctx.lineTo(lx, cy + SIZE * 0.34);
    ctx.stroke();
  }

  // Hawks
  const rng = seedRng(127);
  for (let i = 0; i < 4; i++) {
    const hx = SIZE * (0.15 + rng() * 0.5);
    const hy = SIZE * (0.18 + rng() * 0.18);
    ctx.strokeStyle = '#1a0808';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(hx - 8, hy);
    ctx.quadraticCurveTo(hx - 4, hy - 4, hx, hy);
    ctx.quadraticCurveTo(hx + 4, hy - 4, hx + 8, hy);
    ctx.stroke();
  }

  // Tumbleweeds
  for (let i = 0; i < 5; i++) {
    const x = rng() * SIZE;
    const y = SIZE * 0.86 + rng() * SIZE * 0.1;
    ctx.fillStyle = '#5a3a1f';
    ctx.beginPath();
    ctx.arc(x, y, 7 + rng() * 7, 0, Math.PI * 2);
    ctx.fill();
    // tendrils
    ctx.strokeStyle = '#7a5530';
    ctx.lineWidth = 1;
    for (let j = 0; j < 6; j++) {
      const a = rng() * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * 12, y + Math.sin(a) * 12);
      ctx.stroke();
    }
  }

  applyGrain(ctx, 0.07);
  applyVignette(ctx, 0.45, 0.35);
}

function paintComics(ctx, palette) {
  // Halftone, 3 panels, hero in flight, POW with depth, action lines
  // Background — tone two halftone colors
  ctx.fillStyle = rgb(palette[0]);
  ctx.fillRect(0, 0, SIZE, SIZE);
  // Halftone dots, two sizes
  for (let y = 0; y < SIZE; y += 14) {
    for (let x = 0; x < SIZE; x += 14) {
      const xx = x + (Math.floor(y / 14) % 2) * 7;
      ctx.fillStyle = rgb(palette[1], 0.5);
      ctx.beginPath();
      ctx.arc(xx, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  for (let y = 0; y < SIZE; y += 26) {
    for (let x = 0; x < SIZE; x += 26) {
      const xx = x + (Math.floor(y / 26) % 2) * 13;
      ctx.fillStyle = rgb(palette[2], 0.35);
      ctx.beginPath();
      ctx.arc(xx, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Panel borders — angled
  ctx.fillStyle = '#000000';
  // Diagonal top divider
  ctx.beginPath();
  ctx.moveTo(0, SIZE * 0.36);
  ctx.lineTo(SIZE, SIZE * 0.46);
  ctx.lineTo(SIZE, SIZE * 0.5);
  ctx.lineTo(0, SIZE * 0.4);
  ctx.closePath();
  ctx.fill();
  // Vertical bottom divider
  ctx.fillRect(SIZE * 0.5, SIZE * 0.46, 8, SIZE * 0.54);

  // Top panel: hero silhouette flying with cape
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, SIZE, SIZE * 0.36);
  ctx.clip();
  // Speed lines from left
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  for (let i = 0; i < 14; i++) {
    const y = SIZE * (0.05 + (i / 14) * 0.3);
    const len = 60 + Math.random() * 100;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(len, y);
    ctx.stroke();
  }
  // Hero body
  ctx.fillStyle = '#000000';
  // cape
  ctx.beginPath();
  ctx.moveTo(SIZE * 0.55, SIZE * 0.18);
  ctx.bezierCurveTo(SIZE * 0.4, SIZE * 0.1, SIZE * 0.32, SIZE * 0.05, SIZE * 0.3, SIZE * 0.0);
  ctx.lineTo(SIZE * 0.45, SIZE * 0.0);
  ctx.bezierCurveTo(SIZE * 0.55, SIZE * 0.05, SIZE * 0.6, SIZE * 0.12, SIZE * 0.62, SIZE * 0.18);
  ctx.closePath();
  ctx.fill();
  // body
  ctx.fillStyle = rgb(palette[1]);
  ctx.beginPath();
  ctx.ellipse(SIZE * 0.65, SIZE * 0.2, 18, 28, 0.2, 0, Math.PI * 2);
  ctx.fill();
  // head
  ctx.fillStyle = '#1a0a0a';
  ctx.beginPath();
  ctx.arc(SIZE * 0.7, SIZE * 0.13, 12, 0, Math.PI * 2);
  ctx.fill();
  // outline
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(SIZE * 0.65, SIZE * 0.2, 18, 28, 0.2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // POW! star with depth (bottom-left panel)
  const cx = SIZE * 0.27;
  const cy = SIZE * 0.72;
  // Shadow layer
  ctx.fillStyle = '#000000';
  drawStarBurst(ctx, cx + 6, cy + 6, 95, 14);
  // Main color
  ctx.fillStyle = rgb(palette[2]);
  drawStarBurst(ctx, cx, cy, 95, 14);
  // Outline
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 6;
  drawStarBurst(ctx, cx, cy, 95, 14, true);
  // Inner highlight
  ctx.fillStyle = rgb(lighten(palette[2], 0.25));
  drawStarBurst(ctx, cx - 5, cy - 5, 50, 14);
  // Action lines around
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 100, cy + Math.sin(a) * 100);
    ctx.lineTo(cx + Math.cos(a) * 130, cy + Math.sin(a) * 130);
    ctx.stroke();
  }

  // Speech bubble (bottom-right panel)
  const bx = SIZE * 0.78;
  const by = SIZE * 0.7;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(bx, by, 75, 50, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(bx, by, 75, 50, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Tail
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(bx - 38, by + 30);
  ctx.lineTo(bx - 60, by + 60);
  ctx.lineTo(bx - 18, by + 38);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Squiggle text
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(bx - 50, by - 18 + i * 16);
    ctx.lineTo(bx + (40 - i * 10), by - 18 + i * 16);
    ctx.stroke();
  }

  // Outer panel border
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#000000';
  ctx.strokeRect(0, 0, SIZE, SIZE);

  applyGrain(ctx, 0.04, 'multiply');
}

function drawStarBurst(ctx, cx, cy, r, points = 12, strokeOnly = false) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 ? r : r * 0.55;
    const x = cx + Math.cos(a) * rr;
    const y = cy + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  if (strokeOnly) ctx.stroke();
  else ctx.fill();
}

function paintCyberpunk(ctx, palette) {
  // Multi-layer skyline with neon, holographic billboards, rain, wet street
  // Sky
  ctx.fillStyle = rgb(palette[2]);
  ctx.fillRect(0, 0, SIZE, SIZE);
  // Atmospheric neon haze
  const haze = ctx.createLinearGradient(0, 0, 0, SIZE * 0.7);
  haze.addColorStop(0, rgb(palette[0], 0.12));
  haze.addColorStop(0.6, rgb(palette[1], 0.18));
  haze.addColorStop(1, rgb(palette[1], 0.05));
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, SIZE, SIZE * 0.7);

  // Distant skyline (light, hazy)
  drawCity(ctx, SIZE * 0.5, 30, 60, '#1a0a25', 0.6, 217);
  // Mid skyline
  drawCity(ctx, SIZE * 0.6, 80, 120, '#0d0518', 0.85, 251);
  // Foreground close buildings
  drawCity(ctx, SIZE * 0.65, 120, 200, '#02000a', 1, 263);

  // Holographic billboard
  const hbX = SIZE * 0.18;
  const hbY = SIZE * 0.12;
  ctx.fillStyle = rgb(palette[0], 0.85);
  ctx.fillRect(hbX, hbY, 90, 60);
  ctx.fillStyle = rgb(palette[1], 0.85);
  ctx.fillRect(hbX + 4, hbY + 4, 82, 8);
  // kanji-like marks
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = rgb(palette[1]);
    ctx.fillRect(hbX + 8 + i * 18, hbY + 18, 4, 38);
    ctx.fillRect(hbX + 6 + i * 18, hbY + 28, 12, 3);
  }

  // Neon sign right
  ctx.fillStyle = rgb(palette[0]);
  ctx.fillRect(SIZE * 0.78, SIZE * 0.28, 10, 60);
  ctx.fillStyle = rgb(palette[1]);
  ctx.fillRect(SIZE * 0.78, SIZE * 0.28, 60, 10);
  ctx.fillRect(SIZE * 0.78, SIZE * 0.4, 60, 10);
  // glow
  lensHalo(ctx, SIZE * 0.81, SIZE * 0.34, 80, palette[0], 0.5);

  // Flying car streak
  ctx.strokeStyle = rgb(palette[1], 0.85);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(SIZE * 0.05, SIZE * 0.4);
  ctx.lineTo(SIZE * 0.22, SIZE * 0.42);
  ctx.stroke();
  ctx.fillStyle = rgb(palette[1]);
  ctx.beginPath();
  ctx.arc(SIZE * 0.22, SIZE * 0.42, 4, 0, Math.PI * 2);
  ctx.fill();

  // Wet street with reflections
  const street = ctx.createLinearGradient(0, SIZE * 0.7, 0, SIZE);
  street.addColorStop(0, rgb(palette[2]));
  street.addColorStop(1, rgb(darken(palette[2], 0.05)));
  ctx.fillStyle = street;
  ctx.fillRect(0, SIZE * 0.7, SIZE, SIZE * 0.3);
  // Neon reflections (vertical streaks of color)
  ctx.fillStyle = rgb(palette[0], 0.18);
  ctx.fillRect(SIZE * 0.16, SIZE * 0.7, 90, SIZE * 0.3);
  ctx.fillStyle = rgb(palette[1], 0.16);
  ctx.fillRect(SIZE * 0.78, SIZE * 0.7, 60, SIZE * 0.3);
  // Street puddle highlights
  for (let i = 0; i < 8; i++) {
    const px = (i * 0.13) * SIZE + 20;
    ctx.fillStyle = rgb([1, 1, 1], 0.05);
    ctx.fillRect(px, SIZE * (0.78 + Math.random() * 0.18), 30, 1);
  }

  // Rain — multiple layers (close fast, far slow)
  const rng = seedRng(83);
  for (let i = 0; i < 200; i++) {
    const x = rng() * SIZE;
    const y = rng() * SIZE;
    const len = 12 + rng() * 18;
    ctx.strokeStyle = rgb(palette[1], 0.25 + rng() * 0.4);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 4, y + len);
    ctx.stroke();
  }

  applyGrain(ctx, 0.06);
  applyVignette(ctx, 0.55, 0.35);
}

function drawCity(ctx, baseY, minH, maxH, color, opacity, seed) {
  const rng = seedRng(seed);
  ctx.fillStyle = color;
  ctx.globalAlpha = opacity;
  let x = 0;
  while (x < SIZE) {
    const w = 30 + rng() * 60;
    const h = minH + rng() * (maxH - minH);
    ctx.fillRect(x, baseY - h, w, h);
    // Lit windows
    ctx.globalAlpha = opacity * 0.95;
    for (let wy = baseY - h + 8; wy < baseY - 8; wy += 14) {
      for (let wx = x + 6; wx < x + w - 6; wx += 10) {
        if (rng() > 0.5) {
          ctx.fillStyle = rng() > 0.5 ? '#ffaa30' : '#88ccff';
          ctx.fillRect(wx, wy, 4, 6);
        }
      }
    }
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    x += w + 2;
  }
  ctx.globalAlpha = 1;
}

function paintPixel(ctx, palette) {
  // Proper pixel-art landscape: sky → mountains → ground → hero
  const px = SIZE / 32; // 32x32 pixels
  // Sky
  for (let y = 0; y < 18; y++) {
    const t = y / 18;
    const c = mix(palette[0], lighten(palette[1], 0.1), t);
    ctx.fillStyle = rgb(c);
    ctx.fillRect(0, y * px, SIZE, px + 1);
  }
  // Sun
  drawPixel(ctx, [1, 0.9, 0.4], 22, 4, 1, 1);
  drawPixel(ctx, [1, 0.85, 0.3], 21, 4, 1, 1);
  drawPixel(ctx, [1, 0.85, 0.3], 23, 4, 1, 1);
  drawPixel(ctx, [1, 0.9, 0.4], 22, 3, 1, 1);
  drawPixel(ctx, [1, 0.9, 0.4], 22, 5, 1, 1);
  drawPixel(ctx, [1, 0.95, 0.6], 22, 4, 1, 1, 0.7);
  // Cloud (left)
  const cloudPx = [
    [4, 5], [5, 5], [6, 5], [7, 5],
    [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6],
    [4, 7], [5, 7], [6, 7], [7, 7],
  ];
  cloudPx.forEach(([cx, cy]) => drawPixel(ctx, [1, 1, 1], cx, cy, 1, 1));
  // Mountains (pixel triangles)
  drawPixelTri(ctx, palette[2], 0, 18, 9, 5);
  drawPixelTri(ctx, mix(palette[2], palette[0], 0.4), 7, 16, 8, 7);
  drawPixelTri(ctx, palette[2], 16, 17, 10, 6);
  drawPixelTri(ctx, mix(palette[2], palette[0], 0.5), 24, 18, 8, 5);

  // Ground
  for (let y = 23; y < 32; y++) {
    const t = (y - 23) / 9;
    const c = mix(palette[1], darken(palette[1], 0.25), t);
    ctx.fillStyle = rgb(c);
    ctx.fillRect(0, y * px, SIZE, px + 1);
  }
  // Grass tufts
  for (let i = 0; i < 14; i++) {
    const gx = i * 2 + (i % 2);
    drawPixel(ctx, darken(palette[1], 0.15), gx, 23, 1, 1);
  }
  // Tree
  const tx = 6;
  const ty = 18;
  // canopy
  [[tx, ty], [tx + 1, ty], [tx - 1, ty], [tx, ty + 1], [tx + 1, ty + 1], [tx - 1, ty + 1], [tx, ty - 1]].forEach(([cx, cy]) =>
    drawPixel(ctx, [0.18, 0.4, 0.2], cx, cy, 1, 1)
  );
  // trunk
  drawPixel(ctx, [0.3, 0.18, 0.1], tx, ty + 2, 1, 3);

  // Hero sprite (centered, around y=20)
  const hx = 15;
  const hy = 19;
  // Head
  drawPixel(ctx, [1, 0.85, 0.7], hx, hy, 2, 2);
  // hair
  drawPixel(ctx, [0.3, 0.18, 0.1], hx, hy, 2, 1);
  // body
  drawPixel(ctx, [0.7, 0.2, 0.18], hx, hy + 2, 2, 2);
  // legs
  drawPixel(ctx, [0.25, 0.18, 0.55], hx, hy + 4, 1, 2);
  drawPixel(ctx, [0.25, 0.18, 0.55], hx + 1, hy + 4, 1, 2);
  // sword (right)
  drawPixel(ctx, [0.85, 0.85, 0.95], hx + 2, hy + 1, 1, 4);
  drawPixel(ctx, [0.95, 0.85, 0.4], hx + 1, hy + 5, 2, 1);

  // CRT scanlines
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  for (let y = 0; y < SIZE; y += 4) ctx.fillRect(0, y, SIZE, 1);
  // Subtle RGB shift
  ctx.fillStyle = 'rgba(255, 0, 64, 0.04)';
  ctx.fillRect(0, 0, SIZE, SIZE);

  applyVignette(ctx, 0.45, 0.42);
}

function drawPixel(ctx, color, x, y, w = 1, h = 1, alpha = 1) {
  const px = SIZE / 32;
  ctx.fillStyle = rgb(color, alpha);
  ctx.fillRect(x * px, y * px, px * w, px * h);
}

function drawPixelTri(ctx, color, x, baseY, w, h) {
  const px = SIZE / 32;
  ctx.fillStyle = rgb(color);
  for (let row = 0; row < h; row++) {
    const rowW = Math.round(w * (1 - row / h));
    const offset = Math.round((w - rowW) / 2);
    ctx.fillRect((x + offset) * px, (baseY - row - 1) * px, rowW * px, px);
  }
}

function paintVoxel(ctx, palette) {
  // Sky gradient + distant voxel landscape + foreground house
  const sky = ctx.createLinearGradient(0, 0, 0, SIZE);
  sky.addColorStop(0, rgb(lighten(palette[0], 0.1)));
  sky.addColorStop(0.6, rgb(mix(palette[0], palette[1], 0.5)));
  sky.addColorStop(1, rgb(palette[1]));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Distant cube mountains
  const cubeW = 36;
  const cubeH = 22;
  const topC = palette[1];
  const leftC = palette[2];
  const rightC = darken(palette[1], 0.18);
  // Background mountain row
  for (let i = 0; i < 12; i++) {
    const stack = 1 + (i % 3);
    for (let s = 0; s < stack; s++) {
      drawCube(ctx, i * cubeW * 0.85 - 30, SIZE * 0.55 - s * cubeH, cubeW, cubeH,
        lighten(topC, 0.05), lighten(leftC, 0.1), lighten(rightC, 0.05));
    }
  }
  // Mid-ground grass cubes
  for (let i = 0; i < 16; i++) {
    drawCube(ctx, i * cubeW - 20 + (Math.floor(i / 4) % 2) * cubeW * 0.5, SIZE * 0.7 + (i % 3 - 1) * 2, cubeW, cubeH,
      [0.4, 0.7, 0.35], [0.55, 0.4, 0.22], [0.32, 0.55, 0.28]);
  }
  // Foreground house
  const hx = SIZE * 0.4;
  const hy = SIZE * 0.6;
  // Walls
  drawCube(ctx, hx, hy, cubeW * 1.4, cubeH * 1.4, [0.95, 0.85, 0.6], [0.6, 0.4, 0.25], [0.75, 0.55, 0.35]);
  drawCube(ctx, hx + cubeW * 1.4 * 0.5, hy - cubeH * 0.7, cubeW * 1.4, cubeH * 1.4, [0.95, 0.85, 0.6], [0.6, 0.4, 0.25], [0.75, 0.55, 0.35]);
  // Roof (red)
  drawCube(ctx, hx + cubeW * 0.3, hy - cubeH * 0.7, cubeW * 1.4, cubeH * 1.0, [0.85, 0.3, 0.2], [0.45, 0.1, 0.05], [0.65, 0.2, 0.1]);
  drawCube(ctx, hx + cubeW * 1.4 * 0.5 + cubeW * 0.3, hy - cubeH * 1.4, cubeW * 1.4, cubeH * 1.0, [0.85, 0.3, 0.2], [0.45, 0.1, 0.05], [0.65, 0.2, 0.1]);
  // Door (window-like)
  ctx.fillStyle = '#3a2a18';
  ctx.fillRect(hx + cubeW * 0.85, hy + cubeH * 0.35, 14, 22);
  // Window
  ctx.fillStyle = '#ffd060';
  ctx.fillRect(hx + cubeW * 1.3, hy + cubeH * 0.4, 12, 12);

  // Trees
  for (const [tx, ty] of [[SIZE * 0.18, SIZE * 0.7], [SIZE * 0.8, SIZE * 0.72]]) {
    // trunk
    ctx.fillStyle = '#5a3a1f';
    ctx.fillRect(tx, ty, 10, 30);
    // foliage cubes
    drawCube(ctx, tx - 12, ty - 28, 26, cubeH * 0.7, [0.32, 0.6, 0.28], [0.18, 0.35, 0.18], [0.22, 0.45, 0.22]);
  }

  applyGrain(ctx, 0.05);
  applyVignette(ctx, 0.4, 0.4);
}

function drawCube(ctx, x, y, w, h, top, left, right) {
  // top diamond
  ctx.fillStyle = rgb(top);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w / 2, y - h / 2);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w / 2, y + h / 2);
  ctx.closePath();
  ctx.fill();
  // left
  ctx.fillStyle = rgb(left);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w / 2, y + h / 2);
  ctx.lineTo(x + w / 2, y + h);
  ctx.lineTo(x, y + h / 2);
  ctx.closePath();
  ctx.fill();
  // right
  ctx.fillStyle = rgb(right);
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y + h / 2);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h / 2);
  ctx.lineTo(x + w / 2, y + h);
  ctx.closePath();
  ctx.fill();
}

function paintCellShaded(ctx, palette) {
  // Wind Waker / Borderlands — bold flat regions, thick black outlines
  // Sky
  ctx.fillStyle = rgb(palette[0]);
  ctx.fillRect(0, 0, SIZE, SIZE * 0.55);
  // Ground
  ctx.fillStyle = rgb(palette[1]);
  ctx.fillRect(0, SIZE * 0.55, SIZE, SIZE * 0.45);
  // Distant hill (smaller, lighter)
  ctx.fillStyle = rgb(mix(palette[2], palette[0], 0.5));
  ctx.beginPath();
  ctx.arc(SIZE * 0.85, SIZE * 0.7, SIZE * 0.18, Math.PI, 0);
  ctx.fill();
  // Foreground hill
  ctx.fillStyle = rgb(palette[2]);
  ctx.beginPath();
  ctx.arc(SIZE * 0.5, SIZE * 0.92, SIZE * 0.45, Math.PI, 0);
  ctx.fill();
  // Sun with rays
  const sunX = SIZE * 0.78;
  const sunY = SIZE * 0.22;
  ctx.fillStyle = '#ffe060';
  ctx.beginPath();
  ctx.arc(sunX, sunY, SIZE * 0.09, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffe060';
  ctx.lineWidth = 5;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(sunX + Math.cos(a) * SIZE * 0.105, sunY + Math.sin(a) * SIZE * 0.105);
    ctx.lineTo(sunX + Math.cos(a) * SIZE * 0.15, sunY + Math.sin(a) * SIZE * 0.15);
    ctx.stroke();
  }
  // Clouds (lobed)
  ctx.fillStyle = '#ffffff';
  drawCloud(ctx, SIZE * 0.18, SIZE * 0.18, 1.0);
  drawCloud(ctx, SIZE * 0.5, SIZE * 0.12, 0.7);
  // Tree
  drawCellTree(ctx, SIZE * 0.18, SIZE * 0.65);
  // Bird
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(SIZE * 0.45, SIZE * 0.28);
  ctx.quadraticCurveTo(SIZE * 0.48, SIZE * 0.25, SIZE * 0.51, SIZE * 0.28);
  ctx.quadraticCurveTo(SIZE * 0.54, SIZE * 0.25, SIZE * 0.57, SIZE * 0.28);
  ctx.stroke();
  // Outlines on every shape
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 7;
  // sun
  ctx.beginPath();
  ctx.arc(sunX, sunY, SIZE * 0.09, 0, Math.PI * 2);
  ctx.stroke();
  // hill
  ctx.beginPath();
  ctx.arc(SIZE * 0.5, SIZE * 0.92, SIZE * 0.45, Math.PI, 0);
  ctx.stroke();
  // distant hill
  ctx.beginPath();
  ctx.arc(SIZE * 0.85, SIZE * 0.7, SIZE * 0.18, Math.PI, 0);
  ctx.stroke();
  // Horizon line
  ctx.beginPath();
  ctx.moveTo(0, SIZE * 0.55);
  ctx.lineTo(SIZE, SIZE * 0.55);
  ctx.stroke();
}

function drawCloud(ctx, x, y, scale) {
  ctx.fillStyle = '#ffffff';
  const lobes = [
    [-32, 0, 30],
    [-15, -8, 22],
    [3, -10, 26],
    [22, -6, 24],
    [38, 2, 20],
  ];
  ctx.beginPath();
  lobes.forEach(([dx, dy, r]) => {
    ctx.moveTo(x + dx * scale + r * scale, y + dy * scale);
    ctx.arc(x + dx * scale, y + dy * scale, r * scale, 0, Math.PI * 2);
  });
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 5 * scale;
  // outline approximation
  ctx.beginPath();
  ctx.ellipse(x, y - 4 * scale, 50 * scale, 18 * scale, 0, 0, Math.PI * 2);
  ctx.stroke();
}

function drawCellTree(ctx, x, y) {
  // Foliage as bumpy circle
  ctx.fillStyle = '#2a4f28';
  const lobes = [
    [0, 0, 50],
    [-30, -10, 30],
    [25, -15, 32],
    [-15, -32, 28],
    [22, -28, 26],
  ];
  ctx.beginPath();
  lobes.forEach(([dx, dy, r]) => {
    ctx.moveTo(x + dx + r, y + dy);
    ctx.arc(x + dx, y + dy, r, 0, Math.PI * 2);
  });
  ctx.fill();
  // Trunk
  ctx.fillStyle = '#3a2818';
  ctx.fillRect(x - 8, y, 16, SIZE * 0.18);
  // Outlines
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(x, y - 8, 50, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeRect(x - 8, y, 16, SIZE * 0.18);
}

function paintSteampunk(ctx, palette) {
  // Brass radial gradient with patina + airship + interlocking gears + pipes
  const grad = ctx.createRadialGradient(SIZE / 2, SIZE / 2, 0, SIZE / 2, SIZE / 2, SIZE * 0.7);
  grad.addColorStop(0, rgb(lighten(palette[1], 0.05)));
  grad.addColorStop(0.55, rgb(palette[1]));
  grad.addColorStop(1, rgb(palette[2]));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE);
  // Patina patches
  const rng = seedRng(67);
  for (let i = 0; i < 14; i++) {
    wash(ctx, rng() * SIZE, rng() * SIZE, 30 + rng() * 80, [0.4, 0.55, 0.4], 0.18);
  }
  // Airship in upper area
  // Balloon
  const ax = SIZE * 0.78;
  const ay = SIZE * 0.2;
  ctx.fillStyle = '#3a2010';
  ctx.beginPath();
  ctx.ellipse(ax, ay, 75, 35, -0.08, 0, Math.PI * 2);
  ctx.fill();
  // Balloon stripes
  ctx.fillStyle = '#5a3520';
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.ellipse(ax + i * 25, ay + i * 1, 4, 35 - Math.abs(i) * 7, -0.08, 0, Math.PI * 2);
    ctx.fill();
  }
  // Gondola
  ctx.fillStyle = '#2a1808';
  ctx.fillRect(ax - 24, ay + 30, 48, 18);
  // Ropes
  ctx.strokeStyle = '#1a0e08';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(ax - 24 + i * 16, ay + 30);
    ctx.lineTo(ax - 30 + i * 18, ay + 12);
    ctx.stroke();
  }
  // Propeller
  ctx.fillStyle = '#2a1808';
  ctx.fillRect(ax + 24, ay + 36, 14, 4);
  ctx.fillRect(ax + 36, ay + 30, 2, 16);
  // Pipes (foreground)
  ctx.strokeStyle = '#5a3520';
  ctx.lineWidth = 22;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, SIZE * 0.86);
  ctx.lineTo(SIZE * 0.7, SIZE * 0.86);
  ctx.lineTo(SIZE * 0.7, SIZE * 0.6);
  ctx.lineTo(SIZE, SIZE * 0.6);
  ctx.stroke();
  ctx.strokeStyle = '#3a2010';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(0, SIZE * 0.86);
  ctx.lineTo(SIZE * 0.7, SIZE * 0.86);
  ctx.lineTo(SIZE * 0.7, SIZE * 0.6);
  ctx.lineTo(SIZE, SIZE * 0.6);
  ctx.stroke();
  // Bolts on pipes
  ctx.fillStyle = '#1a0e08';
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.arc(60 + i * 70, SIZE * 0.86, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  // Gauge on pipe
  ctx.fillStyle = '#cdb98a';
  ctx.beginPath();
  ctx.arc(SIZE * 0.7, SIZE * 0.7, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1a0e08';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(SIZE * 0.7, SIZE * 0.7, 18, 0, Math.PI * 2);
  ctx.stroke();
  // Needle
  ctx.beginPath();
  ctx.moveTo(SIZE * 0.7, SIZE * 0.7);
  ctx.lineTo(SIZE * 0.7 + 12, SIZE * 0.7 - 8);
  ctx.stroke();

  // Three interlocking gears (mid-ground)
  drawGear(ctx, SIZE * 0.32, SIZE * 0.5, 80, palette[0]);
  drawGear(ctx, SIZE * 0.55, SIZE * 0.36, 55, palette[0]);
  drawGear(ctx, SIZE * 0.5, SIZE * 0.65, 45, palette[0]);
  // Smaller decorative gears
  drawGear(ctx, SIZE * 0.15, SIZE * 0.32, 28, lighten(palette[0], 0.1));

  // Steam puffs from airship
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = `rgba(220, 200, 170, ${0.45 - i * 0.08})`;
    ctx.beginPath();
    ctx.arc(ax + 50 + i * 12, ay + 38 + i * 4, 12 + i * 4, 0, Math.PI * 2);
    ctx.fill();
  }

  applyGrain(ctx, 0.07, 'multiply');
  applyVignette(ctx, 0.45, 0.36);
}

function drawGear(ctx, cx, cy, r, color) {
  const teeth = 12;
  ctx.fillStyle = rgb(color);
  ctx.beginPath();
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2;
    const rr = i % 2 ? r * 1.18 : r;
    const x = cx + Math.cos(a) * rr;
    const y = cy + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  // Bevel: dark inner
  ctx.fillStyle = rgb(darken(color, 0.18));
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.78, 0, Math.PI * 2);
  ctx.fill();
  // Lighter rim accent
  ctx.fillStyle = rgb(lighten(color, 0.18));
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.62, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = rgb(darken(color, 0.05));
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
  ctx.fill();
  // Spokes
  ctx.strokeStyle = '#1a0e08';
  ctx.lineWidth = 5;
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r * 0.18, cy + Math.sin(a) * r * 0.18);
    ctx.lineTo(cx + Math.cos(a) * r * 0.5, cy + Math.sin(a) * r * 0.5);
    ctx.stroke();
  }
  // Center bolt
  ctx.fillStyle = '#1a0e08';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = rgb(lighten(color, 0.3));
  ctx.beginPath();
  ctx.arc(cx - r * 0.05, cy - r * 0.05, r * 0.07, 0, Math.PI * 2);
  ctx.fill();
}

function paintCozy(ctx, palette) {
  // Sunny meadow with cottage, garden, tree, distant hills, butterflies
  // Sky gradient (warm sunset peach)
  const sky = ctx.createLinearGradient(0, 0, 0, SIZE);
  sky.addColorStop(0, rgb(lighten(palette[1], 0.15)));
  sky.addColorStop(0.5, rgb([1, 0.9, 0.78]));
  sky.addColorStop(0.75, rgb(palette[2]));
  sky.addColorStop(1, rgb(darken(palette[2], 0.1)));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, SIZE, SIZE);
  // Sun
  lensHalo(ctx, SIZE * 0.78, SIZE * 0.22, SIZE * 0.32, [1, 0.95, 0.7], 0.6);
  ctx.fillStyle = '#fff5cc';
  ctx.beginPath();
  ctx.arc(SIZE * 0.78, SIZE * 0.22, SIZE * 0.06, 0, Math.PI * 2);
  ctx.fill();
  // Distant rolling hills
  ctx.fillStyle = rgb(mix(palette[2], palette[0], 0.5), 0.85);
  silhouetteRidge(ctx, SIZE * 0.6, mix(palette[2], palette[0], 0.5), 30, 100, 41);
  ctx.fillStyle = rgb(palette[0]);
  silhouetteRidge(ctx, SIZE * 0.65, palette[0], 25, 130, 47);
  // Meadow ground
  ctx.fillStyle = rgb([0.55, 0.8, 0.4]);
  ctx.fillRect(0, SIZE * 0.65, SIZE, SIZE * 0.35);
  // Foreground darker grass
  ctx.fillStyle = rgb([0.4, 0.62, 0.3]);
  ctx.fillRect(0, SIZE * 0.85, SIZE, SIZE * 0.15);

  // Path
  ctx.fillStyle = '#d4a575';
  ctx.beginPath();
  ctx.moveTo(SIZE * 0.45, SIZE * 0.65);
  ctx.lineTo(SIZE * 0.55, SIZE * 0.65);
  ctx.lineTo(SIZE * 0.7, SIZE);
  ctx.lineTo(SIZE * 0.3, SIZE);
  ctx.closePath();
  ctx.fill();

  // Cottage
  const cox = SIZE * 0.42;
  const coy = SIZE * 0.5;
  const cow = SIZE * 0.16;
  const coh = SIZE * 0.14;
  // walls
  ctx.fillStyle = '#e8d4a8';
  ctx.fillRect(cox, coy, cow, coh);
  // roof
  ctx.fillStyle = '#8a4530';
  ctx.beginPath();
  ctx.moveTo(cox - 6, coy);
  ctx.lineTo(cox + cow / 2, coy - SIZE * 0.07);
  ctx.lineTo(cox + cow + 6, coy);
  ctx.closePath();
  ctx.fill();
  // chimney
  ctx.fillStyle = '#aa5535';
  ctx.fillRect(cox + cow * 0.7, coy - SIZE * 0.08, 14, SIZE * 0.06);
  // chimney smoke (curling)
  ctx.strokeStyle = 'rgba(220, 220, 220, 0.7)';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cox + cow * 0.7 + 7, coy - SIZE * 0.08);
  ctx.bezierCurveTo(cox + cow * 0.7 - 10, coy - SIZE * 0.13, cox + cow * 0.7 + 25, coy - SIZE * 0.18, cox + cow * 0.7 + 5, coy - SIZE * 0.23);
  ctx.stroke();
  // door (warm glow)
  ctx.fillStyle = '#5a3a20';
  ctx.fillRect(cox + cow * 0.4, coy + coh * 0.45, cow * 0.22, coh * 0.55);
  ctx.fillStyle = '#ffd060';
  ctx.fillRect(cox + cow * 0.42, coy + coh * 0.5, cow * 0.18, coh * 0.5);
  // window
  ctx.fillStyle = '#ffd060';
  ctx.fillRect(cox + cow * 0.7, coy + coh * 0.25, cow * 0.2, coh * 0.25);
  ctx.strokeStyle = '#5a3a20';
  ctx.lineWidth = 2;
  ctx.strokeRect(cox + cow * 0.7, coy + coh * 0.25, cow * 0.2, coh * 0.25);
  ctx.beginPath();
  ctx.moveTo(cox + cow * 0.8, coy + coh * 0.25);
  ctx.lineTo(cox + cow * 0.8, coy + coh * 0.5);
  ctx.moveTo(cox + cow * 0.7, coy + coh * 0.375);
  ctx.lineTo(cox + cow * 0.9, coy + coh * 0.375);
  ctx.stroke();

  // Tree
  ctx.fillStyle = '#3a2818';
  ctx.fillRect(SIZE * 0.18, SIZE * 0.6, 16, SIZE * 0.22);
  ctx.fillStyle = '#3a6028';
  ctx.beginPath();
  ctx.arc(SIZE * 0.2, SIZE * 0.55, 50, 0, Math.PI * 2);
  ctx.fill();
  // tree highlights
  ctx.fillStyle = '#5a8038';
  ctx.beginPath();
  ctx.arc(SIZE * 0.18, SIZE * 0.52, 25, 0, Math.PI * 2);
  ctx.fill();

  // Flowers
  const rng = seedRng(151);
  for (let i = 0; i < 22; i++) {
    const fx = rng() * SIZE;
    const fy = SIZE * 0.78 + rng() * SIZE * 0.18;
    const c = rng() < 0.4 ? '#ff6080' : rng() < 0.7 ? '#ffd040' : '#a060e8';
    ctx.fillStyle = c;
    // 5 petals
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(fx + Math.cos(a) * 3, fy + Math.sin(a) * 3, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#ffe860';
    ctx.beginPath();
    ctx.arc(fx, fy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  // Butterflies
  for (let i = 0; i < 4; i++) {
    const bx = rng() * SIZE;
    const by = SIZE * 0.5 + rng() * SIZE * 0.25;
    ctx.fillStyle = rng() > 0.5 ? '#ff9050' : '#80a0ff';
    ctx.beginPath();
    ctx.arc(bx - 3, by, 4, 0, Math.PI * 2);
    ctx.arc(bx + 3, by, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  applyGrain(ctx, 0.04);
  applyVignette(ctx, 0.3, 0.45);
}

function paintHorror(ctx, palette) {
  // Foggy red/dark forest with twisted trees, multiple eye glows, creature emerging
  const sky = ctx.createLinearGradient(0, 0, 0, SIZE);
  sky.addColorStop(0, rgb(darken(palette[2], 0.1)));
  sky.addColorStop(0.55, rgb(mix(palette[2], palette[1], 0.4)));
  sky.addColorStop(1, rgb(palette[2]));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, SIZE, SIZE);
  // Distant fog/glow
  lensHalo(ctx, SIZE * 0.5, SIZE * 0.6, SIZE * 0.45, palette[0], 0.25);
  // Twisted dead trees
  const rng = seedRng(89);
  for (let i = 0; i < 6; i++) {
    const tx = rng() * SIZE;
    const ty = SIZE * 0.55 + rng() * SIZE * 0.1;
    drawDeadTree(ctx, tx, ty, 60 + rng() * 40, rng);
  }
  // Multiple distant glowing eye pairs
  const eyePairs = [
    [SIZE * 0.18, SIZE * 0.45, 0.5],
    [SIZE * 0.32, SIZE * 0.4, 0.4],
    [SIZE * 0.7, SIZE * 0.42, 0.5],
    [SIZE * 0.85, SIZE * 0.5, 0.45],
  ];
  eyePairs.forEach(([x, y, sc]) => drawGlowingEyes(ctx, x, y, sc, palette));
  // Foreground creature silhouette
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.moveTo(SIZE * 0.35, SIZE);
  ctx.lineTo(SIZE * 0.35, SIZE * 0.7);
  ctx.lineTo(SIZE * 0.42, SIZE * 0.55);
  ctx.lineTo(SIZE * 0.5, SIZE * 0.6);
  ctx.lineTo(SIZE * 0.58, SIZE * 0.55);
  ctx.lineTo(SIZE * 0.65, SIZE * 0.7);
  ctx.lineTo(SIZE * 0.65, SIZE);
  ctx.closePath();
  ctx.fill();
  // Big glowing eyes on creature
  drawGlowingEyes(ctx, SIZE * 0.5, SIZE * 0.62, 1.4, palette);
  // Drips
  ctx.strokeStyle = rgb(palette[0]);
  ctx.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    const x = SIZE * (0.4 + rng() * 0.2);
    const y = SIZE * (0.65 + rng() * 0.2);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 8 + rng() * 14);
    ctx.stroke();
  }
  // Heavy fog overlay
  for (let i = 0; i < 8; i++) {
    wash(ctx, rng() * SIZE, SIZE * 0.4 + rng() * SIZE * 0.3, 100 + rng() * 100, palette[2], 0.2);
  }

  applyGrain(ctx, 0.15, 'multiply');
  applyVignette(ctx, 0.7, 0.3);
}

function drawDeadTree(ctx, x, y, h, rng) {
  ctx.strokeStyle = '#080404';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  // trunk (jittered)
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  let cx = x;
  let cy = y + h;
  for (let i = 0; i < 6; i++) {
    cx += (rng() - 0.5) * 8;
    cy -= h / 6;
    ctx.lineTo(cx, cy);
  }
  ctx.stroke();
  // branches
  for (let i = 0; i < 5; i++) {
    ctx.lineWidth = 2;
    const bx = x + (rng() - 0.5) * 10;
    const by = y + h * (0.2 + rng() * 0.5);
    const len = 25 + rng() * 30;
    const ang = (rng() - 0.5) * 1.4 + (rng() < 0.5 ? Math.PI * 0.7 : Math.PI * 0.3);
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + Math.cos(ang) * len, by - Math.abs(Math.sin(ang) * len));
    ctx.stroke();
  }
}

function drawGlowingEyes(ctx, x, y, scale, palette) {
  const r = 5 * scale;
  // Glow
  const halo = ctx.createRadialGradient(x - 8 * scale, y, 0, x - 8 * scale, y, 25 * scale);
  halo.addColorStop(0, rgb(palette[0], 0.7));
  halo.addColorStop(1, rgb(palette[0], 0));
  ctx.fillStyle = halo;
  ctx.fillRect(x - 40 * scale, y - 30 * scale, 80 * scale, 60 * scale);
  const halo2 = ctx.createRadialGradient(x + 8 * scale, y, 0, x + 8 * scale, y, 25 * scale);
  halo2.addColorStop(0, rgb(palette[0], 0.7));
  halo2.addColorStop(1, rgb(palette[0], 0));
  ctx.fillStyle = halo2;
  ctx.fillRect(x - 40 * scale, y - 30 * scale, 80 * scale, 60 * scale);
  // Eyes
  ctx.fillStyle = rgb(palette[0]);
  ctx.beginPath();
  ctx.arc(x - 8 * scale, y, r, 0, Math.PI * 2);
  ctx.arc(x + 8 * scale, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x - 8 * scale, y, r * 0.4, 0, Math.PI * 2);
  ctx.arc(x + 8 * scale, y, r * 0.4, 0, Math.PI * 2);
  ctx.fill();
}

function paintNoir(ctx, palette) {
  // Monochrome rain street, lamp post, detective with cigarette
  const sky = ctx.createLinearGradient(0, 0, 0, SIZE);
  sky.addColorStop(0, rgb(palette[2]));
  sky.addColorStop(0.6, rgb(mix(palette[2], palette[0], 0.2)));
  sky.addColorStop(1, rgb(palette[2]));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, SIZE, SIZE);
  // Distant skyline
  ctx.fillStyle = rgb(darken(palette[2], 0.1));
  silhouetteRidge(ctx, SIZE * 0.45, darken(palette[2], 0.05), 60, 90, 97);
  // Lit windows in skyline
  const rng = seedRng(101);
  for (let i = 0; i < 20; i++) {
    if (rng() > 0.6) {
      ctx.fillStyle = rgb(palette[1], 0.4);
      ctx.fillRect(rng() * SIZE, SIZE * (0.32 + rng() * 0.13), 3, 4);
    }
  }
  // Wet street with cobblestone
  ctx.fillStyle = rgb(darken(palette[2], 0.08));
  ctx.fillRect(0, SIZE * 0.65, SIZE, SIZE * 0.35);
  // Cobblestones (perspective)
  for (let row = 0; row < 6; row++) {
    const y = SIZE * 0.65 + row * 28 + row * row * 3;
    const cellW = 30 + row * 6;
    for (let x = -cellW; x < SIZE + cellW; x += cellW) {
      const offset = (row % 2) * cellW * 0.5;
      ctx.strokeStyle = rgb(darken(palette[2], 0.18), 0.6);
      ctx.lineWidth = 1;
      ctx.strokeRect(x + offset, y, cellW, 28 + row * 3);
    }
  }
  // Lamp post left
  ctx.fillStyle = '#080a0e';
  ctx.fillRect(SIZE * 0.06, SIZE * 0.35, 4, SIZE * 0.55);
  ctx.fillRect(SIZE * 0.05, SIZE * 0.32, 6, 8);
  ctx.beginPath();
  ctx.arc(SIZE * 0.07, SIZE * 0.3, 8, 0, Math.PI * 2);
  ctx.fill();
  // Lamp glow
  lensHalo(ctx, SIZE * 0.07, SIZE * 0.3, 100, [1, 0.85, 0.5], 0.8);
  // Light pool on street
  const pool = ctx.createRadialGradient(SIZE * 0.08, SIZE * 0.85, 0, SIZE * 0.08, SIZE * 0.85, 130);
  pool.addColorStop(0, 'rgba(255, 220, 150, 0.4)');
  pool.addColorStop(1, 'rgba(255, 220, 150, 0)');
  ctx.fillStyle = pool;
  ctx.fillRect(0, SIZE * 0.65, SIZE, SIZE * 0.35);
  // Detective silhouette
  const dx = SIZE * 0.35;
  ctx.fillStyle = '#000000';
  // Trench coat brim hat
  ctx.beginPath();
  ctx.ellipse(dx, SIZE * 0.55, 28, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(dx - 14, SIZE * 0.5, 28, 12);
  // Head (under hat)
  ctx.beginPath();
  ctx.arc(dx, SIZE * 0.56, 13, 0, Math.PI * 2);
  ctx.fill();
  // Body — trenchcoat tapering
  ctx.beginPath();
  ctx.moveTo(dx - 22, SIZE * 0.62);
  ctx.lineTo(dx + 22, SIZE * 0.62);
  ctx.lineTo(dx + 28, SIZE);
  ctx.lineTo(dx - 28, SIZE);
  ctx.closePath();
  ctx.fill();
  // Coat collar (subtly lighter)
  ctx.fillStyle = rgb(darken(palette[2], 0.1));
  ctx.beginPath();
  ctx.moveTo(dx - 14, SIZE * 0.62);
  ctx.lineTo(dx, SIZE * 0.7);
  ctx.lineTo(dx + 14, SIZE * 0.62);
  ctx.closePath();
  ctx.fill();
  // Cigarette glow
  ctx.fillStyle = '#ff8030';
  ctx.beginPath();
  ctx.arc(dx + 11, SIZE * 0.58, 2.5, 0, Math.PI * 2);
  ctx.fill();
  // Smoke wisp
  ctx.strokeStyle = 'rgba(220, 220, 220, 0.4)';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(dx + 12, SIZE * 0.58);
  ctx.bezierCurveTo(dx + 30, SIZE * 0.5, dx + 18, SIZE * 0.42, dx + 36, SIZE * 0.34);
  ctx.stroke();
  // Femme fatale silhouette (distant)
  ctx.fillStyle = '#000000';
  const fx = SIZE * 0.78;
  // body
  ctx.beginPath();
  ctx.moveTo(fx - 8, SIZE);
  ctx.lineTo(fx - 4, SIZE * 0.7);
  ctx.lineTo(fx + 4, SIZE * 0.7);
  ctx.lineTo(fx + 8, SIZE);
  ctx.closePath();
  ctx.fill();
  // head
  ctx.beginPath();
  ctx.arc(fx, SIZE * 0.66, 7, 0, Math.PI * 2);
  ctx.fill();
  // Heavy rain
  for (let i = 0; i < 280; i++) {
    const x = rng() * SIZE;
    const y = rng() * SIZE;
    const len = 14 + rng() * 18;
    ctx.strokeStyle = rgb(palette[0], 0.25 + rng() * 0.3);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 4, y + len);
    ctx.stroke();
  }

  applyGrain(ctx, 0.08, 'multiply');
  applyVignette(ctx, 0.6, 0.3);
}

function paintCosmicHorror(ctx, palette) {
  // Detailed eye with iris bands, organic tentacles, smaller hidden eyes
  const grad = ctx.createRadialGradient(SIZE / 2, SIZE / 2, 0, SIZE / 2, SIZE / 2, SIZE * 0.7);
  grad.addColorStop(0, rgb(palette[1]));
  grad.addColorStop(1, rgb(palette[2]));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE);
  // Distant stars
  starfield(ctx, 60, 137, lighten(palette[0], 0.3));
  // Smaller hidden eyes lurking
  for (const [hx, hy] of [
    [SIZE * 0.15, SIZE * 0.25],
    [SIZE * 0.85, SIZE * 0.78],
    [SIZE * 0.18, SIZE * 0.78],
    [SIZE * 0.82, SIZE * 0.22],
  ]) {
    lensHalo(ctx, hx, hy, 30, palette[0], 0.6);
    ctx.fillStyle = rgb(palette[0]);
    ctx.beginPath();
    ctx.arc(hx, hy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(hx, hy, 6, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Tentacles
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + 0.15;
    drawTentacle(ctx, cx, cy, a, palette);
  }
  // Cosmic mist around eye
  lensHalo(ctx, cx, cy, SIZE * 0.35, palette[0], 0.4);
  // Eye outer
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, SIZE * 0.18, 0, Math.PI * 2);
  ctx.fill();
  // Iris (multiple radial bands)
  for (let band = 0; band < 6; band++) {
    const t = band / 5;
    const c = mix(lighten(palette[0], 0.2), palette[2], t);
    ctx.fillStyle = rgb(c);
    ctx.beginPath();
    ctx.arc(cx, cy, SIZE * 0.15 - band * 6, 0, Math.PI * 2);
    ctx.fill();
  }
  // Iris radial striations
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * SIZE * 0.05, cy + Math.sin(a) * SIZE * 0.05);
    ctx.lineTo(cx + Math.cos(a) * SIZE * 0.13, cy + Math.sin(a) * SIZE * 0.13);
    ctx.stroke();
  }
  // Pupil (vertical slit)
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(cx, cy, 8, SIZE * 0.13, 0, 0, Math.PI * 2);
  ctx.fill();
  // Highlight on eye
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.beginPath();
  ctx.arc(cx - SIZE * 0.05, cy - SIZE * 0.06, 12, 0, Math.PI * 2);
  ctx.fill();

  applyGrain(ctx, 0.07, 'overlay');
  applyVignette(ctx, 0.5, 0.32);
}

function drawTentacle(ctx, cx, cy, a, palette) {
  const segments = 7;
  let lx = cx;
  let ly = cy;
  for (let s = 0; s < segments; s++) {
    const r = 50 + s * 35;
    const wob = Math.sin(s * 1.4 + a * 5) * 24;
    const nx = cx + Math.cos(a + s * 0.18) * r + wob * Math.cos(a + Math.PI / 2);
    const ny = cy + Math.sin(a + s * 0.18) * r + wob * Math.sin(a + Math.PI / 2);
    ctx.strokeStyle = rgb(mix(palette[2], palette[0], 0.4 - s * 0.05), 1);
    ctx.lineWidth = Math.max(2, 18 - s * 2.2);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(nx, ny);
    ctx.stroke();
    // Sucker dots
    if (s > 1 && s < 6) {
      ctx.fillStyle = rgb(darken(palette[2], 0.1));
      ctx.beginPath();
      ctx.arc((lx + nx) / 2, (ly + ny) / 2, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    lx = nx;
    ly = ny;
  }
}

// ---------- Painter registry ----------
export const PAINTERS = {
  fantasy: paintFantasy,
  anime: paintAnime,
  scifi: paintScifi,
  western: paintWestern,
  comics: paintComics,
  cyberpunk: paintCyberpunk,
  pixel: paintPixel,
  voxel: paintVoxel,
  cellshaded: paintCellShaded,
  steampunk: paintSteampunk,
  cozy: paintCozy,
  horror: paintHorror,
  noir: paintNoir,
  cosmichorror: paintCosmicHorror,
};

export function paintToCanvas(painterName, palette) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  const fn = PAINTERS[painterName] || paintFantasy;
  fn(ctx, palette);
  return canvas;
}
