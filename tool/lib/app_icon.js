import { createCanvas } from '@napi-rs/canvas';

/**
 * @typedef {{ x: number; y: number; r: number; color: string; glow?: boolean }} IconStar
 */

/** @type {readonly IconStar[]} Constellation nodes: Vega, Orion belt, Stellar, Rigel, Astra. */
const STARS = [
  { x: 512, y: 248, r: 17, color: '#FFF4E0' },
  { x: 352, y: 448, r: 12, color: '#C8D8FF' },
  { x: 512, y: 418, r: 11, color: '#D8E4FF' },
  { x: 672, y: 448, r: 14, color: '#8EB4FF' },
  { x: 512, y: 612, r: 28, color: '#EEF2FF', glow: true }
];

/** @type {readonly [number, number][]} */
const CONSTELLATION_LINES = [
  [0, 2],
  [1, 2],
  [2, 3],
  [2, 4],
  [3, 4]
];

/**
 * @param {import('@napi-rs/canvas').SKRSContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {number} radius
 */
const roundRect = (ctx, x, y, width, height, radius) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

/**
 * @param {import('@napi-rs/canvas').SKRSContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} radius
 * @param {string} color
 * @param {number} unit
 * @param {boolean} [glow]
 */
const drawStar = (ctx, x, y, radius, color, unit, glow = false) => {
  if (glow) {
    ctx.save();
    ctx.shadowColor = 'rgba(142, 180, 255, 0.9)';
    ctx.shadowBlur = 28 * unit;
  }

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  if (glow) {
    ctx.restore();
  }

  ctx.beginPath();
  ctx.fillStyle = '#FFFFFF';
  ctx.arc(x, y, radius * 0.32, 0, Math.PI * 2);
  ctx.fill();
};

/**
 * Draw the Astra stellar constellation icon.
 *
 * Theme: dark sky with Vega, Orion belt, Stellar, Rigel, and central Astra.
 *
 * @param {import('@napi-rs/canvas').SKRSContext2D} ctx
 * @param {number} size Canvas edge length in pixels.
 */
export const drawAppIcon = (ctx, size) => {
  const unit = size / 1024;
  const centerX = size / 2;
  const centerY = size / 2;
  const cornerRadius = 224 * unit;

  roundRect(ctx, 0, 0, size, size, cornerRadius);
  ctx.save();
  ctx.clip();

  const background = ctx.createRadialGradient(centerX, centerY * 0.9, 0, centerX, centerY, size * 0.72);
  background.addColorStop(0, '#1a2240');
  background.addColorStop(1, '#080b14');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, size, size);

  const nebula = ctx.createRadialGradient(centerX, centerY * 0.88, 0, centerX, centerY * 0.88, size * 0.34);
  nebula.addColorStop(0, 'rgba(74, 108, 247, 0.24)');
  nebula.addColorStop(1, 'rgba(74, 108, 247, 0)');
  ctx.fillStyle = nebula;
  ctx.fillRect(0, 0, size, size);

  const scale = (value) => value * unit;

  ctx.strokeStyle = 'rgba(107, 140, 255, 0.38)';
  ctx.lineWidth = Math.max(1, 3 * unit);
  ctx.lineCap = 'round';
  for (const [fromIndex, toIndex] of CONSTELLATION_LINES) {
    const from = STARS[fromIndex];
    const to = STARS[toIndex];
    ctx.beginPath();
    ctx.moveTo(scale(from.x), scale(from.y));
    ctx.lineTo(scale(to.x), scale(to.y));
    ctx.stroke();
  }

  for (const star of STARS.filter((entry) => !entry.glow)) {
    drawStar(ctx, scale(star.x), scale(star.y), scale(star.r), star.color, unit);
  }

  for (const star of STARS.filter((entry) => entry.glow)) {
    drawStar(ctx, scale(star.x), scale(star.y), scale(star.r), star.color, unit, true);
  }

  ctx.restore();
};

/**
 * Render the app icon to a PNG buffer.
 *
 * @param {number} size Edge length in pixels.
 * @returns {Buffer}
 */
export const renderAppIconPng = (size) => {
  const canvas = createCanvas(size, size);
  const context = canvas.getContext('2d');
  drawAppIcon(context, size);
  return canvas.toBuffer('image/png');
};
