#!/usr/bin/env node
// Renders the whole 7habits brand kit.
//
//   node brand/build/build.mjs
//
// Vector marks are written straight to brand/logo. Everything else is laid out
// as HTML, loaded in headless Chromium at its exact output size and
// screenshotted, so the PNGs are pixel-for-pixel what the templates describe.
//
// Needs Playwright's Chromium. If Playwright is installed globally the script
// finds it on its own; otherwise `npm i -D playwright && npx playwright install
// chromium` in this folder.

import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  INK,
  HABITS,
  FACEBOOK_COVER,
  YOUTUBE as YT,
  habitHex,
  auroraCss,
} from './tokens.mjs';
import {
  gridMarkSvg,
  gridTileSvg,
  sevenMarkSvg,
  lockupSvg,
  rampStripSvg,
} from './marks.mjs';
import * as T from './templates.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const CACHE = join(HERE, '.fontcache');

const FONT_CSS =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';

const FB_W = FACEBOOK_COVER.base.w * FACEBOOK_COVER.scale;
const FB_H = FACEBOOK_COVER.base.h * FACEBOOK_COVER.scale;

/* ------------------------------------------------------------------- font */

/**
 * Inter, latin subset, cached on disk. Inter ships as a variable font so one
 * file covers every weight we use. Returns '' if the font can't be fetched —
 * the layouts fall back to the system stack and still render.
 */
async function interFontFace() {
  const cached = join(CACHE, 'inter-latin.woff2');
  let buf = null;
  try {
    await access(cached);
    buf = await readFile(cached);
  } catch {
    try {
      const css = await (
        await fetch(FONT_CSS, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/131.0' } })
      ).text();
      const latin = css
        .split('@font-face')
        .slice(1)
        .find((b) => /U\+0000-00FF/.test(b));
      const url = latin && latin.match(/url\((https:[^)]+)\)/)?.[1];
      if (!url) throw new Error('no latin subset in Google Fonts response');
      buf = Buffer.from(await (await fetch(url)).arrayBuffer());
      await mkdir(CACHE, { recursive: true });
      await writeFile(cached, buf);
    } catch (err) {
      console.warn(`  ! Inter unavailable (${err.message}); using system fonts`);
      return '';
    }
  }
  return `@font-face{font-family:'Inter';src:url(data:font/woff2;base64,${buf.toString(
    'base64',
  )}) format('woff2');font-weight:100 900;font-style:normal;font-display:block}`;
}

/* --------------------------------------------------------------- renderer */

function loadChromium() {
  const require = createRequire(import.meta.url);
  const candidates = ['playwright', 'playwright-core'];
  try {
    const globalRoot = execSync('npm root -g', { encoding: 'utf8' }).trim();
    candidates.push(join(globalRoot, 'playwright'), join(globalRoot, 'playwright-core'));
  } catch {
    /* npm not on PATH — the local lookups may still work */
  }
  for (const id of candidates) {
    try {
      return require(id).chromium;
    } catch {
      /* try the next one */
    }
  }
  throw new Error(
    'Playwright not found. Run: npm i -D playwright && npx playwright install chromium',
  );
}

const written = [];

async function emit(relPath, contents) {
  const abs = join(ROOT, relPath);
  await mkdir(dirname(abs), { recursive: true });
  await writeFile(abs, contents);
  written.push(relPath);
}

/* ------------------------------------------------------------------- main */

