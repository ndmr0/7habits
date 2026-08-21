// SVG builders for the 7habits marks.
//
// Two marks, one palette:
//   gridMark  - the 7x7 habit/day grid. Primary mark: app icon, avatars, hero art.
//   sevenMark - a geometric 7 carrying the same seven hues. For anything below
//               ~48px, where 49 individual cells turn to mush (favicons, watermarks).

import { HABITS, LIGHTNESS, INK, RAMP, cell } from './tokens.mjs';

/**
 * The 7x7 grid, drawn in a 100x100 viewBox.
 * @param {object} o
 * @param {number} o.gap      space between cells, in viewBox units
 * @param {number} o.radius   corner radius as a fraction of cell size (0-0.5)
 * @param {number} o.inset    padding inside the viewBox
 */
export function gridCells({ gap = 1.4, radius = 0.22, inset = 0 } = {}) {
  const span = 100 - inset * 2;
  const size = (span - gap * 6) / 7;
  const r = +(size * radius).toFixed(3);
  const rects = [];
  for (let row = 0; row < LIGHTNESS.length; row++) {
    for (let col = 0; col < HABITS.length; col++) {
      const x = +(inset + col * (size + gap)).toFixed(3);
      const y = +(inset + row * (size + gap)).toFixed(3);
      rects.push(
        `<rect x="${x}" y="${y}" width="${size.toFixed(3)}" height="${size.toFixed(
          3,
        )}" rx="${r}" fill="${cell(col, row)}"/>`,
      );
    }
  }
  return rects.join('');
}

/** Standalone grid mark, transparent background. */
export function gridMarkSvg({ gap = 1.4, radius = 0.22 } = {}) {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" role="img" aria-label="7habits">`,
    `<title>7habits</title>`,
    gridCells({ gap, radius }),
    `</svg>`,
  ].join('');
}

/** Grid mark on the dark brand ground, with the aurora wash. Squircle-safe. */
export function gridTileSvg({ inset = 14, rounded = 0 } = {}) {
  const clip = rounded
    ? `<clipPath id="tile"><rect width="100" height="100" rx="${rounded}"/></clipPath>`
    : '';
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" role="img" aria-label="7habits">`,
    `<title>7habits</title>`,
    `<defs>${auroraGradients()}${clip}</defs>`,
    `<g${rounded ? ' clip-path="url(#tile)"' : ''}>`,
    `<rect width="100" height="100" fill="${INK.black}"/>`,
    auroraRects(),
    gridCells({ gap: 1.5, radius: 0.24, inset }),
    `</g></svg>`,
  ].join('');
}

/**
 * Geometric 7 built from a single stroked path, filled with the brand ramp.
 * Legible down to 16px.
 */
export function sevenMarkSvg({ background = null, rounded = 22 } = {}) {
  const stops = RAMP.map(
    (hex, i) => `<stop offset="${((i / (RAMP.length - 1)) * 100).toFixed(1)}%" stop-color="${hex}"/>`,
  ).join('');
  // The gradient runs along x+y. Anchoring it to the glyph's own span (48 at the
  // top-left of the bar, 123 at the tip of the diagonal) puts all seven hues on
  // the stroke; a plain 0,0 -> 1,1 gradient spends orange and red on empty canvas.
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" role="img" aria-label="7habits">`,
    `<title>7habits</title>`,
    `<defs><linearGradient id="ramp" gradientUnits="userSpaceOnUse" x1="24" y1="24" x2="61.5" y2="61.5">${stops}</linearGradient></defs>`,
    background
      ? `<rect width="100" height="100" rx="${rounded}" fill="${background}"/>`
      : '',
    `<path d="M25 23 H75 L45 78" fill="none" stroke="url(#ramp)" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>`,
    `</svg>`,
  ].join('');
}

