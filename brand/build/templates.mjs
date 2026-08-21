// HTML layouts for every raster asset in the kit.
//
// Each function returns a full HTML document sized exactly to its output. The
// build script loads it in headless Chromium and screenshots the viewport, so
// 1px here is 1px in the PNG.

import {
  BRAND,
  INK,
  HABITS,
  TIKTOK_SAFE,
  FACEBOOK_COVER,
  auroraCss,
  habitHex,
  cell,
} from './tokens.mjs';
import { gridCells, sevenMarkSvg, rampStripSvg, habitWeekSvg } from './marks.mjs';

/** Short prompt shown on each habit card. Edit freely — pure marketing copy. */
export const HABIT_LINES = {
  prayer: 'Start the day grounded.',
  gratitude: 'Name one good thing.',
  connection: 'Reach out to someone.',
  exercise: 'Move your body.',
  hydration: 'Drink the water.',
  sleep: 'Protect your rest.',
  nutrition: 'Eat like you mean it.',
};

/** Claims used on CTA art. Kept in step with terms.html — check both if you edit. */
export const CTA = {
  offer: 'Start free for 30 days',
  fine: 'New subscribers. Auto-renews unless cancelled.',
  store: 'On the App Store',
  privacy: 'No account. No cloud. Your data stays on your phone.',
};

const svgBox = (svg, css) =>
  `<span style="display:block;line-height:0;${css}">${svg}</span>`;

/** Inline the 7x7 grid at a given pixel size. */
export const gridAt = (px, opts) =>
  svgBox(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${px}" height="${px}">${gridCells(
      opts,
    )}</svg>`,
    `width:${px}px;height:${px}px`,
  );

/** Small horizontal lockup: mark + wordmark, for corners of larger art. */
export function lockup({ mark = 56, word = 40, color = INK.paper, gap = 18 } = {}) {
  return `<div style="display:flex;align-items:center;gap:${gap}px">
    ${gridAt(mark, { gap: 1.8, radius: 0.26 })}
    <span style="font-size:${word}px;font-weight:800;letter-spacing:-.035em;color:${color}">7habits</span>
  </div>`;
}

const rampStrip = (w, h = 10) =>
  svgBox(rampStripSvg({ width: w, height: h }), `width:${w}px;height:${h}px`);

/** Document shell. `fontFace` is the @font-face rule injected by build.mjs. */
export function page({ w, h, body, css = '', fontFace = '', bg = INK.black }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFace}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${w}px;height:${h}px;overflow:hidden}
body{font-family:${BRAND.fontStack};background:${bg};color:${INK.paper};
  -webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
.stage{position:relative;width:${w}px;height:${h}px;overflow:hidden}
.aurora{position:absolute;inset:0;background-image:${auroraCss()}}
.layer{position:absolute;inset:0}
${css}
</style></head><body><div class="stage">${body}</div></body></html>`;
}

/* ------------------------------------------------------------------ avatars */

export function profileGrid({ size = 1080, fontFace }) {
  const grid = Math.round(size * 0.6); // stays inside the circular crop
  return page({
    w: size,
    h: size,
    fontFace,
    body: `<div class="aurora"></div>
      <div class="layer" style="display:grid;place-items:center">
        ${gridAt(grid, { gap: 1.5, radius: 0.24 })}
      </div>`,
  });
}

export function profileSeven({ size = 1080, fontFace }) {
  const mark = Math.round(size * 0.52);
  return page({
    w: size,
    h: size,
    fontFace,
    body: `<div class="aurora"></div>
      <div class="layer" style="display:grid;place-items:center">
        ${svgBox(
          sevenMarkSvg().replace('width="100" height="100"', `width="${mark}" height="${mark}"`),
          `width:${mark}px;height:${mark}px`,
        )}
      </div>`,
  });
}

/* --------------------------------------------------------------- app + web */

export function appIcon({ size = 1024, fontFace }) {
  // Full bleed, no baked corner radius — iOS and the web manifest mask it.
  const grid = Math.round(size * 0.64);
  return page({
    w: size,
    h: size,
    fontFace,
    body: `<div class="aurora"></div>
      <div class="layer" style="display:grid;place-items:center">
        ${gridAt(grid, { gap: 1.5, radius: 0.24 })}
      </div>`,
  });
}

