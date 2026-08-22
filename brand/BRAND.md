# 7habits — brand basics

Everything here is generated from `brand/build/tokens.mjs`, which mirrors the
colour grid already used on the website. Change a value there and rebuild; don't
hand-edit exported files.

---

## The name

Always **7habits** — one word, lowercase `h`, digit `7`. Never "7 Habits",
"7Habits", or "Seven Habits".

**Tagline:** Seven habits. Seven days. Better you.

---

## The marks

**Grid mark** — a 7×7 lattice: seven habit columns across, seven day rows down,
each row a step darker. This is the primary mark. Use it for the app icon,
profile pictures, covers, and anywhere it will render at 48px or larger.

**Seven mark** — a geometric `7` carrying the same seven hues. Use it *only*
below about 48px, where 49 separate cells blur into mush: favicons, watermarks,
tiny badges.

Never place the seven mark next to the wordmark — "7" + "7habits" reads as
*77habits*. The wordmark pairs with the grid mark only.

| File | Use |
|---|---|
| `logo/mark-grid.svg` | Grid mark, transparent background |
| `logo/mark-grid-tile.svg` | Grid mark on the dark brand ground |
| `logo/mark-grid-tile-rounded.svg` | Same, with rounded corners |
| `logo/mark-seven.svg` | Seven mark, transparent background |
| `logo/favicon.svg` | Seven mark on a dark rounded tile |
| `logo/ramp.svg` | The seven habit colours as a strip |
| `logo/lockup-horizontal-{dark,light}.svg` | Mark + wordmark + tagline, side by side |
| `logo/lockup-stacked-{dark,light}.svg` | Mark above wordmark + tagline |

Clear space around any mark: at least the width of one grid cell (⅐ of the mark).
Minimum sizes — grid mark 48px, seven mark 16px.

The lockup SVGs set `font-family: Inter, …` with a system fallback, so they
render correctly anywhere but only match the exports exactly where Inter is
installed. For pixel-perfect placement use the PNG/JPG exports.

---

## Colour

### Ground and text

| Token | Hex | Use |
|---|---|---|
| Black | `#09090f` | Page and asset background |
| Panel | `#0e0e16` | Raised surface |
| Paper | `#f6f6fa` | Primary text on dark |
| Muted | `#9d9db5` | Secondary text |
| Dim | `#6f6f8c` | Fine print |
| Violet | `#5b4fd6` | Links on light backgrounds |
| Violet light | `#9d8bff` | Links on dark backgrounds |

### The seven habits

Each habit owns a hue. The base swatch below is row 3 of the grid (lightness 60%),
which is the one to use when a habit needs a single colour.

| # | Habit | Hue | Base |
|---|---|---|---|
| 01 | Prayer | `hsl(280 70%)` | `#b152e0` |
| 02 | Gratitude | `hsl(245 75%)` | `#594ce6` |
| 03 | Connection | `hsl(210 80%)` | `#4799eb` |
| 04 | Exercise | `hsl(145 65%)` | `#57db8e` |
| 05 | Hydration | `hsl(45 90%)` | `#f5c73d` |
| 06 | Sleep | `hsl(25 90%)` | `#f58a3d` |
| 07 | Nutrition | `hsl(0 72%)` | `#e25050` |

> **Check this order against the app.** The hues come from `index.html`; the
> habit names come from the support page FAQ. Pairing them in listed order is an
> assumption — if the app orders its columns differently, fix the `HABITS` array
> in `brand/build/tokens.mjs` and rebuild. Nothing else needs to change.

### The seven days

Each habit column runs seven steps, lightness 72% down to 36% — day one lightest,
day seven darkest.

| Habit | Day 1 | 2 | 3 | 4 | 5 | 6 | Day 7 |
|---|---|---|---|---|---|---|---|
| Prayer | `#c886ea` | `#bd6ce5` | `#b152e0` | `#a538dc` | `#9725d0` | `#8420b6` | `#711c9c` |
| Gratitude | `#8b82ed` | `#7267e9` | `#594ce6` | `#4032e2` | `#2e1fd6` | `#281bbb` | `#2217a1` |
| Connection | `#7eb8f1` | `#63a8ee` | `#4799eb` | `#2c8ae8` | `#187adc` | `#156bc1` | `#125ca5` |
| Exercise | `#89e6b0` | `#70e19f` | `#57db8e` | `#3dd67d` | `#2bca6d` | `#25b15f` | `#209752` |
| Hydration | `#f8d877` | `#f6cf5a` | `#f5c73d` | `#f3be20` | `#e9b10c` | `#cb9b0b` | `#ae8509` |
| Sleep | `#f8ad77` | `#f69b5a` | `#f58a3d` | `#f37820` | `#e9680c` | `#cb5b0b` | `#ae4e09` |
| Nutrition | `#eb8484` | `#e76a6a` | `#e25050` | `#de3535` | `#d32222` | `#b81e1e` | `#9e1a1a` |

### The aurora

Four soft radial washes over the black ground — violet top-left, blue top-right,
green bottom-right, orange bottom-left. It is what makes an asset feel like
7habits even with no logo on it. Never replace it with a flat colour on a
full-frame asset.

---

## Type

**Inter**, and nothing else. The build downloads the Latin subset from Google
Fonts and caches it in `brand/build/.fontcache/` (gitignored).

| Role | Weight | Tracking |
|---|---|---|
| Wordmark and headlines | 800 | −0.045em |
| Kickers and labels | 700, uppercase | +0.2em |
| Body and taglines | 500 | −0.01em |
| Fine print | 500 | 0 |

Headlines are always tight and lowercase-friendly. Kickers are always uppercase
and widely tracked. That contrast is the whole type system.

---

## Writing

Short declaratives. Full stops, not exclamation marks. The tagline's rhythm —
*Seven habits. Seven days. Better you.* — is the house voice.

Two claims are load-bearing and must stay accurate against `terms.html` and
`support.html`:

- **Privacy.** "No account. No cloud. Your data stays on your phone." True today:
  nothing is uploaded and no account is required. If that ever changes, every
  asset carrying this line has to be rebuilt.
- **The trial.** "Start free for 30 days" applies to Monthly and Yearly for Apple
  IDs that have not used the offer before, and it auto-renews unless cancelled.
  Always pair it with that fine print. Lifetime has no trial. Don't shorten it to
  "free app".

Both strings live in `CTA` in `brand/build/templates.mjs`. Change them there.

---

## Don't

- Recolour the marks, or rebuild the grid with different hues.
- Put the grid mark on a light or busy background — it needs the dark ground.
- Stretch anything; every asset is a fixed pixel size for a reason.
- Rebuild Apple's "Download on the App Store" badge by hand. Use the official
  artwork from Apple's marketing guidelines.
- Publish any file with `safe-areas` in its name. Three exports are working
  guides with coloured zone boxes drawn on them, not artwork:
  `export/tiktok/safe-areas-1080x1920.jpg`,
  `export/facebook/cover-safe-areas-1640x720.jpg`, and
  `export/youtube/banner-safe-areas-2560x1440.jpg`.
- Reposition a cover or banner in the platform's own cropper. They're composed
  to survive that platform's crop; dragging them defeats it.
- Pair a mark with its own avatar. The Facebook cover and YouTube banner sit
  directly above the profile picture, so a grid mark on either stacks the same
  lattice on itself.
