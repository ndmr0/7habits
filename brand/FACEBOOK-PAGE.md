# 7habits — Facebook Page

Everything needed to stand the Page up: which file goes in which slot, the
fields to fill in, and copy for the first month. Claims match `terms.html` and
`support.html` — read [Claims](#claims) before editing any of them.

Companion to [`CONTENT-KIT.md`](CONTENT-KIT.md), which covers TikTok, Instagram
and X. Where the two overlap, this file wins for Facebook.

Handing the setup to someone else? [`FACEBOOK-AGENT-PROMPT.md`](FACEBOOK-AGENT-PROMPT.md)
is this file reshaped as a self-contained brief, with full post captions rather
than openers. This file stays the source of truth for claims.

> **On the numbers below.** Meta moves its image sizes and field limits between
> releases, and they aren't verifiable from inside this repo. Treat them as
> current-as-written, check anything that looks off, and if a size has moved,
> edit `FACEBOOK_COVER` in `build/tokens.mjs` and re-run `node
> brand/build/build.mjs` — the cover and its guide both derive from that one
> object.

---

## Assets

Only the cover is a shape nothing else in the kit already covers. Every other
slot reuses an existing export rather than shipping a near-duplicate file.

| Slot | File | Size |
|---|---|---|
| Profile picture | `export/facebook/profile-360.png` | 360×360 |
| Cover photo | `export/facebook/cover-1640x720.jpg` | 1640×720 |
| Shared-link preview | `export/web/og-1200x630.jpg` | 1200×630 |
| Square post | `export/instagram/post-1080.jpg` | 1080×1080 |
| Story | `export/instagram/story-1080x1920.jpg` | 1080×1920 |
| Video end card | `export/tiktok/end-card-1080x1920.jpg` | 1080×1920 |

`export/facebook/cover-safe-areas-1640x720.jpg` is a guide layer for checking
your own cover art. It is not for uploading.

### Why the cover is 1640×720

Facebook renders **one** uploaded cover at **two** different crops:

- **Desktop** — 820×312, full width, centre of the height
- **Mobile** — 640×360, full height, centre of the width

Export at 820×360 (doubled here to 1640×720 for retina) and both crops are fed
from the same file. What survives both is the intersection — **640×312,
centred** — so all type lives inside that box. The profile picture overlaps the
bottom edge on both layouts, so the lower strip stays empty too.

The cover deliberately carries **no grid mark.** The profile picture sits
directly beneath it and already is the mark; repeating it stacks the same
lattice on itself. The cover takes the wordmark, the tagline and the privacy
line — what a circular avatar can't say.

---

## Page fields

**Page name:** `7habits`

**Username:** must match whatever you take on the other networks so the handle
is the same everywhere. Nothing is registered yet — check in this order and
take the first free across all four:

`@7habitsapp` · `@get7habits` · `@7habitsapp.official` · `@try7habits`

Facebook usernames allow letters, numbers and periods, and can't be changed
freely once you have followers — so decide before you promote the Page.

**Category:** *App Page* as primary. Add *Health & Wellness* as a secondary if
Facebook offers the slot; skip anything implying medical advice — the app
tracks habits, it doesn't give health guidance, and the wrong category invites
the wrong expectations.

**Bio** (short, roughly 101 characters):

```
Seven habits. Seven days. Better you. Private by default — nothing leaves your phone.
```

That's 85. A shorter one if the field is tighter than expected:

```
Seven habits. Seven days. Better you. On-device only.
```

**About / description** (roughly 255 characters):

```
A habit tracker built around seven habits and a seven-day week: Prayer,
Gratitude, Connection, Exercise, Hydration, Sleep, Nutrition. No account, no
cloud — everything stays on your iPhone. Seven weeks completes a full cycle.
```

**Website:** your App Store listing once it's live. Until then the site — it
already has Privacy, Terms and Support linked from the home page, which is
what Facebook looks for when reviewing a Page.

**Email:** `nelsonmoncayo@gmail.com` — the same support address published on
`support.html`, so the Page matches the site.

**Action button:** *Use App* pointing at the App Store listing, or *Learn More*
pointing at the site while the listing is pending. Don't set *Sign Up* — there
is no account to sign up for, and the mismatch undercuts the privacy claim.

---

## Facebook isn't TikTok

Worth knowing before pasting the TikTok plan in here:

- **Link posts get throttled.** Put the link in the first comment, or post the
  image and let the caption carry the pitch.
- **Cold Pages have almost no organic reach.** The first weeks are for having
  something to look at when someone checks whether you're real — not for
  growth. Judge it on completeness, not views.
- **Captions can be long.** Facebook readers tolerate a paragraph; TikTok
  readers don't. The habit cards can carry more text here.
- **Native video beats reposts.** Upload the file rather than linking TikTok —
  a TikTok watermark is downranked.

---

## The first posts

### 1. Pin this one

Post it, then pin it to the top of the Page.

> **7habits is a habit tracker with an unusual constraint: seven habits, and
> only seven.**
>
> Prayer. Gratitude. Connection. Exercise. Hydration. Sleep. Nutrition. Enough
> to cover the spiritual, emotional and physical sides of a day — few enough
> that you can hold the whole thing in your head.
>
> Seven days makes a week. Seven weeks — 49 days — completes a full cycle, and
> the grid fills in as you go.
>
> There's no account. Nothing is uploaded. Your history lives on your phone and
> nowhere else, and you can export it whenever you want.
>
> 30 days free on Monthly or Yearly for new subscribers. It renews unless you
> cancel.

Image: `export/instagram/post-1080.jpg`

### 2. Seven posts, one habit each

Same cards as the TikTok run, with room for a longer caption. Post three to
five a week rather than seven and then nothing.

| # | Card | Caption opener |
|---|---|---|
| 1 | `habit-01-prayer` | The first habit isn't productivity. It's stillness. |
| 2 | `habit-02-gratitude` | One good thing. That's the whole habit. |
| 3 | `habit-03-connection` | The habit most people skip is the one that helps most. |
| 4 | `habit-04-exercise` | Not a workout plan. Just: did you move today? |
| 5 | `habit-05-hydration` | Easiest habit to track. Easiest to forget. |
| 6 | `habit-06-sleep` | You can't out-habit bad sleep. |
| 7 | `habit-07-nutrition` | Seven days in — here's the last one. |

Cards are in `export/tiktok/`. They're 9:16, which Facebook shows fine in-feed
and natively in Stories.

### 3. Then, as needed

- `quote-01` — the privacy line
- `quote-02` — the tagline
- `quote-03` — the 49-day cycle

Each stands alone as a post whenever the queue runs dry.

---

## Claims

Unchanged from `CONTENT-KIT.md`, repeated because it's easy to drift when
rewriting for a new network:

**"No account. No cloud. Your data stays on your phone."** True as the app
stands — nothing is uploaded, no account is required, and data exports from
Settings. If sync, accounts or analytics ever ship, this line and every asset
carrying it have to change.

**"Start free for 30 days."** The introductory offer applies to Monthly and
Yearly, only for Apple IDs that haven't used it before, and converts to a paid
subscription unless cancelled at least 24 hours before it ends. Lifetime has no
trial. Say "30 days free, then it renews unless you cancel" — never "free app".

**No prices on artwork or in the About field.** They vary by region and they
change. Let the App Store show them.

**No "Download on the App Store" badge in the kit.** Apple's badge is theirs and
shouldn't be redrawn — take the official artwork from Apple's marketing
guidelines and drop it in where the end card leaves room.