async function main() {
  const fontFace = await interFontFace();
  const chromium = loadChromium();
  const browser = await chromium.launch({ args: ['--force-color-profile=srgb'] });

  /* 1. Vector marks ------------------------------------------------------ */
  console.log('· vector marks');
  await emit('brand/logo/mark-grid.svg', gridMarkSvg());
  await emit('brand/logo/mark-grid-tile.svg', gridTileSvg({ inset: 14 }));
  await emit('brand/logo/mark-grid-tile-rounded.svg', gridTileSvg({ inset: 16, rounded: 22 }));
  await emit('brand/logo/mark-seven.svg', sevenMarkSvg());
  await emit('brand/logo/favicon.svg', sevenMarkSvg({ background: INK.black, rounded: 22 }));
  await emit('brand/logo/ramp.svg', rampStripSvg());
  await emit('brand/logo/lockup-horizontal-dark.svg', lockupSvg({ theme: 'dark' }));
  await emit('brand/logo/lockup-horizontal-light.svg', lockupSvg({ theme: 'light' }));
  await emit(
    'brand/logo/lockup-stacked-dark.svg',
    lockupSvg({ orientation: 'stacked', theme: 'dark' }),
  );
  await emit(
    'brand/logo/lockup-stacked-light.svg',
    lockupSvg({ orientation: 'stacked', theme: 'light' }),
  );

  /* 2. Raster exports ---------------------------------------------------- */
  const jobs = [
    // avatars — square, safe inside a circular crop
    ['brand/export/profile/grid-1080.png', 1080, 1080, T.profileGrid({ size: 1080, fontFace })],
    ['brand/export/profile/grid-400.png', 400, 400, T.profileGrid({ size: 400, fontFace })],
    ['brand/export/profile/seven-1080.png', 1080, 1080, T.profileSeven({ size: 1080, fontFace })],

    // app + web
    ['brand/export/app-icon/appstore-1024.png', 1024, 1024, T.appIcon({ size: 1024, fontFace })],
    ['brand/export/web/og-1200x630.jpg', 1200, 630, T.ogImage({ fontFace })],
    ['brand/export/web/apple-touch-icon-180.png', 180, 180, T.appIcon({ size: 180, fontFace })],
    ['brand/export/web/icon-192.png', 192, 192, T.appIcon({ size: 192, fontFace })],
    ['brand/export/web/icon-512.png', 512, 512, T.appIcon({ size: 512, fontFace })],
    ['brand/export/web/favicon-32.png', 32, 32, T.faviconTile({ size: 32, fontFace })],
    ['brand/export/web/favicon-16.png', 16, 16, T.faviconTile({ size: 16, fontFace })],

    // tiktok 9:16
    ['brand/export/tiktok/safe-areas-1080x1920.jpg', 1080, 1920, T.safeAreas({ fontFace })],
    ['brand/export/tiktok/cover-brand-1080x1920.jpg', 1080, 1920, T.coverBrand({ fontFace })],
    ['brand/export/tiktok/end-card-1080x1920.jpg', 1080, 1920, T.endCard({ fontFace })],
    [
      'brand/export/tiktok/bg-dark-1080x1920.jpg',
      1080,
      1920,
      T.background({ fontFace, variant: 'dark' }),
    ],
    [
      'brand/export/tiktok/bg-grid-1080x1920.jpg',
      1080,
      1920,
      T.background({ fontFace, variant: 'grid' }),
    ],

    // other networks
    ['brand/export/instagram/post-1080.jpg', 1080, 1080, T.igPost({ fontFace })],
    [
      'brand/export/instagram/story-1080x1920.jpg',
      1080,
      1920,
      T.coverBrand({ fontFace }),
    ],
    ['brand/export/x/header-1500x500.jpg', 1500, 500, T.xHeader({ fontFace })],

    // youtube — the banner crops harder than anything else here: one 2560x1440
    // upload, but only the centred 1546x423 survives on every device.
    [
      `brand/export/youtube/banner-${YT.banner.w}x${YT.banner.h}.jpg`,
      YT.banner.w,
      YT.banner.h,
      T.ytBanner({ fontFace }),
    ],
    [
      `brand/export/youtube/banner-safe-areas-${YT.banner.w}x${YT.banner.h}.jpg`,
      YT.banner.w,
      YT.banner.h,
      T.ytBannerSafeAreas({ fontFace }),
    ],
    [
      `brand/export/youtube/avatar-${YT.avatar}.png`,
      YT.avatar,
      YT.avatar,
      T.profileGrid({ size: YT.avatar, fontFace }),
    ],
    // sits over live video, so it needs a transparent ground
    [
      `brand/export/youtube/watermark-${YT.watermark}.png`,
      YT.watermark,
      YT.watermark,
      T.ytWatermark({ fontFace }),
      { transparent: true },
    ],
    ['brand/export/youtube/end-screen-1280x720.jpg', 1280, 720, T.ytEndScreen({ fontFace })],
    ['brand/export/youtube/thumbnail-1280x720.jpg', 1280, 720, T.ytThumb({ fontFace })],
    [
      'brand/export/youtube/thumbnail-privacy-1280x720.jpg',
      1280,
      720,
      T.ytThumb({
        fontFace,
        kicker: 'Privacy',
        headline: 'It never<br/>leaves your<br/>phone.',
        accent: habitHex(3),
      }),
    ],
    [
      'brand/export/youtube/thumbnail-cycle-1280x720.jpg',
      1280,
      720,
      T.ytThumb({
        fontFace,
        kicker: 'Streaks',
        headline: '49 days.<br/>One cycle.',
        accent: habitHex(4),
      }),
    ],

    // facebook — only the cover is a ratio nothing else in the kit covers. The
    // page's other slots reuse existing exports; see brand/FACEBOOK-PAGE.md.
    [`brand/export/facebook/cover-${FB_W}x${FB_H}.jpg`, FB_W, FB_H, T.fbCover({ fontFace })],
    [
      `brand/export/facebook/cover-safe-areas-${FB_W}x${FB_H}.jpg`,
      FB_W,
      FB_H,
      T.fbCoverSafeAreas({ fontFace }),
    ],
    ['brand/export/facebook/profile-360.png', 360, 360, T.profileGrid({ size: 360, fontFace })],
  ];

  // one card per habit
  HABITS.forEach((h, i) => {
    const n = String(i + 1).padStart(2, '0');
    jobs.push([
      `brand/export/tiktok/habit-${n}-${h.key}-1080x1920.jpg`,
      1080,
      1920,
      T.habitCard({ index: i, fontFace }),
    ]);
  });

  // Pull-quote cards built from the app's real selling points. The kicker names
  // the angle rather than repeating the brand — the lockup already does that.
  const quotes = [
    ['Your data never leaves your phone.', 2, 'Privacy'],
    ['Seven habits. Seven days. Better you.', 0, 'The idea'],
    ['Forty-nine days is one full cycle.', 3, 'Streaks'],
  ];
  quotes.forEach(([text, accentIdx, kicker], i) => {
    jobs.push([
      `brand/export/tiktok/quote-${String(i + 1).padStart(2, '0')}-1080x1920.jpg`,
      1080,
      1920,
      T.quoteCard({ text, kicker, fontFace, accent: habitHex(accentIdx) }),
    ]);
  });

  console.log(`· rendering ${jobs.length} images`);
  const ctx = await browser.newContext({ deviceScaleFactor: 1 });
  for (const [relPath, w, h, html, opts = {}] of jobs) {
    const pg = await ctx.newPage();
    await pg.setViewportSize({ width: w, height: h });
    await pg.setContent(html, { waitUntil: 'load' });
    await pg.evaluate(() => document.fonts.ready);
    const abs = join(ROOT, relPath);
    await mkdir(dirname(abs), { recursive: true });
    // Full-frame artwork is a wash of smooth gradient, which PNG stores badly
    // (~1.3 MB a card). JPEG at 94 is visually identical here and ~10x smaller.
    // Icons, avatars and marks stay PNG for crisp edges.
    const jpeg = relPath.endsWith('.jpg');
    await pg.screenshot(
      jpeg
        ? { path: abs, type: 'jpeg', quality: 94 }
        : { path: abs, type: 'png', omitBackground: Boolean(opts.transparent) },
    );
    await pg.close();
    written.push(relPath);
  }
  await ctx.close();
  await browser.close();

  /* 3. Contact sheet ----------------------------------------------------- */
  console.log('· contact sheet');
  await emit('brand/export/index.html', contactSheet(jobs));

  console.log(`\n${written.length} files written:`);
  for (const f of written) console.log(`  ${f}`);
}