/** The four corner washes that make up the brand background (mirrors auroraCss). */
const AURORA_BLOBS = [
  { cx: 18, cy: 12, r: 60, color: 'hsl(280 70% 55%)', o: 0.22 },
  { cx: 85, cy: 25, r: 55, color: 'hsl(210 80% 55%)', o: 0.18 },
  { cx: 75, cy: 90, r: 60, color: 'hsl(145 65% 45%)', o: 0.16 },
  { cx: 12, cy: 85, r: 50, color: 'hsl(25 90% 55%)', o: 0.14 },
];

/** Aurora radial gradients. Caller wraps these in its own <defs>. */
export function auroraGradients() {
  return AURORA_BLOBS.map(
    (b, i) =>
      `<radialGradient id="ab${i}" cx="${b.cx}%" cy="${b.cy}%" r="${b.r}%">` +
      `<stop offset="0%" stop-color="${b.color}" stop-opacity="${b.o}"/>` +
      `<stop offset="100%" stop-color="${b.color}" stop-opacity="0"/></radialGradient>`,
  ).join('');
}

/** Paint rects for the aurora wash. Pair with auroraGradients(). */
export function auroraRects() {
  return AURORA_BLOBS.map(
    (_, i) => `<rect width="100" height="100" fill="url(#ab${i})"/>`,
  ).join('');
}

/**
 * A row of seven segments, sized in real pixels so the corner radii stay round.
 * (Normalising to a 0-100 viewBox and stretching would shear them into ovals.)
 */
function segmentRow(colors, { width, height, gap, radius }) {
  const n = colors.length;
  const w = (width - gap * (n - 1)) / n;
  const rects = colors
    .map((hex, i) => {
      const x = +(i * (w + gap)).toFixed(2);
      return `<rect x="${x}" y="0" width="${w.toFixed(
        2,
      )}" height="${height}" rx="${radius}" fill="${hex}"/>`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${rects}</svg>`;
}

/** One habit's seven day shades — reads as a week of that habit. */
export function habitWeekSvg(col, { width = 560, height = 26, gap = 9, radius = 8 } = {}) {
  const colors = LIGHTNESS.map((_, row) => cell(col, row));
  return segmentRow(colors, { width, height, gap, radius });
}

/** The seven habit colours as a horizontal strip — a compact brand signature. */
export function rampStripSvg({ width = 700, height = 14, gap = 11, radius = 5 } = {}) {
  return segmentRow(RAMP, { width, height, gap, radius });
}

/** Wordmark + mark lockups, emitted as standalone SVG files. */
export function lockupSvg({ orientation = 'horizontal', theme = 'dark' } = {}) {
  const fg = theme === 'dark' ? INK.paper : '#14141d';
  const sub = theme === 'dark' ? INK.muted : '#6b6b85';
  const font =
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

  if (orientation === 'stacked') {
    return [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 260" width="320" height="260" role="img" aria-label="7habits — Seven habits. Seven days. Better you.">`,
      `<title>7habits</title>`,
      `<g transform="translate(110 0) scale(1)"><svg x="0" y="0" width="100" height="100" viewBox="0 0 100 100">${gridCells()}</svg></g>`,
      `<text x="160" y="176" text-anchor="middle" font-family="${font}" font-size="58" font-weight="800" letter-spacing="-2" fill="${fg}">7habits</text>`,
      `<text x="160" y="212" text-anchor="middle" font-family="${font}" font-size="18" font-weight="500" letter-spacing="-.2" fill="${sub}">Seven habits. Seven days. Better you.</text>`,
      `</svg>`,
    ].join('');
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 110" width="420" height="110" role="img" aria-label="7habits">`,
    `<title>7habits</title>`,
    `<svg x="0" y="5" width="100" height="100" viewBox="0 0 100 100">${gridCells()}</svg>`,
    `<text x="126" y="60" font-family="${font}" font-size="46" font-weight="800" letter-spacing="-1.6" fill="${fg}">7habits</text>`,
    `<text x="128" y="86" font-family="${font}" font-size="15.5" font-weight="500" letter-spacing="-.1" fill="${sub}">Seven habits. Seven days. Better you.</text>`,
    `</svg>`,
  ].join('');
}
