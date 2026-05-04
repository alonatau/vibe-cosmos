// Canvas painters — each function paints a 512x512 canvas in a recognizable
// game-art style (pixel, anime, painterly, photoreal, voxel, etc.) blended
// with a recognizable game-genre scene (crosshair, sword, runner streaks,
// stadium, hex map, etc.). Result is mapped onto a sphere as a texture so
// every orb visibly reads as its art + game style.

const SIZE = 512;

const rgb = (c, a = 1) =>
  `rgba(${Math.round(c[0] * 255)}, ${Math.round(c[1] * 255)}, ${Math.round(
    c[2] * 255
  )}, ${a})`;

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

const fillBg = (ctx, palette) => {
  ctx.fillStyle = rgb(palette[2]);
  ctx.fillRect(0, 0, SIZE, SIZE);
};

const radialBg = (ctx, palette) => {
  const grad = ctx.createRadialGradient(
    SIZE / 2,
    SIZE / 2,
    SIZE * 0.05,
    SIZE / 2,
    SIZE / 2,
    SIZE * 0.7
  );
  grad.addColorStop(0, rgb(palette[1]));
  grad.addColorStop(1, rgb(palette[2]));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE);
};

const linearBg = (ctx, palette, vertical = true) => {
  const grad = vertical
    ? ctx.createLinearGradient(0, 0, 0, SIZE)
    : ctx.createLinearGradient(0, 0, SIZE, 0);
  grad.addColorStop(0, rgb(palette[0]));
  grad.addColorStop(0.55, rgb(palette[1]));
  grad.addColorStop(1, rgb(palette[2]));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE);
};

// ---------- Painters ----------

function paintLandscape(ctx, palette) {
  // sky → horizon → terrain — adventure / open-world
  const sky = ctx.createLinearGradient(0, 0, 0, SIZE * 0.6);
  sky.addColorStop(0, rgb(palette[0]));
  sky.addColorStop(1, rgb(palette[1]));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, SIZE, SIZE * 0.6);
  // Sun
  ctx.fillStyle = rgb([1, 0.95, 0.78], 0.9);
  ctx.beginPath();
  ctx.arc(SIZE * 0.7, SIZE * 0.32, SIZE * 0.07, 0, Math.PI * 2);
  ctx.fill();
  // Mountain silhouettes
  const rng = seedRng(11);
  ctx.fillStyle = rgb(palette[2]);
  ctx.beginPath();
  ctx.moveTo(0, SIZE * 0.6);
  for (let x = 0; x <= SIZE; x += 12) {
    const h = 0.6 - (Math.sin(x * 0.012) * 0.04 + rng() * 0.03);
    ctx.lineTo(x, SIZE * h);
  }
  ctx.lineTo(SIZE, SIZE);
  ctx.lineTo(0, SIZE);
  ctx.closePath();
  ctx.fill();
  // Ground texture flecks
  for (let i = 0; i < 220; i++) {
    ctx.fillStyle = rgb(palette[1], 0.18);
    const x = rng() * SIZE;
    const y = SIZE * 0.6 + rng() * SIZE * 0.4;
    ctx.fillRect(x, y, 2, 2);
  }
}

