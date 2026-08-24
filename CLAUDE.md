# 7habits

The public GitHub Pages site for the 7habits iOS app — a splash page
(`index.html`) plus the legal and support pages (`privacy.html`, `terms.html`,
`support.html`) — and the complete brand kit in `brand/`.

**These URLs are baked into the App Store listing and the shipped app. Never
rename this repo, and never move or rename those four pages.**

This is not the marketing site. Related repos:

| Work about… | Repo |
|---|---|
| App features, iOS build, App Store submission, IAPs, listing copy | `ndmr0/7habits-app` |
| Landing page at 7habits.app | source in `7habits-app`, built into `ndmr0/7habits-site` (Vercel) |
| Ads, hooks, social posts, captions, content batches | `ndmr0/7habits-content` |
| Privacy / Terms / Support text, and the brand kit | this repo |

## Producing social, marketing, or brand content

**The assets already exist. Use them — don't make new ones.** `brand/export/`
holds 39 finished, correctly-sized files for TikTok, Facebook, YouTube,
Instagram, X, the App Store, and the web. Open `brand/export/index.html` to see
the lot.

Before generating any logo, icon, avatar, cover, banner, thumbnail, or post
image for this product, check `brand/README.md` first — the odds are it's
already been made at the right size, with the platform's crop accounted for.

| Need | Read |
|---|---|
| What exists and what size it is | [`brand/README.md`](brand/README.md) |
| Colours, type, the two marks, usage rules | [`brand/BRAND.md`](brand/BRAND.md) |
| Bio, handles, hashtags, captions, post ideas | [`brand/CONTENT-KIT.md`](brand/CONTENT-KIT.md) |
| Facebook Page fields and cover sizing | [`brand/FACEBOOK-PAGE.md`](brand/FACEBOOK-PAGE.md) |

Everything derives from the 7×7 colour grid on `index.html`, so the artwork and
the site can't drift apart. To change anything, edit `brand/build/tokens.mjs`
and run `node brand/build/build.mjs` — never hand-edit a file in `export/`, it
will be overwritten on the next build.

## Claims — do not alter these

Two lines appear on artwork. Both were checked against `terms.html` and
`support.html`, and both are accuracy constraints, not style preferences.

**"No account. No cloud. Your data stays on your phone."** True as the app
stands: nothing is uploaded, no account is required, data exports from
Settings. Do **not** upgrade it to "encrypted", "anonymous", "zero-knowledge",
or "we never track you" — none of that is claimed or verified. If sync,
accounts, or analytics ever ship, this line and every asset carrying it must
change.

**"Start free for 30 days."** The introductory offer applies to Monthly and
Yearly, only for Apple IDs that haven't used it before, and converts to a paid
subscription unless cancelled at least 24 hours before it ends. Lifetime has no
trial. Always pair the trial with the renewal — "30 days free, then it renews
unless you cancel."

Also, always:

- **Never write "free app", "free forever", or "free download".** It's a paid
  subscription with a trial. The unqualified version reads as a lie the moment
  someone hits the paywall.
- **Never put prices on artwork or in a profile field.** They vary by region and
  they change. Let the App Store show them.
- **Never describe the app as health, medical, or wellness advice**, or file it
  under a category that implies it. It tracks habits. It does not advise.
- **Never invent features.** No sync, no accounts, no reminders, no widgets, no
  Android, no web app.
- **Never redraw Apple's "Download on the App Store" badge.** Use the official
  artwork from Apple's marketing guidelines. The end cards leave room for it.

## Never publish a guide layer

Three exports are overlay layers for checking artwork against a platform's
crop. They have coloured zone boxes drawn on them and are **not** artwork:

```
brand/export/tiktok/safe-areas-1080x1920.jpg
brand/export/facebook/cover-safe-areas-1640x720.jpg
brand/export/youtube/banner-safe-areas-2560x1440.jpg
```

Anything with `safe-areas` in the filename is a guide. Never upload one.

## Platforms that crop

Three platforms render one upload at several sizes, so artwork has to survive
the worst crop, not the best one.

| | Upload | Guaranteed visible |
|---|---|---|
| TikTok | 1080×1920 | 840×1240 inset box (UI covers the rest) |
| Facebook cover | 1640×720 | 640×312 at 1× — desktop crops 820×312, mobile 640×360 |
| YouTube banner | 2560×1440 | 1546×423 centred — the rest is TV-only bleed |

The geometry lives in `TIKTOK_SAFE`, `FACEBOOK_COVER`, and `YOUTUBE` in
`brand/build/tokens.mjs`. Artwork and its guide derive from the same numbers, so
moving one moves both. Meta's and Google's published sizes aren't verifiable
from this repo — if one has changed, edit the token and rebuild.

Upload covers and banners **as-is**. Repositioning or zooming them in the
platform's cropper defeats the composition.

## Two marks, and when each one wins

- **Grid** — the 7×7 habit/day lattice. App icon, avatars, covers. 48px and up.
- **Seven** — a geometric `7` in the same hues. Favicons, watermarks, and
  anywhere small, where 49 separate cells blur into mush.

The seven mark never pairs with the wordmark — "7" + "7habits" reads as
*77habits*. And don't put a mark next to its own avatar: the Facebook cover and
YouTube banner sit directly above the profile picture, so repeating the grid
there stacks the same lattice on itself.

## The app, factually

Seven habits — Prayer, Gratitude, Connection, Exercise, Hydration, Sleep,
Nutrition — chosen to cover the spiritual, emotional, and physical sides of a
day. A streak counts consecutive days. Every 7 days earns a small celebration;
every 49 days (seven weeks) completes a full cycle. Miss a day and the streak
resets, but the colour history stays. Support: `nelsonmoncayo@gmail.com`.

The habit→colour mapping in `tokens.mjs` pairs the hues from `index.html` with
the habit names from the support FAQ in listed order. If the app orders its
columns differently, fix the `HABITS` array and rebuild.
