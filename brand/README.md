# 7habits brand kit

Logo, app icon, and ready-to-upload social artwork for 7habits.

- **[BRAND.md](BRAND.md)** — colours, type, the marks, and the rules
- **[CONTENT-KIT.md](CONTENT-KIT.md)** — bio, hashtags, captions, and what to post
- **[FACEBOOK-PAGE.md](FACEBOOK-PAGE.md)** — Page setup: fields, cover sizing, and copy
- `logo/` — vector marks and lockups (SVG)
- `export/` — sized exports, ready to upload
- `build/` — the generator; everything in `logo/` and `export/` comes from it

Nothing here is hand-drawn. To change an asset, edit the source and rebuild —
see [Rebuilding](#rebuilding).

---

## Set up a TikTok account with these

1. **Profile photo** → `export/profile/grid-1080.png`.
   TikTok crops avatars to a circle; the grid is inset to survive that. Prefer
   `export/profile/seven-1080.png` if you want something readable at thumbnail
   size in a comment thread — it's the same palette as a single bold `7`.
2. **Bio and handle** → copy from [CONTENT-KIT.md](CONTENT-KIT.md).
3. **First posts** → the seven habit cards in `export/tiktok/`, one per day.
4. **End every video** with `export/tiktok/end-card-1080x1920.jpg`.
5. **Before you export a video**, check your text against
   `export/tiktok/safe-areas-1080x1920.jpg` — see [Safe areas](#safe-areas).

---

## What's in `export/`

### Profile pictures — works on every network

| File | Size | Notes |
|---|---|---|
| `profile/grid-1080.png` | 1080×1080 | Primary avatar. Survives a circular crop. |
| `profile/grid-400.png` | 400×400 | Same, for anywhere that caps upload size. |
| `profile/seven-1080.png` | 1080×1080 | Alternative avatar; far clearer when shown small. |

### TikTok

| File | Size | Use |
|---|---|---|
| `tiktok/cover-brand-1080x1920.jpg` | 1080×1920 | Cover for a pinned post or channel trailer |
| `tiktok/end-card-1080x1920.jpg` | 1080×1920 | Hold 2–3s at the end of a video |
| `tiktok/habit-01…07-*.jpg` | 1080×1920 | One finished card per habit — a seven-post run |
| `tiktok/quote-01…03-*.jpg` | 1080×1920 | Single-line cards on the app's selling points |
| `tiktok/bg-dark-1080x1920.jpg` | 1080×1920 | Empty branded background for your own text |
| `tiktok/bg-grid-1080x1920.jpg` | 1080×1920 | Same, with the mark as a faint watermark |
| `tiktok/safe-areas-1080x1920.jpg` | 1080×1920 | **Guide only — never publish this one** |

### Instagram

| File | Size | Use |
|---|---|---|
| `instagram/post-1080.jpg` | 1080×1080 | Square feed post |
| `instagram/story-1080x1920.jpg` | 1080×1920 | Story / Reel cover |

The TikTok habit and quote cards work as Reels covers unchanged.

### Facebook

See [FACEBOOK-PAGE.md](FACEBOOK-PAGE.md) for Page fields and copy.

| File | Size | Use |
|---|---|---|
| `facebook/profile-360.png` | 360×360 | Page profile picture |
| `facebook/cover-1640x720.jpg` | 1640×720 | Page cover. Upload as-is — don't drag or zoom it. |
| `facebook/cover-safe-areas-1640x720.jpg` | 1640×720 | Guide layer. Don't upload. |

The cover carries no grid mark on purpose: the profile picture sits directly
beneath it and already is the mark.

### YouTube

| File | Size | Use |
|---|---|---|
| `youtube/avatar-800.png` | 800×800 | Channel profile picture |
| `youtube/banner-2560x1440.jpg` | 2560×1440 | Channel banner |
| `youtube/banner-safe-areas-2560x1440.jpg` | 2560×1440 | Guide layer. Don't upload. |
| `youtube/watermark-150.png` | 150×150 | Player watermark. Transparent PNG; uses the seven mark. |
| `youtube/thumbnail-1280x720.jpg` | 1280×720 | Video thumbnail — "One habit at a time." |
| `youtube/thumbnail-privacy-1280x720.jpg` | 1280×720 | Thumbnail — privacy angle |
| `youtube/thumbnail-cycle-1280x720.jpg` | 1280×720 | Thumbnail — 49-day cycle angle |
| `youtube/end-screen-1280x720.jpg` | 1280×720 | Outro card; right half left clear for end-screen elements |

The end screen's right half is empty on purpose — that's where YouTube drops
the video element and subscribe badge you add in Studio. Keep them there and
nothing lands on type.

### X, app, web

| File | Size | Use |
|---|---|---|
| `x/header-1500x500.jpg` | 1500×500 | X profile header; bottom-left kept clear for the avatar |
| `app-icon/appstore-1024.png` | 1024×1024 | App Store icon. Full-bleed, no alpha, no baked corners — iOS masks it. |
| `web/og-1200x630.jpg` | 1200×630 | Link preview card |
| `web/apple-touch-icon-180.png` | 180×180 | iOS home screen |
| `web/icon-192.png`, `web/icon-512.png` | 192, 512 | Web app manifest |
| `web/favicon-16.png`, `web/favicon-32.png` | 16, 32 | Browser tab |

The web icons are already wired into the site's pages and `site.webmanifest`.

---

## Safe areas

TikTok draws its own UI over roughly a third of a 9:16 frame: tabs across the
top, the action rail down the right, and caption, handle and sound along the
bottom. Anything you put there is covered.

`export/tiktok/safe-areas-1080x1920.jpg` marks the zones. At 1080×1920 the
usable box is **840×1240 px**, inset 200 top, 240 right, 480 bottom, 90 left.
Drop it as a top layer in CapCut or your editor, position your text inside the
green box, then hide it before exporting.

These margins are deliberately generous and TikTok moves its controls between
releases — treat them as guidance, not gospel. They live in `TIKTOK_SAFE` in
`build/tokens.mjs`.

Every card in `export/tiktok/` already respects them, except `cover-brand` and
the Instagram story, which are centred in the full frame because covers are
shown uncropped.

### Facebook and YouTube crop too

Both render one upload at several sizes, so both ship a `*-safe-areas-*.jpg`
guide alongside the artwork. Neither guide is for uploading — they're overlay
layers with coloured zone boxes on them.

| | Upload | Guaranteed visible | Lives in |
|---|---|---|---|
| Facebook cover | 1640×720 | 640×312 at 1× (desktop crops 820×312, mobile 640×360) | `FACEBOOK_COVER` |
| YouTube banner | 2560×1440 | 1546×423 centred (desktop 2560×423, TV the whole frame) | `YOUTUBE` |

YouTube is the harsher of the two: only about 30% of the uploaded height
survives on a phone, and everything outside the centre band is bleed that only
TV viewers ever see. Both objects are in `build/tokens.mjs` — the artwork and
its guide derive from the same numbers, so moving one moves both.

---

## Rebuilding

```sh
node brand/build/build.mjs
```

Needs Node 18+ and Playwright's Chromium. If Playwright isn't already installed
globally:

```sh
npm i -D playwright && npx playwright install chromium
```

Layouts are HTML, rendered in headless Chromium at each asset's exact output
size and screenshotted — so what the template describes is what lands in the
PNG, down to the pixel. Inter is fetched once from Google Fonts and cached in
`build/.fontcache/` (gitignored); with no network the build still runs and falls
back to system fonts.

| File | What to change there |
|---|---|
| `build/tokens.mjs` | Colours, habit names and order, safe-area margins |
| `build/marks.mjs` | The marks themselves |
| `build/templates.mjs` | Layouts, and the marketing copy in `HABIT_LINES` and `CTA` |
| `build/build.mjs` | Which assets get exported, and at what size |

Full-frame artwork exports as JPEG (quality 94) and icons as PNG. The aurora
wash is a smooth gradient, which PNG stores badly — the whole set is 3.8 MB as
JPEG versus 22 MB as PNG, with no visible difference.

---

## Two things this kit doesn't include

- **Apple's "Download on the App Store" badge.** It's Apple's trademark with its
  own layout rules; the end card leaves room and says "On the App Store" in type
  instead. Get the real badge from Apple's marketing guidelines and drop it in.
- **Video.** Everything here is a still. The cards are built to be the first and
  last frames of a video you shoot or animate elsewhere.