export function faviconTile({ size = 512, fontFace }) {
  const mark = Math.round(size * 0.62);
  return page({
    w: size,
    h: size,
    fontFace,
    body: `<div class="aurora"></div>
      <div class="layer" style="display:grid;place-items:center">
        ${svgBox(
          sevenMarkSvg().replace('width="100" height="100"', `width="${mark}" height="${mark}"`),
          `width:${mark}px;height:${mark}px`,
        )}
      </div>`,
  });
}

export function ogImage({ w = 1200, h = 630, fontFace }) {
  return page({
    w,
    h,
    fontFace,
    body: `<div class="aurora"></div>
      <div class="layer" style="display:flex;align-items:center;gap:64px;padding:0 92px">
        ${gridAt(300, { gap: 1.5, radius: 0.24 })}
        <div style="flex:1">
          <div style="font-size:96px;font-weight:800;letter-spacing:-.04em;line-height:1">7habits</div>
          <div style="font-size:34px;font-weight:500;color:${INK.muted};margin-top:18px;letter-spacing:-.01em">${BRAND.tagline}</div>
          <div style="margin-top:34px">${rampStrip(420, 12)}</div>
          <div style="font-size:24px;font-weight:500;color:${INK.dim};margin-top:26px">${CTA.privacy}</div>
        </div>
      </div>`,
  });
}

/* ------------------------------------------------------------ 9:16 verticals */

const SAFE_PAD = 90;

/**
 * Shared chrome for vertical cards.
 *
 * `fit: 'safe'`  — content is padded into TikTok's safe box, so nothing lands
 *                  under the action rail or the caption strip. Use for anything
 *                  posted as a video frame.
 * `fit: 'frame'` — content is centred in the whole 1080x1920 frame. Use for
 *                  cover images and stories, which are seen uncropped.
 */
function vertical({
  fontFace,
  tint = null,
  content,
  lockupMark = true,
  fit = 'safe',
  align = 'start',
  w = 1080,
  h = 1920,
}) {
  const tintLayer = tint
    ? `<div class="layer" style="background:
        radial-gradient(65% 40% at 50% 22%, ${tint}33, transparent 70%),
        radial-gradient(70% 45% at 20% 82%, ${tint}22, transparent 70%)"></div>`
    : '';
  const { top, right, bottom, left } = TIKTOK_SAFE;
  // A centred composition needs symmetric side padding, or it reads as
  // mis-aligned rather than deliberately inset. Use the wider (action rail)
  // margin on both sides so it stays clear of the UI and still sits on the
  // frame's centre line.
  const pad =
    fit === 'safe'
      ? align === 'center'
        ? `${top}px ${right}px ${bottom}px ${right}px`
        : `${top}px ${right}px ${bottom}px ${left}px`
      : `${SAFE_PAD * 2}px ${SAFE_PAD}px`;
  const footer = lockupMark
    ? `<div style="margin-top:76px;opacity:.9">${lockup({ mark: 76, word: 44 })}</div>`
    : '';
  return page({
    w,
    h,
    fontFace,
    body: `<div class="aurora"></div>${tintLayer}
      <div class="layer" style="display:flex;flex-direction:column;justify-content:center;
                  align-items:${align === 'center' ? 'center' : 'flex-start'};
                  text-align:${align === 'center' ? 'center' : 'left'};padding:${pad}">
        ${content}
        ${footer}
      </div>`,
  });
}

/** One card per habit: the column's seven shades plus the habit name. */
export function habitCard({ index, fontFace }) {
  const habit = HABITS[index];
  const color = habitHex(index);
  const num = String(index + 1).padStart(2, '0');
  const week = 640; // fits the safe width at every habit name length

  return vertical({
    fontFace,
    tint: color,
    content: `
      <div>
        <div style="font-size:30px;font-weight:700;letter-spacing:.2em;color:${color};text-transform:uppercase">Habit ${num} of 07</div>
        <div style="font-size:112px;font-weight:800;letter-spacing:-.045em;line-height:.98;margin-top:26px;color:${INK.paper}">${habit.name}</div>
        <div style="font-size:44px;font-weight:500;color:${INK.muted};margin-top:28px;line-height:1.3">${HABIT_LINES[habit.key]}</div>
        <div style="margin-top:56px">${svgBox(
          habitWeekSvg(index, { width: week, height: 30, gap: 10, radius: 9 }),
          `width:${week}px;height:30px`,
        )}</div>
        <div style="font-size:24px;font-weight:600;letter-spacing:.14em;color:${INK.dim};margin-top:20px;text-transform:uppercase">Seven days</div>
      </div>`,
  });
}

