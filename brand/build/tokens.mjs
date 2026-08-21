// 7habits design tokens.
//
// Everything in the brand kit is derived from these values. They are lifted
// straight from the 7x7 colour grid in index.html so the marketing assets and
// the website stay in sync.

/** Seven habit columns. Hue + saturation match the `hues` array in index.html. */
export const HABITS = [
  { key: 'prayer', name: 'Prayer', h: 280, s: 70 },
  { key: 'gratitude', name: 'Gratitude', h: 245, s: 75 },
  { key: 'connection', name: 'Connection', h: 210, s: 80 },
  { key: 'exercise', name: 'Exercise', h: 145, s: 65 },
  { key: 'hydration', name: 'Hydration', h: 45, s: 90 },
  { key: 'sleep', name: 'Sleep', h: 25, s: 90 },
  { key: 'nutrition', name: 'Nutrition', h: 0, s: 72 },
];

/** Seven day rows, lightest (day 1) to darkest (day 7). Matches `L` in index.html. */
export const LIGHTNESS = [72, 66, 60, 54, 48, 42, 36];

/** Row index treated as the canonical swatch for each habit. */
export const BASE_ROW = 2; // L = 60%

export const INK = {
  black: '#09090f', // page background
  panel: '#0e0e16', // raised surface
  paper: '#f6f6fa', // primary text on dark
  muted: '#9d9db5', // secondary text
  dim: '#6f6f8c', // tertiary text
  violet: '#5b4fd6', // link / accent on light
  violetLight: '#9d8bff', // link / accent on dark
};

export const BRAND = {
  name: '7habits',
  tagline: 'Seven habits. Seven days. Better you.',
  maker: 'gen315.tech',
  handle: '@7habitsapp',
  fontStack:
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

/**
 * TikTok chrome covers a large part of a 9:16 frame. These are the margins to
 * stay inside at 1080x1920 so nothing important sits under the UI.
 * Approximate — TikTok moves its controls between releases, so treat as guidance.
 */
export const TIKTOK_SAFE = { top: 200, right: 240, bottom: 480, left: 90 };

export function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const to = (v) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${to(f(0))}${to(f(8))}${to(f(4))}`;
}

/** Hex for habit column `col` at day row `row`. */
export function cell(col, row) {
  const { h, s } = HABITS[col];
  return hslToHex(h, s, LIGHTNESS[row]);
}

/** Canonical hex for a habit column. */
export function habitHex(col, row = BASE_ROW) {
  return cell(col, row);
}

/** The full 7-colour brand ramp at the canonical row. */
export const RAMP = HABITS.map((_, i) => habitHex(i));

/** Background wash used across the site and every dark asset. */
export function auroraCss() {
  return [
    `radial-gradient(60% 45% at 18% 12%, hsl(280 70% 55% / .22), transparent)`,
    `radial-gradient(55% 40% at 85% 25%, hsl(210 80% 55% / .18), transparent)`,
    `radial-gradient(60% 45% at 75% 90%, hsl(145 65% 45% / .16), transparent)`,
    `radial-gradient(50% 40% at 12% 85%, hsl(25 90% 55% / .14), transparent)`,
  ].join(', ');
}