/** A browsable index of every export, written to brand/export/index.html. */
function contactSheet(jobs) {
  const groups = new Map();
  for (const [relPath, w, h] of jobs) {
    const parts = relPath.split('/');
    const folder = parts[2];
    const file = parts.slice(3).join('/');
    if (!groups.has(folder)) groups.set(folder, []);
    groups.get(folder).push({ file, w, h, src: parts.slice(3).join('/') });
  }
  const titles = {
    profile: 'Profile pictures',
    'app-icon': 'App icon',
    web: 'Web and link previews',
    tiktok: 'TikTok',
    instagram: 'Instagram',
    facebook: 'Facebook',
    x: 'X',
    youtube: 'YouTube',
  };
  const order = [
    'profile',
    'app-icon',
    'tiktok',
    'instagram',
    'facebook',
    'x',
    'youtube',
    'web',
  ];

  const logoSection = () => {
    const svgs = written.filter((f) => f.startsWith('brand/logo/'));
    const cards = svgs
      .map((f) => {
        const name = f.split('/').pop();
        // Light-theme lockups are dark ink; show them on a light tile or they
        // vanish into the sheet's background.
        const light = name.includes('-light') ? ' class="light"' : '';
        return `
        <figure${light}>
          <a href="../logo/${name}"><img src="../logo/${name}" alt="${name}" loading="lazy"/></a>
          <figcaption><b>${name}</b><span>vector${light ? ' &middot; for light backgrounds' : ''}</span></figcaption>
        </figure>`;
      })
      .join('');
    return `<section><h2>Logo (vector)</h2><div class="grid">${cards}</div></section>`;
  };

  const sections = order
    .filter((k) => groups.has(k))
    .map((k) => {
      const cards = groups
        .get(k)
        .map(
          ({ file, w, h, src }) => `
        <figure>
          <a href="${k}/${src}"><img src="${k}/${src}" alt="${file}" loading="lazy"/></a>
          <figcaption><b>${file}</b><span>${w} &times; ${h}</span></figcaption>
        </figure>`,
        )
        .join('');
      return `<section><h2>${titles[k] || k}</h2><div class="grid">${cards}</div></section>`;
    })
    .join('');

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="robots" content="noindex"/>
<title>7habits brand kit — contact sheet</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:${INK.black};color:${INK.paper};padding:48px 32px 96px;
    font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
    background-image:${auroraCss()};background-attachment:fixed}
  header{max-width:1200px;margin:0 auto 56px}
  h1{font-size:2.6rem;font-weight:800;letter-spacing:-.04em}
  header p{color:${INK.muted};margin-top:10px}
  header a{color:${INK.violetLight}}
  section{max-width:1200px;margin:0 auto 56px}
  h2{font-size:1.05rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
    color:${INK.muted};padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,.1)}
  .grid{display:grid;gap:24px;margin-top:24px;
    grid-template-columns:repeat(auto-fill,minmax(200px,1fr))}
  figure{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
    border-radius:14px;overflow:hidden}
  img{display:block;width:100%;height:200px;object-fit:contain;background:${INK.black};padding:10px}
  figure.light img{background:${INK.paper}}
  figcaption{padding:12px 14px;font-size:.78rem;display:flex;flex-direction:column;gap:3px}
  figcaption b{font-weight:600;word-break:break-all}
  figcaption span{color:${INK.dim}}
</style></head>
<body>
  <header>
    <h1>7habits brand kit</h1>
    <p>Every generated export. Click any tile for the full-size file.
       Regenerate with <code>node brand/build/build.mjs</code>.</p>
    <p><a href="../README.md">README</a> &middot;
       <a href="../BRAND.md">Brand guide</a> &middot;
       <a href="../CONTENT-KIT.md">Content kit</a></p>
  </header>
  ${logoSection()}
  ${sections}
</body></html>`;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