/** Branded cover for a pinned post or channel trailer. */
export function coverBrand({ fontFace }) {
  return vertical({
    fontFace,
    lockupMark: false,
    fit: 'frame',
    align: 'center',
    content: `
      <div style="display:flex;flex-direction:column;align-items:center">
        ${gridAt(520, { gap: 1.5, radius: 0.24 })}
        <div style="font-size:150px;font-weight:800;letter-spacing:-.05em;margin-top:64px;line-height:1">7habits</div>
        <div style="font-size:44px;font-weight:500;color:${INK.muted};margin-top:26px;letter-spacing:-.01em">Seven habits.<br/>Seven days. Better you.</div>
        <div style="margin-top:48px">${rampStrip(460, 14)}</div>
      </div>`,
  });
}

/** End card to append to a video. */
export function endCard({ fontFace }) {
  return vertical({
    fontFace,
    lockupMark: false,
    align: 'center',
    content: `
      <div style="display:flex;flex-direction:column;align-items:center">
        ${gridAt(340, { gap: 1.5, radius: 0.24 })}
        <div style="font-size:104px;font-weight:800;letter-spacing:-.05em;margin-top:48px;line-height:1">7habits</div>
        <div style="font-size:38px;font-weight:500;color:${INK.muted};margin-top:22px;line-height:1.35">No account. No cloud.<br/>Your data stays on your phone.</div>
        <div style="margin-top:52px;padding:26px 54px;border-radius:999px;border:2px solid rgba(255,255,255,.22);
                    background:rgba(255,255,255,.06);font-size:44px;font-weight:700;letter-spacing:-.02em">
          ${CTA.offer}
        </div>
        <div style="font-size:33px;font-weight:600;color:${INK.paper};margin-top:30px;opacity:.85">${CTA.store}</div>
        <div style="font-size:23px;font-weight:500;color:${INK.dim};margin-top:12px">${CTA.fine}</div>
        <div style="margin-top:46px">${rampStrip(340, 12)}</div>
      </div>`,
  });
}

/** Large-type card for a single line of copy. */
export function quoteCard({ text, kicker = '7habits', fontFace, accent = null }) {
  const color = accent || habitHex(1);
  return vertical({
    fontFace,
    tint: color,
    content: `
      <div>
        <div style="font-size:30px;font-weight:700;letter-spacing:.2em;color:${color};text-transform:uppercase">${kicker}</div>
        <div style="font-size:100px;font-weight:800;letter-spacing:-.045em;line-height:1.06;margin-top:32px">${text}</div>
        <div style="margin-top:52px">${rampStrip(380, 12)}</div>
      </div>`,
  });
}

/** Plain vertical backgrounds to drop your own text onto. */
export function background({ fontFace, variant = 'dark' }) {
  if (variant === 'dark') {
    return page({
      w: 1080,
      h: 1920,
      fontFace,
      body: `<div class="aurora" style="opacity:.55"></div>`,
    });
  }
  // 'grid' — the mark used as a large, faint watermark
  return page({
    w: 1080,
    h: 1920,
    fontFace,
    body: `<div class="aurora"></div>
      <div class="layer" style="display:grid;place-items:center;opacity:.16">
        ${gridAt(980, { gap: 1.5, radius: 0.24 })}
      </div>`,
  });
}