function paintFantasy(ctx, palette) {
  // painterly emerald/violet wash + sword silhouette + magic glow
  radialBg(ctx, palette);
  const rng = seedRng(7);
  // Brush flecks
  for (let i = 0; i < 90; i++) {
    const x = rng() * SIZE;
    const y = rng() * SIZE;
    const r = 4 + rng() * 14;
    ctx.fillStyle = rgb(palette[0], 0.18 + rng() * 0.25);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // Magic glow behind sword
  const glow = ctx.createRadialGradient(
    SIZE / 2,
    SIZE * 0.45,
    0,
    SIZE / 2,
    SIZE * 0.45,
    SIZE * 0.3
  );
  glow.addColorStop(0, rgb(palette[1], 0.85));
  glow.addColorStop(1, rgb(palette[1], 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SIZE, SIZE);
  // Sword (vertical)
  const cx = SIZE / 2;
  ctx.fillStyle = 'rgba(20, 16, 24, 0.92)';
  ctx.fillRect(cx - 4, SIZE * 0.18, 8, SIZE * 0.5); // blade
  ctx.fillRect(cx - 50, SIZE * 0.68, 100, 10); // crossguard
  ctx.fillRect(cx - 5, SIZE * 0.69, 10, SIZE * 0.1); // hilt
  ctx.fillStyle = 'rgba(20, 16, 24, 0.92)';
  ctx.beginPath();
  ctx.arc(cx, SIZE * 0.18, 6, 0, Math.PI * 2);
  ctx.fill();
}

function paintSoulslike(ctx, palette) {
  // dark painterly with knight silhouette + ash embers
  ctx.fillStyle = rgb(palette[2]);
  ctx.fillRect(0, 0, SIZE, SIZE);
  const rng = seedRng(13);
  // Ash drift
  for (let i = 0; i < 280; i++) {
    const x = rng() * SIZE;
    const y = rng() * SIZE;
    const r = 1 + rng() * 3;
    ctx.fillStyle = rgb(palette[0], 0.05 + rng() * 0.25);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // Knight silhouette
  ctx.fillStyle = 'rgba(8, 6, 8, 0.95)';
  // helm
  ctx.beginPath();
  ctx.arc(SIZE / 2, SIZE * 0.48, SIZE * 0.07, 0, Math.PI * 2);
  ctx.fill();
  // body trapezoid
  ctx.beginPath();
  ctx.moveTo(SIZE / 2 - SIZE * 0.08, SIZE * 0.55);
  ctx.lineTo(SIZE / 2 + SIZE * 0.08, SIZE * 0.55);
  ctx.lineTo(SIZE / 2 + SIZE * 0.12, SIZE * 0.85);
  ctx.lineTo(SIZE / 2 - SIZE * 0.12, SIZE * 0.85);
  ctx.closePath();
  ctx.fill();
  // sword
  ctx.fillRect(SIZE / 2 + SIZE * 0.13, SIZE * 0.45, 4, SIZE * 0.35);
  // Embers
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = rgb(palette[1], 0.7 + rng() * 0.3);
    ctx.beginPath();
    ctx.arc(rng() * SIZE, rng() * SIZE * 0.9, 1.5 + rng() * 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function paintAnime(ctx, palette) {
  // pastel sparkle + sakura swirls
  radialBg(ctx, palette);
  const rng = seedRng(3);
  // Sakura petals scattered
  for (let i = 0; i < 70; i++) {
    const x = rng() * SIZE;
    const y = rng() * SIZE;
    const r = 5 + rng() * 9;
    ctx.fillStyle = rgb(palette[0], 0.6);
    drawPetal(ctx, x, y, r, rng() * Math.PI);
  }
  // Sparkles
  for (let i = 0; i < 50; i++) {
    ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.4 + rng() * 0.6) + ')';
    const x = rng() * SIZE;
    const y = rng() * SIZE;
    const s = 2 + rng() * 3;
    ctx.beginPath();
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPetal(ctx, x, y, r, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(r * 0.5, -r * 0.5, r, -r * 0.3, r * 1.2, 0);
  ctx.bezierCurveTo(r, r * 0.3, r * 0.5, r * 0.5, 0, 0);
  ctx.fill();
  ctx.restore();
}

function paintVisualNovel(ctx, palette) {
  // soft rose + portrait suggestion (head shape) + dialog box bottom
  radialBg(ctx, palette);
  const rng = seedRng(17);
  // Rose petal swirl
  for (let i = 0; i < 50; i++) {
    const t = i / 50;
    const angle = t * Math.PI * 4;
    const r = SIZE * 0.4 * t;
    drawPetal(
      ctx,
      SIZE / 2 + Math.cos(angle) * r,
      SIZE * 0.45 + Math.sin(angle) * r,
      5 + rng() * 6,
      angle
    );
    ctx.fillStyle = rgb(palette[0], 0.55);
    ctx.fill();
  }
  // Portrait silhouette (oval head + shoulders)
  ctx.fillStyle = 'rgba(30, 20, 30, 0.5)';
  ctx.beginPath();
  ctx.ellipse(SIZE / 2, SIZE * 0.5, SIZE * 0.11, SIZE * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();
  // Dialog box
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(SIZE * 0.1, SIZE * 0.78, SIZE * 0.8, SIZE * 0.14);
  ctx.fillStyle = rgb(palette[0], 0.7);
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(SIZE * 0.13, SIZE * (0.82 + i * 0.03), SIZE * (0.5 - i * 0.1), 4);
  }
}

function paintMecha(ctx, palette) {
  // industrial panels with warning lights
  fillBg(ctx, palette);
  const cells = 6;
  const cs = SIZE / cells;
  const rng = seedRng(23);
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const v = rng();
      ctx.fillStyle = rgb(palette[1], 0.4 + v * 0.5);
      ctx.fillRect(x * cs + 4, y * cs + 4, cs - 8, cs - 8);
      // Bolts in corners
      ctx.fillStyle = rgb(palette[2], 0.9);
      [
        [x * cs + 8, y * cs + 8],
        [x * cs + cs - 12, y * cs + 8],
        [x * cs + 8, y * cs + cs - 12],
        [x * cs + cs - 12, y * cs + cs - 12],
      ].forEach(([bx, by]) => {
        ctx.beginPath();
        ctx.arc(bx, by, 2, 0, Math.PI * 2);
        ctx.fill();
      });
      // Warning light on some panels
      if (v > 0.7) {
        ctx.fillStyle = rgb(palette[0], 0.9);
        ctx.beginPath();
        ctx.arc(x * cs + cs / 2, y * cs + cs / 2, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function paintFPS(ctx, palette) {
  // dark concrete + crosshair + HUD bars
  ctx.fillStyle = rgb(palette[2]);
  ctx.fillRect(0, 0, SIZE, SIZE);
  const rng = seedRng(29);
  // Concrete noise
  for (let i = 0; i < 9000; i++) {
    const x = rng() * SIZE;
    const y = rng() * SIZE;
    const c = rng();
    ctx.fillStyle = `rgba(80, 60, 60, ${c * 0.35})`;
    ctx.fillRect(x, y, 1.5, 1.5);
  }
  // Crosshair
  ctx.strokeStyle = rgb(palette[0]);
  ctx.lineWidth = 5;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 80);
  ctx.lineTo(cx, cy - 30);
  ctx.moveTo(cx, cy + 30);
  ctx.lineTo(cx, cy + 80);
  ctx.moveTo(cx - 80, cy);
  ctx.lineTo(cx - 30, cy);
  ctx.moveTo(cx + 30, cy);
  ctx.lineTo(cx + 80, cy);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.stroke();
  // HUD bottom
  ctx.fillStyle = rgb(palette[1], 0.9);
  ctx.fillRect(SIZE * 0.05, SIZE * 0.9, SIZE * 0.2, 8);
  ctx.fillRect(SIZE * 0.75, SIZE * 0.9, SIZE * 0.2, 8);
}

function paintTactical(ctx, palette) {
  // greenish night-vision grid + reticle
  fillBg(ctx, palette);
  ctx.strokeStyle = rgb(palette[0], 0.25);
  ctx.lineWidth = 1;
  for (let x = 0; x < SIZE; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, SIZE);
    ctx.stroke();
  }
  for (let y = 0; y < SIZE; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(SIZE, y);
    ctx.stroke();
  }
  // Reticle
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  ctx.strokeStyle = rgb(palette[1]);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 60, 0, Math.PI * 2);
  ctx.moveTo(cx - 80, cy);
  ctx.lineTo(cx - 30, cy);
  ctx.moveTo(cx + 30, cy);
  ctx.lineTo(cx + 80, cy);
  ctx.moveTo(cx, cy - 80);
  ctx.lineTo(cx, cy - 30);
  ctx.moveTo(cx, cy + 30);
  ctx.lineTo(cx, cy + 80);
  ctx.stroke();
}

function paintFighting(ctx, palette) {
  // arena ring + clash energy radial
  radialBg(ctx, palette);
  const rng = seedRng(31);
  // Energy bursts radiating
  for (let i = 0; i < 40; i++) {
    const angle = (i / 40) * Math.PI * 2;
    const len = 80 + rng() * 120;
    ctx.strokeStyle = rgb(palette[1], 0.6 + rng() * 0.4);
    ctx.lineWidth = 3 + rng() * 4;
    ctx.beginPath();
    ctx.moveTo(SIZE / 2 + Math.cos(angle) * 30, SIZE / 2 + Math.sin(angle) * 30);
    ctx.lineTo(
      SIZE / 2 + Math.cos(angle) * (30 + len),
      SIZE / 2 + Math.sin(angle) * (30 + len)
    );
    ctx.stroke();
  }
  // Center impact flash
  const flash = ctx.createRadialGradient(
    SIZE / 2,
    SIZE / 2,
    0,
    SIZE / 2,
    SIZE / 2,
    SIZE * 0.18
  );
  flash.addColorStop(0, 'rgba(255, 240, 200, 0.95)');
  flash.addColorStop(1, 'rgba(255, 240, 200, 0)');
  ctx.fillStyle = flash;
  ctx.fillRect(0, 0, SIZE, SIZE);
  // Two fighter silhouettes
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.beginPath();
  ctx.arc(SIZE * 0.32, SIZE * 0.55, SIZE * 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(SIZE * 0.68, SIZE * 0.55, SIZE * 0.05, 0, Math.PI * 2);
  ctx.fill();
}

function paintRunner(ctx, palette) {
  // perspective lines + horizontal motion streaks
  linearBg(ctx, palette);
  const cx = SIZE / 2;
  const cy = SIZE * 0.55;
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 14; i++) {
    const y = SIZE * 0.55 + i * 14;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(SIZE, y - i * 8);
    ctx.stroke();
  }
  // Vanishing-point lines
  ctx.strokeStyle = rgb(palette[0], 0.7);
  ctx.lineWidth = 4;
  for (let a = -1; a <= 1; a += 0.25) {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + a * SIZE, SIZE * 1.1);
    ctx.stroke();
  }
  // Horizontal streaks
  const rng = seedRng(41);
  for (let i = 0; i < 20; i++) {
    const y = rng() * SIZE * 0.55;
    const x = rng() * SIZE;
    const w = 80 + rng() * 220;
    ctx.fillStyle = `rgba(255,255,255,${0.3 + rng() * 0.5})`;
    ctx.fillRect(x, y, w, 2);
  }
}

function paintRacing(ctx, palette) {
  // top-down race track
  fillBg(ctx, palette);
  // Asphalt loop
  ctx.strokeStyle = 'rgba(20,20,20,0.95)';
  ctx.lineWidth = SIZE * 0.18;
  ctx.beginPath();
  ctx.ellipse(SIZE / 2, SIZE / 2, SIZE * 0.32, SIZE * 0.22, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Track edges
  ctx.strokeStyle = rgb(palette[0]);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(SIZE / 2, SIZE / 2, SIZE * 0.41, SIZE * 0.31, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(SIZE / 2, SIZE / 2, SIZE * 0.23, SIZE * 0.13, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Start line (checkers)
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 ? '#ffffff' : '#000000';
    ctx.fillRect(SIZE * 0.5 - 6, SIZE * 0.27 + i * 10, 12, 10);
  }
  // Cars (small dots)
  ctx.fillStyle = rgb(palette[1]);
  ctx.beginPath();
  ctx.arc(SIZE * 0.65, SIZE * 0.4, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = rgb(palette[0]);
  ctx.beginPath();
  ctx.arc(SIZE * 0.7, SIZE * 0.45, 8, 0, Math.PI * 2);
  ctx.fill();
}

function paintPlatformer(ctx, palette) {
  // Bright tiles + bouncing dots
  fillBg(ctx, palette);
  // Sky gradient overlay
  const sky = ctx.createLinearGradient(0, 0, 0, SIZE);
  sky.addColorStop(0, rgb(palette[1], 0.6));
  sky.addColorStop(1, rgb(palette[2], 0));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, SIZE, SIZE * 0.7);
  // Platform tiles
  const platforms = [
    [SIZE * 0.05, SIZE * 0.7, SIZE * 0.3],
    [SIZE * 0.45, SIZE * 0.55, SIZE * 0.2],
    [SIZE * 0.75, SIZE * 0.7, SIZE * 0.2],
    [SIZE * 0.2, SIZE * 0.85, SIZE * 0.6],
  ];
  platforms.forEach(([x, y, w]) => {
    ctx.fillStyle = rgb(palette[0]);
    ctx.fillRect(x, y, w, 24);
    ctx.fillStyle = rgb(palette[1], 0.4);
    ctx.fillRect(x, y, w, 6);
  });
  // Hero dot mid-jump
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(SIZE * 0.6, SIZE * 0.42, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = rgb(palette[0]);
  ctx.beginPath();
  ctx.arc(SIZE * 0.6, SIZE * 0.42, 8, 0, Math.PI * 2);
  ctx.fill();
  // Coin
  ctx.fillStyle = '#ffd340';
  ctx.beginPath();
  ctx.arc(SIZE * 0.55, SIZE * 0.5, 9, 0, Math.PI * 2);
  ctx.fill();
}

function paintPixel(ctx, palette) {
  // 16x16 pixel-art with limited palette + scanline tint
  const px = SIZE / 16;
  const rng = seedRng(53);
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const v = rng();
      let c;
      if (v < 0.25) c = palette[2];
      else if (v < 0.55) c = palette[1];
      else c = palette[0];
      ctx.fillStyle = rgb(c);
      ctx.fillRect(x * px, y * px, px, px);
    }
  }
  // Hero silhouette (8-bit-ish)
  const heroX = 5;
  const heroY = 6;
  const heroPattern = [
    [0, 1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1],
    [1, 1, 0, 0, 1, 1],
    [0, 1, 1, 1, 1, 0],
  ];
  heroPattern.forEach((row, ry) => {
    row.forEach((v, rx) => {
      if (v) {
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect((heroX + rx) * px, (heroY + ry) * px, px, px);
      }
    });
  });
  // CRT scanlines
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  for (let y = 0; y < SIZE; y += 4) ctx.fillRect(0, y, SIZE, 1);
}

function paintPuzzle(ctx, palette) {
  // grid of distinct rounded tiles
  fillBg(ctx, palette);
  const cells = 6;
  const cs = SIZE / cells;
  const rng = seedRng(59);
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const c = rng();
      const col = c < 0.4 ? palette[0] : c < 0.75 ? palette[1] : palette[2];
      ctx.fillStyle = rgb(col);
      // Rounded tile
      const px = x * cs + 6;
      const py = y * cs + 6;
      const ps = cs - 12;
      const r = 10;
      ctx.beginPath();
      ctx.moveTo(px + r, py);
      ctx.lineTo(px + ps - r, py);
      ctx.quadraticCurveTo(px + ps, py, px + ps, py + r);
      ctx.lineTo(px + ps, py + ps - r);
      ctx.quadraticCurveTo(px + ps, py + ps, px + ps - r, py + ps);
      ctx.lineTo(px + r, py + ps);
      ctx.quadraticCurveTo(px, py + ps, px, py + ps - r);
      ctx.lineTo(px, py + r);
      ctx.quadraticCurveTo(px, py, px + r, py);
      ctx.closePath();
      ctx.fill();
      // Subtle highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(px + 4, py + 4, ps - 8, 8);
    }
  }
}

function paintStrategy(ctx, palette) {
  // hex grid map with units
  fillBg(ctx, palette);
  const hexR = SIZE * 0.07;
  const cols = 7;
  const rows = 9;
  const dx = hexR * Math.sqrt(3);
  const dy = hexR * 1.5;
  const rng = seedRng(67);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const hx = c * dx + (r % 2 ? dx / 2 : 0) + dx / 2;
      const hy = r * dy + dy / 2;
      const v = rng();
      const col = v < 0.4 ? palette[0] : v < 0.75 ? palette[1] : palette[2];
      drawHex(ctx, hx, hy, hexR - 2, rgb(col, 0.8));
      if (v > 0.85) {
        // unit
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(hx, hy, hexR * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = rgb(palette[2]);
        ctx.beginPath();
        ctx.arc(hx, hy, hexR * 0.32, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function drawHex(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function paintVoxel(ctx, palette) {
  // isometric cubic blocks
  fillBg(ctx, palette);
  const rng = seedRng(71);
  const w = 40;
  const h = 22;
  for (let y = 0; y < SIZE + h; y += h) {
    for (let x = 0; x < SIZE + w; x += w) {
      const ox = (Math.floor(y / h) % 2) * (w / 2);
      const px = x + ox;
      const py = y;
      const v = rng();
      const top = v < 0.5 ? palette[0] : palette[1];
      const left = palette[2];
      const right = [
        Math.max(0, palette[1][0] * 0.7),
        Math.max(0, palette[1][1] * 0.7),
        Math.max(0, palette[1][2] * 0.7),
      ];
      // top diamond
      ctx.fillStyle = rgb(top);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + w / 2, py - h / 2);
      ctx.lineTo(px + w, py);
      ctx.lineTo(px + w / 2, py + h / 2);
      ctx.closePath();
      ctx.fill();
      // left
      ctx.fillStyle = rgb(left);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + w / 2, py + h / 2);
      ctx.lineTo(px + w / 2, py + h);
      ctx.lineTo(px, py + h / 2);
      ctx.closePath();
      ctx.fill();
      // right
      ctx.fillStyle = rgb(right);
      ctx.beginPath();
      ctx.moveTo(px + w / 2, py + h / 2);
      ctx.lineTo(px + w, py);
      ctx.lineTo(px + w, py + h / 2);
      ctx.lineTo(px + w / 2, py + h);
      ctx.closePath();
      ctx.fill();
    }
  }
}

function paintScifi(ctx, palette) {
  // starfield + planet
  ctx.fillStyle = rgb(palette[2]);
  ctx.fillRect(0, 0, SIZE, SIZE);
  const rng = seedRng(73);
  // Stars
  for (let i = 0; i < 250; i++) {
    const x = rng() * SIZE;
    const y = rng() * SIZE;
    const s = rng();
    ctx.fillStyle = `rgba(255,255,255,${0.3 + s * 0.7})`;
    ctx.beginPath();
    ctx.arc(x, y, 0.8 + s * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  // Planet
  const grad = ctx.createRadialGradient(
    SIZE * 0.35,
    SIZE * 0.35,
    SIZE * 0.04,
    SIZE * 0.4,
    SIZE * 0.4,
    SIZE * 0.32
  );
  grad.addColorStop(0, rgb(palette[1]));
  grad.addColorStop(1, rgb(palette[0]));
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(SIZE * 0.4, SIZE * 0.4, SIZE * 0.22, 0, Math.PI * 2);
  ctx.fill();
  // Ring
  ctx.strokeStyle = rgb(palette[1], 0.8);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(SIZE * 0.4, SIZE * 0.42, SIZE * 0.32, SIZE * 0.07, -0.4, 0, Math.PI * 2);
  ctx.stroke();
  // Spaceship
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(SIZE * 0.7, SIZE * 0.7);
  ctx.lineTo(SIZE * 0.78, SIZE * 0.74);
  ctx.lineTo(SIZE * 0.7, SIZE * 0.78);
  ctx.lineTo(SIZE * 0.74, SIZE * 0.74);
  ctx.closePath();
  ctx.fill();
}

function paintCyberpunk(ctx, palette) {
  // neon city skyline + reflective rain
  ctx.fillStyle = rgb(palette[2]);
  ctx.fillRect(0, 0, SIZE, SIZE);
  // Sky neon glow
  const glow = ctx.createLinearGradient(0, 0, 0, SIZE * 0.6);
  glow.addColorStop(0, rgb(palette[0], 0.3));
  glow.addColorStop(1, rgb(palette[1], 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SIZE, SIZE * 0.6);
  // Skyline buildings
  const rng = seedRng(83);
  let x = 0;
  while (x < SIZE) {
    const w = 30 + rng() * 60;
    const h = 100 + rng() * 200;
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, SIZE * 0.6 - h, w, h);
    // Windows
    for (let wy = SIZE * 0.6 - h + 8; wy < SIZE * 0.6 - 8; wy += 14) {
      for (let wx = x + 6; wx < x + w - 6; wx += 10) {
        if (rng() > 0.4) {
          ctx.fillStyle = rgb(rng() > 0.5 ? palette[0] : palette[1], 0.85);
          ctx.fillRect(wx, wy, 4, 6);
        }
      }
    }
    x += w + 2;
  }
  // Wet street reflection
  ctx.fillStyle = rgb(palette[0], 0.15);
  ctx.fillRect(0, SIZE * 0.6, SIZE, SIZE * 0.4);
  // Rain streaks
  for (let i = 0; i < 80; i++) {
    ctx.strokeStyle = rgb(palette[1], 0.3 + rng() * 0.4);
    ctx.lineWidth = 1;
    const rx = rng() * SIZE;
    const ry = rng() * SIZE;
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - 3, ry + 18);
    ctx.stroke();
  }
}

function paintHorror(ctx, palette) {
  // dark + creature glowing eyes + smear
  ctx.fillStyle = rgb(palette[2]);
  ctx.fillRect(0, 0, SIZE, SIZE);
  const rng = seedRng(89);
  // Smear
  for (let i = 0; i < 80; i++) {
    const x = rng() * SIZE;
    const y = rng() * SIZE;
    ctx.fillStyle = rgb(palette[1], 0.35);
    ctx.beginPath();
    ctx.arc(x, y, 6 + rng() * 14, 0, Math.PI * 2);
    ctx.fill();
  }
  // Creature shape silhouette
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(SIZE / 2, SIZE * 0.55, SIZE * 0.22, SIZE * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();
  // Glowing eyes
  ctx.fillStyle = rgb(palette[0]);
  ctx.beginPath();
  ctx.arc(SIZE * 0.43, SIZE * 0.5, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(SIZE * 0.57, SIZE * 0.5, 6, 0, Math.PI * 2);
  ctx.fill();
  // Eye glow
  const eg = ctx.createRadialGradient(SIZE * 0.43, SIZE * 0.5, 0, SIZE * 0.43, SIZE * 0.5, 30);
  eg.addColorStop(0, rgb(palette[0], 0.7));
  eg.addColorStop(1, rgb(palette[0], 0));
  ctx.fillStyle = eg;
  ctx.fillRect(0, 0, SIZE, SIZE);
  const eg2 = ctx.createRadialGradient(SIZE * 0.57, SIZE * 0.5, 0, SIZE * 0.57, SIZE * 0.5, 30);
  eg2.addColorStop(0, rgb(palette[0], 0.7));
  eg2.addColorStop(1, rgb(palette[0], 0));
  ctx.fillStyle = eg2;
  ctx.fillRect(0, 0, SIZE, SIZE);
}

function paintCosmicHorror(ctx, palette) {
  // Lovecraftian eye with tentacles
  radialBg(ctx, palette);
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  // Tentacles
  ctx.strokeStyle = rgb(palette[2]);
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    let lx = cx;
    let ly = cy;
    for (let s = 0; s < 6; s++) {
      const r = 50 + s * 30;
      const wob = Math.sin(s * 1.4 + i) * 30;
      lx = cx + Math.cos(a + s * 0.15) * r + wob * Math.cos(a + Math.PI / 2);
      ly = cy + Math.sin(a + s * 0.15) * r + wob * Math.sin(a + Math.PI / 2);
      ctx.lineTo(lx, ly);
    }
    ctx.stroke();
  }
  // Eye
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, SIZE * 0.16, 0, Math.PI * 2);
  ctx.fill();
  // Iris
  const iris = ctx.createRadialGradient(cx, cy, 0, cx, cy, SIZE * 0.13);
  iris.addColorStop(0, rgb(palette[0]));
  iris.addColorStop(1, rgb(palette[2]));
  ctx.fillStyle = iris;
  ctx.beginPath();
  ctx.arc(cx, cy, SIZE * 0.13, 0, Math.PI * 2);
  ctx.fill();
  // Pupil
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(cx, cy, SIZE * 0.05, 0, Math.PI * 2);
  ctx.fill();
}

function paintNoir(ctx, palette) {
  // monochrome rain + neon sign + silhouette
  ctx.fillStyle = rgb(palette[2]);
  ctx.fillRect(0, 0, SIZE, SIZE);
  const rng = seedRng(97);
  // Rain
  for (let i = 0; i < 320; i++) {
    ctx.strokeStyle = rgb(palette[0], 0.25 + rng() * 0.4);
    ctx.lineWidth = 1;
    const x = rng() * SIZE;
    const y = rng() * SIZE;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 4, y + 16);
    ctx.stroke();
  }
  // Neon sign rectangle
  ctx.fillStyle = rgb(palette[1], 0.7);
  ctx.fillRect(SIZE * 0.62, SIZE * 0.18, SIZE * 0.3, SIZE * 0.12);
  ctx.strokeStyle = rgb(palette[1]);
  ctx.lineWidth = 3;
  ctx.strokeRect(SIZE * 0.62, SIZE * 0.18, SIZE * 0.3, SIZE * 0.12);
  // Detective silhouette (trenchcoat)
  ctx.fillStyle = '#000000';
  // hat
  ctx.beginPath();
  ctx.ellipse(SIZE * 0.3, SIZE * 0.55, SIZE * 0.07, SIZE * 0.025, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(SIZE * 0.27, SIZE * 0.5, SIZE * 0.06, SIZE * 0.05);
  // body
  ctx.fillRect(SIZE * 0.24, SIZE * 0.6, SIZE * 0.12, SIZE * 0.32);
  // legs taper
  ctx.beginPath();
  ctx.moveTo(SIZE * 0.24, SIZE * 0.92);
  ctx.lineTo(SIZE * 0.36, SIZE * 0.92);
  ctx.lineTo(SIZE * 0.34, SIZE * 0.99);
  ctx.lineTo(SIZE * 0.26, SIZE * 0.99);
  ctx.closePath();
  ctx.fill();
}

function paintSurvival(ctx, palette) {
  // forest + tent + fire
  linearBg(ctx, palette);
  const rng = seedRng(101);
  // Tree trunks
  for (let i = 0; i < 12; i++) {
    const tx = rng() * SIZE;
    const trunkH = SIZE * 0.5;
    ctx.fillStyle = rgb(palette[2]);
    ctx.fillRect(tx - 4, SIZE * 0.4, 8, trunkH);
    // canopy
    ctx.fillStyle = rgb(palette[0], 0.85);
    ctx.beginPath();
    ctx.arc(tx, SIZE * 0.35, 28 + rng() * 10, 0, Math.PI * 2);
    ctx.fill();
  }
  // Tent
  ctx.fillStyle = rgb(palette[1]);
  ctx.beginPath();
  ctx.moveTo(SIZE * 0.4, SIZE * 0.8);
  ctx.lineTo(SIZE * 0.5, SIZE * 0.65);
  ctx.lineTo(SIZE * 0.6, SIZE * 0.8);
  ctx.closePath();
  ctx.fill();
  // Fire
  ctx.fillStyle = '#ff8030';
  ctx.beginPath();
  ctx.arc(SIZE * 0.7, SIZE * 0.78, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffd040';
  ctx.beginPath();
  ctx.arc(SIZE * 0.7, SIZE * 0.78, 7, 0, Math.PI * 2);
  ctx.fill();
}

function paintCozy(ctx, palette) {
  // sunny meadow + small house + flowers
  const sky = ctx.createLinearGradient(0, 0, 0, SIZE);
  sky.addColorStop(0, rgb(palette[1]));
  sky.addColorStop(0.6, rgb([1, 0.92, 0.78]));
  sky.addColorStop(1, rgb(palette[0]));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, SIZE, SIZE);
  // Sun
  const sun = ctx.createRadialGradient(SIZE * 0.75, SIZE * 0.25, 0, SIZE * 0.75, SIZE * 0.25, SIZE * 0.18);
  sun.addColorStop(0, '#fff5cc');
  sun.addColorStop(1, 'rgba(255, 245, 200, 0)');
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, SIZE, SIZE);
  // House
  ctx.fillStyle = rgb(palette[2]);
  ctx.fillRect(SIZE * 0.35, SIZE * 0.55, SIZE * 0.2, SIZE * 0.2);
  ctx.fillStyle = rgb(palette[0]);
  ctx.beginPath();
  ctx.moveTo(SIZE * 0.32, SIZE * 0.55);
  ctx.lineTo(SIZE * 0.45, SIZE * 0.42);
  ctx.lineTo(SIZE * 0.58, SIZE * 0.55);
  ctx.closePath();
  ctx.fill();
  // Door
  ctx.fillStyle = '#503020';
  ctx.fillRect(SIZE * 0.43, SIZE * 0.65, SIZE * 0.04, SIZE * 0.1);
  // Flowers
  const rng = seedRng(103);
  for (let i = 0; i < 16; i++) {
    const fx = rng() * SIZE;
    const fy = SIZE * 0.78 + rng() * SIZE * 0.18;
    ctx.fillStyle = rgb(palette[1]);
    ctx.beginPath();
    ctx.arc(fx, fy, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function paintPostapoc(ctx, palette) {
  // ruined skyline + dust storm
  fillBg(ctx, palette);
  const rng = seedRng(107);
  // Dust haze
  const haze = ctx.createLinearGradient(0, 0, 0, SIZE);
  haze.addColorStop(0, rgb(palette[0], 0.35));
  haze.addColorStop(1, rgb(palette[2], 0));
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, SIZE, SIZE);
  // Ruined buildings (broken silhouettes)
  ctx.fillStyle = '#1a1208';
  let x = 0;
  while (x < SIZE) {
    const w = 30 + rng() * 60;
    const h = 80 + rng() * 200;
    const tilt = rng() > 0.5 ? -1 : 1;
    ctx.beginPath();
    ctx.moveTo(x, SIZE * 0.65);
    ctx.lineTo(x, SIZE * 0.65 - h + tilt * 18);
    ctx.lineTo(x + w * 0.4, SIZE * 0.65 - h + tilt * 26);
    ctx.lineTo(x + w * 0.7, SIZE * 0.65 - h - tilt * 14);
    ctx.lineTo(x + w, SIZE * 0.65 - h * 0.5);
    ctx.lineTo(x + w, SIZE * 0.65);
    ctx.closePath();
    ctx.fill();
    x += w + 4;
  }
  // Dust particles
  for (let i = 0; i < 200; i++) {
    ctx.fillStyle = rgb(palette[1], 0.45 + rng() * 0.5);
    ctx.fillRect(rng() * SIZE, rng() * SIZE, 1.5, 1.5);
  }
}

function paintRoguelike(ctx, palette) {
  // top-down dungeon tiles + torch glow
  fillBg(ctx, palette);
  const cells = 8;
  const cs = SIZE / cells;
  const rng = seedRng(109);
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const v = rng();
      if (v < 0.3) {
        // wall
        ctx.fillStyle = rgb(palette[2]);
      } else {
        // floor
        ctx.fillStyle = rgb(palette[1], 0.7 + v * 0.3);
      }
      ctx.fillRect(x * cs, y * cs, cs, cs);
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x * cs, y * cs, cs, cs);
    }
  }
  // Torches
  const torches = [
    [SIZE * 0.3, SIZE * 0.3],
    [SIZE * 0.7, SIZE * 0.6],
  ];
  torches.forEach(([tx, ty]) => {
    const g = ctx.createRadialGradient(tx, ty, 0, tx, ty, 80);
    g.addColorStop(0, rgb(palette[0], 0.7));
    g.addColorStop(1, rgb(palette[0], 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = '#ff8830';
    ctx.beginPath();
    ctx.arc(tx, ty, 6, 0, Math.PI * 2);
    ctx.fill();
  });
  // Hero dot
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(SIZE * 0.5, SIZE * 0.5, 8, 0, Math.PI * 2);
  ctx.fill();
}

function paintSports(ctx, palette) {
  // stadium gradient + crowd + field markings
  const sky = ctx.createLinearGradient(0, 0, 0, SIZE);
  sky.addColorStop(0, rgb(palette[2]));
  sky.addColorStop(0.4, rgb(palette[1]));
  sky.addColorStop(1, rgb(palette[0]));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, SIZE, SIZE);
  // Crowd
  const rng = seedRng(113);
  for (let i = 0; i < 1500; i++) {
    const y = rng() * SIZE * 0.55;
    const x = rng() * SIZE;
    ctx.fillStyle = rng() > 0.5 ? rgb(palette[2], 0.6) : rgb(palette[0], 0.4);
    ctx.fillRect(x, y, 2, 2);
  }
  // Field
  ctx.fillStyle = '#3a8a3a';
  ctx.fillRect(0, SIZE * 0.55, SIZE, SIZE * 0.45);
  // Stripes
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 ? '#3a8a3a' : '#338033';
    ctx.fillRect(0, SIZE * 0.55 + i * 30, SIZE, 30);
  }
  // Center line
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(SIZE * 0.5, SIZE * 0.55);
  ctx.lineTo(SIZE * 0.5, SIZE);
  ctx.stroke();
  // Center circle
  ctx.beginPath();
  ctx.arc(SIZE * 0.5, SIZE * 0.78, 50, 0, Math.PI * 2);
  ctx.stroke();
}

function paintStealth(ctx, palette) {
  // dark room + light cone + silhouette
  ctx.fillStyle = rgb(palette[2]);
  ctx.fillRect(0, 0, SIZE, SIZE);
  // Light cone from top-right
  ctx.fillStyle = rgb(palette[1], 0.35);
  ctx.beginPath();
  ctx.moveTo(SIZE * 0.85, SIZE * 0.05);
  ctx.lineTo(SIZE * 0.4, SIZE);
  ctx.lineTo(SIZE * 0.95, SIZE);
  ctx.closePath();
  ctx.fill();
  // Light source
  ctx.fillStyle = rgb(palette[0]);
  ctx.beginPath();
  ctx.arc(SIZE * 0.85, SIZE * 0.05, 12, 0, Math.PI * 2);
  ctx.fill();
  // Crouching silhouette
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(SIZE * 0.25, SIZE * 0.55, SIZE * 0.045, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(SIZE * 0.2, SIZE * 0.6, SIZE * 0.1, SIZE * 0.18);
  ctx.beginPath();
  ctx.moveTo(SIZE * 0.2, SIZE * 0.78);
  ctx.lineTo(SIZE * 0.3, SIZE * 0.78);
  ctx.lineTo(SIZE * 0.32, SIZE * 0.95);
  ctx.lineTo(SIZE * 0.18, SIZE * 0.95);
  ctx.closePath();
  ctx.fill();
}

// ---------- Painter registry ----------
export const PAINTERS = {
  landscape: paintLandscape,
  fantasy: paintFantasy,
  soulslike: paintSoulslike,
  anime: paintAnime,
  visualnovel: paintVisualNovel,
  mecha: paintMecha,
  fps: paintFPS,
  tactical: paintTactical,
  fighting: paintFighting,
  runner: paintRunner,
  racing: paintRacing,
  platformer: paintPlatformer,
  pixel: paintPixel,
  puzzle: paintPuzzle,
  strategy: paintStrategy,
  voxel: paintVoxel,
  scifi: paintScifi,
  cyberpunk: paintCyberpunk,
  horror: paintHorror,
  cosmichorror: paintCosmicHorror,
  noir: paintNoir,
  survival: paintSurvival,
  cozy: paintCozy,
  postapoc: paintPostapoc,
  roguelike: paintRoguelike,
  sports: paintSports,
  stealth: paintStealth,
};

// Render a painter to a 512x512 canvas. Mutates the palette per call so
// variants painted with different palettes look distinct.
export function paintToCanvas(painterName, palette) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  const fn = PAINTERS[painterName] || paintFantasy;
  fn(ctx, palette);
  return canvas;
}