/** Overlay showing where TikTok's own UI sits on a 9:16 frame. */
export function safeAreas({ fontFace }) {
  const { top, right, bottom, left } = TIKTOK_SAFE;
  const zone = (style, label, sub) =>
    `<div style="position:absolute;${style};background:rgba(255,64,84,.17);border:2px dashed rgba(255,110,125,.75);
       display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:12px">
       <div style="font-size:26px;font-weight:800;letter-spacing:.06em;color:#ffd9de">${label}</div>
       <div style="font-size:20px;font-weight:600;color:#ffb3bd;margin-top:6px">${sub}</div>
     </div>`;

  return page({
    w: 1080,
    h: 1920,
    fontFace,
    body: `<div class="aurora"></div>
      <div class="layer" style="display:grid;place-items:center;opacity:.22">${gridAt(760, {
        gap: 1.5,
        radius: 0.24,
      })}</div>

      <div style="position:absolute;left:${left}px;top:${top}px;right:${right}px;bottom:${bottom}px;
                  border:3px solid rgba(90,240,160,.9);border-radius:10px;
                  display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding-top:26px">
        <div style="font-size:30px;font-weight:800;letter-spacing:.14em;color:#7ef0b4">SAFE TEXT AREA</div>
        <div style="font-size:23px;font-weight:600;color:#8fdcb4;margin-top:8px">${
          1080 - left - right
        } &times; ${1920 - top - bottom} px</div>
      </div>

      ${zone(`left:0;top:0;width:1080px;height:${top}px`, 'TOP — TABS & SEARCH', `0 – ${top} px`)}
      ${zone(
        `right:0;top:${top}px;width:${right}px;bottom:${bottom}px`,
        'ACTION RAIL',
        `right ${right} px`,
      )}
      ${zone(
        `left:0;bottom:0;width:1080px;height:${bottom}px`,
        'CAPTION, HANDLE & SOUND',
        `bottom ${bottom} px`,
      )}

      <div style="position:absolute;left:${left}px;bottom:${bottom + 24}px;font-size:22px;
                  font-weight:600;color:${INK.muted};max-width:${1080 - left - right}px">
        1080 &times; 1920 &middot; 9:16 &middot; guide only, do not publish
      </div>`,
  });
}

/* ------------------------------------------------------- other social sizes */

export function igPost({ size = 1080, fontFace }) {
  return page({
    w: size,
    h: size,
    fontFace,
    body: `<div class="aurora"></div>
      <div class="layer" style="display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:80px">
        ${gridAt(400, { gap: 1.5, radius: 0.24 })}
        <div style="font-size:118px;font-weight:800;letter-spacing:-.05em;margin-top:56px;line-height:1">7habits</div>
        <div style="font-size:38px;font-weight:500;color:${INK.muted};margin-top:24px">${BRAND.tagline}</div>
        <div style="margin-top:40px">${rampStrip(400, 12)}</div>
      </div>`,
  });
}

export function xHeader({ w = 1500, h = 500, fontFace }) {
  // The avatar overlaps the lower-left corner, so keep that area quiet.
  return page({
    w,
    h,
    fontFace,
    body: `<div class="aurora"></div>
      <div class="layer" style="display:flex;align-items:center;justify-content:flex-end;gap:56px;padding:0 96px">
        <div style="text-align:right">
          <div style="font-size:92px;font-weight:800;letter-spacing:-.045em;line-height:1">7habits</div>
          <div style="font-size:30px;font-weight:500;color:${INK.muted};margin-top:16px">${BRAND.tagline}</div>
        </div>
        ${gridAt(260, { gap: 1.5, radius: 0.24 })}
      </div>`,
  });
}

/* ---------------------------------------------------------------- facebook */

/** Pixel geometry of the cover at export scale, shared by the art and its guide. */
function fbCoverBox() {
  const { scale, base, desktop, mobile, safe, avatarGuard } = FACEBOOK_COVER;
  const w = base.w * scale;
  const h = base.h * scale;
  return {
    w,
    h,
    scale,
    safe: { w: safe.w * scale, h: safe.h * scale },
    // how much each crop trims off the export, per side
    trimY: ((base.h - desktop.h) / 2) * scale,
    trimX: ((base.w - mobile.w) / 2) * scale,
    guard: avatarGuard * scale,
  };
}

/**
 * Page cover.
 *
 * Deliberately carries no grid mark: the profile picture sits directly below
 * the cover on both layouts and already *is* the mark, so repeating it here
 * just stacks the same lattice on itself. The cover takes the wordmark, the
 * tagline and the one claim that sells the app — the things a circular avatar
 * can't say. The ramp stands in as the graphic element.
 *
 * Centred horizontally because the mobile crop centres, and lifted by
 * `avatarGuard` so nothing tucks under the profile picture.
 */
export function fbCover({ fontFace } = {}) {
  const box = fbCoverBox();
  return page({
    w: box.w,
    h: box.h,
    fontFace,
    body: `<div class="aurora"></div>
      <div class="layer" style="display:flex;flex-direction:column;align-items:center;
                  justify-content:center;text-align:center;padding-bottom:${box.guard}px">
        <div style="font-size:132px;font-weight:800;letter-spacing:-.05em;line-height:1">7habits</div>
        <div style="font-size:40px;font-weight:500;color:${INK.muted};margin-top:22px;letter-spacing:-.012em">${
          BRAND.tagline
        }</div>
        <div style="margin-top:30px">${rampStrip(440, 12)}</div>
        <div style="font-size:27px;font-weight:500;color:${INK.dim};margin-top:26px">${
          CTA.privacy
        }</div>
      </div>`,
  });
}

/** Overlay showing what each crop keeps. Guide only — never upload this one. */
export function fbCoverSafeAreas({ fontFace } = {}) {
  const box = fbCoverBox();
  const { desktop, mobile, safe } = FACEBOOK_COVER;

  const band = (style, fill) =>
    `<div style="position:absolute;${style};background:${fill}"></div>`;

  const tag = (style, text, color) =>
    `<div style="position:absolute;${style};font-size:19px;font-weight:700;
       letter-spacing:.1em;color:${color};text-transform:uppercase">${text}</div>`;

  return page({
    w: box.w,
    h: box.h,
    fontFace,
    body: `<div class="aurora"></div>
      <div class="layer" style="display:grid;place-items:center;opacity:.2">${gridAt(300, {
        gap: 1.5,
        radius: 0.24,
      })}</div>

      ${band(`left:0;top:0;width:100%;height:${box.trimY}px`, 'rgba(255,64,84,.24)')}
      ${band(`left:0;bottom:0;width:100%;height:${box.trimY}px`, 'rgba(255,64,84,.24)')}
      ${band(`left:0;top:0;width:${box.trimX}px;height:100%`, 'rgba(255,176,64,.20)')}
      ${band(`right:0;top:0;width:${box.trimX}px;height:100%`, 'rgba(255,176,64,.20)')}
      ${band(
        `left:0;bottom:${box.trimY}px;width:100%;height:${box.guard - box.trimY}px`,
        'rgba(140,120,255,.22)',
      )}

      <div style="position:absolute;left:${box.trimX}px;top:${box.trimY}px;
                  width:${box.safe.w}px;height:${box.safe.h}px;
                  border:3px solid rgba(90,240,160,.9);border-radius:8px;
                  display:flex;flex-direction:column;align-items:center;justify-content:center">
        <div style="font-size:28px;font-weight:800;letter-spacing:.13em;color:#7ef0b4">ALWAYS VISIBLE</div>
        <div style="font-size:21px;font-weight:600;color:#8fdcb4;margin-top:7px">${safe.w} &times; ${
          safe.h
        } at 1&times; &middot; both crops</div>
      </div>

      ${tag(`left:${box.trimX + 16}px;top:14px`, `desktop crops ${desktop.w}×${desktop.h}`, '#ffb3bd')}
      ${tag(`left:16px;top:50%;`, `mobile ${mobile.w}×${mobile.h}`, '#ffd9a8')}
      ${tag(
        // centre the label in the guard band itself, not below it
        `left:${box.trimX + 16}px;bottom:${box.trimY + (box.guard - box.trimY) / 2 - 10}px`,
        'profile picture overlaps here',
        '#c9bcff',
      )}

      <div style="position:absolute;right:20px;bottom:14px;font-size:19px;font-weight:600;color:${
        INK.muted
      }">${box.w} &times; ${box.h} &middot; guide only, do not publish</div>`,
  });
}

export function ytThumb({ w = 1280, h = 720, fontFace }) {
  return page({
    w,
    h,
    fontFace,
    body: `<div class="aurora"></div>
      <div class="layer" style="display:flex;align-items:center;gap:64px;padding:0 88px">
        ${gridAt(340, { gap: 1.5, radius: 0.24 })}
        <div style="flex:1">
          <div style="font-size:44px;font-weight:700;letter-spacing:.16em;color:${habitHex(
            2,
          )};text-transform:uppercase">Seven days</div>
          <div style="font-size:118px;font-weight:800;letter-spacing:-.05em;line-height:.98;margin-top:16px">One habit<br/>at a time.</div>
          <div style="margin-top:30px">${rampStrip(360, 12)}</div>
        </div>
      </div>`,
  });
}
