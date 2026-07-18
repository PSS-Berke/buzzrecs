# BuzzRecs Handbook

> Shared source of truth for all BuzzRecs chats. Upload the latest copy to the
> BuzzRecs project knowledge so every chat can read it. Last updated:
> **2026-07-18** by the **Design chat**.

## Division of labor

- **Design chat (this doc's maintainer):** UI/UX, palette, typography,
  illustrations, carousel, Gabby's Corner presentation, data curation
  (spots/hours/images), deploys.
- **Auth/Backend chat:** phone OTP auth (Supabase Auth), user accounts, SMS
  recs, submissions/moderation flows. Owns `auth.*` config and any new tables
  it creates — document them here when added.
- Rule: whoever changes schema, env, or deploy config updates this file and
  re-uploads it to project knowledge.

## Live URLs & infrastructure

| Thing | Value |
|---|---|
| Production | https://buzzrecs.vercel.app |
| Gabby's Corner | https://buzzrecs.vercel.app/gabbys-corner |
| Vercel project | `buzzrecs` (prj_Fpbb1V42Gzmy8yMr1slPoKgp181h), team "Berke Bearrick's projects" (team_Qiigir6aOMDpDDSFvjTVvllj), framework `nextjs` |
| Supabase project | `PSS-Berke's Project`, org "Buzz Recs", ref `guxbbnyladadmraisqag`, free plan |
| Supabase URL | https://guxbbnyladadmraisqag.supabase.co |
| Publishable (anon) key | `sb_publishable_RQ15slds3Pm55oFveFwG6Q_p1p_kMHi` (public by design; RLS protects data) |
| Secret key | NOT stored here. In Supabase dashboard → Settings → API Keys |

### Deploy process — GIT-BASED as of 2026-07-18

- **Repo: https://github.com/PSS-Berke/buzzrecs (private, branch `main`)** —
  connected to the Vercel project. Push to `main` = production deploy. This is
  now THE shared source of truth across chats; both chats clone/push here.
  Auth via GitHub CLI device flow (Berke approves at github.com/login/device).
- Legacy fallback: Vercel MCP `deploy_to_vercel` with inline file tree,
  `target: production`, name `buzzrecs`,
  `projectSettings.framework = "nextjs"` (required — project won't
  auto-detect). Avoid mixing this with git deploys.
- The Vercel connector token **cannot create projects** (403); deploy into the
  existing `buzzrecs` project only.
- Env vars ship via a `.env.production` file in the deploy tree (NEXT_PUBLIC_*
  only — never put secrets there).
- **Gotcha:** Vercel's Next.js Data Cache persists Supabase fetches across
  deployments. `lib/supabase.js` wraps fetch with `cache: "no-store"` — do not
  remove, or the site serves stale data.
- Supabase SQL changes are run through the dashboard SQL editor driven in the
  "PS - EDITH" Chrome browser (set monaco content via JS, click Run, accept the
  linter dialog with "Run without RLS" — RLS is already enabled on all tables).

## Database schema (public)

- `cities` — id, name, slug. Only `chicago` so far.
- `places` — id, city_id, name, slug (unique), neighborhood, address,
  website_url, menu_url, reservation_url, description, image_url, is_core,
  status ('approved' default; site only shows approved), timestamps.
- `happy_hours` — id, place_id, days (text: 'Mon-Fri' / 'Daily' / 'Thu'),
  start_time, end_time (time), deals, source_url, verified_at.
- `gabbys_reviews` — id, place_id (nullable FK), whiskey_name, rating
  numeric(3,1) 0–10, notes, video_url, posted_at.
- RLS: public SELECT on all four (places filtered to approved). No anon
  writes. Writes happen via SQL editor (or service key server-side later).
- Current data: 17 places across River North (6), West Loop (3), Old Town (3),
  Gold Coast (2), Lincoln Park (2), The Loop (1). 7 have image_url (used by
  carousel). Only these 6 neighborhoods are in scope — enforced in
  `HOOD_ORDER` in `app/directory.jsx`.
- `gabbys_reviews` is empty. Video plan: Supabase Storage bucket (not yet
  created) → public URL → `video_url`.

## App structure (Next.js 14, App Router, JS)

```
app/
  layout.js          fonts (next/font) + metadata
  globals.css        entire design system (no Tailwind)
  page.js            home: topbar, hero, carousel, directory
  directory.jsx      client: filters, numbered cards, ON NOW logic
  carousel.jsx       client: crossfade hero carousel (4.2s)
  whiskey-glass.jsx  SVG crystal glass + orbiting twist animation
  gabbys-corner/page.js
lib/
  supabase.js        client (no-store fetch) + queries
  isHappyHourNow.js  Chicago-timezone day/time parsing ('Mon-Fri', 'Daily', 'Thu')
supabase/
  schema.sql, seed.sql   (historical — DB has since evolved; DB is truth)
```

## Design system — "Painted tavern chic"

Evolution: dark editorial → Tombolo painted → current **Ralph Lauren / Gus'
Sip & Dip tavern chic** (Polo Bar club green + brass + honey leather; Gus'
numbered-menu tavern elegance).

### Fonts (next/font/google, CSS variables)

- `--font-display`: **Shrikhand** — headlines, wordmark, place names, ratings
- `--font-script`: **Kaushan Script** — kickers, captions, Gabby accents
- `--font-body`: **Karla** — everything else
- **Gotcha:** never define `--font-display/script/body` in `globals.css`
  `:root` — it overrides next/font's class variables and silently falls back.

### Palette (CSS vars in :root)

| Token | Hex | Use |
|---|---|---|
| `--cream` | #f6efe0 | page background |
| `--paper` | #fcf7ea | cards |
| `--maroon` | #7d3444 | primary (lightened per Berke) |
| `--maroon-deep` | #5e2634 | strokes/dark accents |
| `--club` | #3f5a49 | Polo-Bar green: badges, Gabby pill, live filter |
| `--club-light` | #6b8371 | script accents |
| `--brass` | #b08a3e | rules, numbers, rims, link underlines |
| `--brass-light` | #d4af6a | highlights, active dots |
| `--rose` | #d98e7e | legacy accent, sparing |

### Signature details

- Wobbly hand-drawn pill radii: `--wobble` / `--wobble-2`
- Cards: 2px maroon border, uneven radii, brass offset shadow, alternate
  rotation on hover; **gold "No. n" numbering** sequential across sections
  (Gus' menu homage) — computed in `directory.jsx`
- Thin brass hairlines instead of heavy dividers; double brass rule under topbar
- Carousel: maroon frame + brass outline offset, club-green offset shadow,
  script captions
- ON NOW badge: club green, brass pulsing dot; computed vs America/Chicago
- Whiskey glass (Gabby's): faceted crystal rocks glass, brass rim, ice sphere
  (`.ice-bob`), brass ring + laurel crest behind, orange twist orbiting
  (`.orbit` 7s + `.garnish` counterspin)

### Images

- Venue photos are **hotlinked** from venues' own sites/CDNs (og:image or
  scraped `<img>` URLs) stored in `places.image_url`. Fine for now; replace
  with owned/licensed images if the project grows. When adding a spot, try to
  find a landscape photo ≥1200px wide.

## Data conventions

- `days` strings the parser understands: `Daily`, ranges (`Mon-Fri`,
  `Tue-Sat`, `Sun-Thu`), single days (`Thu`), comma lists (`Mon, Wed`).
- Multiple happy_hours rows per place are supported (e.g., Maple & Ash Tower
  Hour + late night; The VIG has 3 rows).
- New spots must use one of the 6 neighborhoods, spelled exactly:
  `River North`, `West Loop`, `Gold Coast`, `Old Town`, `Lincoln Park`,
  `The Loop`.

## Phone OTP auth & community tables (Auth chat — merged addendum 2026-07-18)

- SMS provider: **Twilio Verify** — Twilio-managed numbers, no purchased
  number/10DLC, ~$0.05/verification. Account upgraded (not trial).
- Twilio Account SID: `ACcd8446d21cde0925eb4147f54f44ec76`; Verify Service SID:
  `VAda14361ed3ddcd28f63f995b6cc6761a` (friendly name "BuzzRecs", SMS channel,
  Fraud Guard ON).
- Supabase → Auth → Phone: ENABLED (Twilio Verify), OTP 6 digits / 60s. Twilio
  Auth Token entered by Berke in dashboard only — never in docs or
  .env.production.
- Client flow: `supabase.auth.signInWithOtp({ phone })` →
  `supabase.auth.verifyOtp({ phone, token, type: 'sms' })`.
- **public.profiles** (auth chat owns): id → auth.users, display_name,
  is_admin bool default false. Auto-created on signup via
  `on_auth_user_created` trigger.
- **public.user_reviews** (auth chat owns): community reviews, rating 1–5
  scale (Gabby's stays 0–10), status live|hidden|pending, RLS: public read
  live; authenticated CRUD own rows. Verified: anon read 200, anon write 401.
- Auth chat still to build: community login + "pour one in" community form +
  feed on /gabbys-corner; 5 reviews/user/day rate limit.

## Gabby's Corner workflow

**Self-serve (live):** https://buzzrecs.vercel.app/gabbys-corner/upload
("Pour one in" button on Gabby's Corner). Phone OTP login → admin check →
form: restaurant (dropdown of places + "somewhere else" free text), video
file, score 0–10 slider. Uploads to Storage bucket `gabby-videos` (public
read), inserts `gabbys_reviews` row. Live immediately (force-dynamic).

- Gated by `profiles.is_admin` — RLS policies "admin insert gabbys"
  (gabbys_reviews INSERT) and "admin upload gabby videos" (storage.objects
  INSERT, bucket-scoped). **Setup step: after Gabby/Berke first log in, flip
  `profiles.is_admin = true` for them via SQL editor.**
- Schema tweaks (design chat, 2026-07-18): `gabbys_reviews.whiskey_name` now
  nullable; added `gabbys_reviews.bar_text` (free-text venue when not a known
  place). Review cards title = places.name ?? bar_text ?? whiskey_name.

**Fallback:** Berke can still drop a video + details in the design chat and
it gets uploaded manually.

## Brand assets

- In-app (repo `public/`): `logo-wordmark.png` (Buzz's Recs wordmark chip —
  topbar on all pages), `logo-gabbys.png` (Gabby's Corner crest — hero on
  /gabbys-corner with orbiting twist), `logo-buzzrecs.png` (circle mark,
  spare). All quantized/optimized from Berke's originals.
- Originals + full-res circle crops live in the Buzz Recs folder root.

## Roadmap / open items

- [x] Phone OTP auth — SHIPPED by auth chat (Twilio Verify)
- [x] Storage bucket + Gabby upload page — SHIPPED by design chat
- [ ] Flip is_admin for Gabby + Berke after their first phone login
- [ ] Gabby's first review
- [ ] Community review form/feed on /gabbys-corner (auth chat)
- [ ] Wire circle logo marks into site UI
- [ ] Scheduled task (Cowork) to re-verify core spots' hours weekly
- [x] GitHub repo + git-based deploys — github.com/PSS-Berke/buzzrecs
- [ ] User-submitted places (status='pending' + moderation)
- [ ] More cities
- [ ] Vercel team transfer to Parallel Strategies when Berke's role allows

## Changelog

- **2026-07-18 (later)** — Auth chat: Twilio Verify + Supabase phone auth
  enabled; `profiles` + `user_reviews` + RLS + signup trigger. Design chat:
  v0.5 — merged addendum; circle logo crops; `gabby-videos` bucket + admin
  RLS; `/gabbys-corner/upload` (phone login → restaurant/video/score form);
  `bar_text` column, whiskey_name nullable.
- **2026-07-18** — v0.1 MVP shipped (dark editorial); v0.2 light editorial +
  6-neighborhood scope + data-cache bugfix; v0.3 Tombolo painted look, hero
  carousel, Gabby's Corner + schema; v0.4 RL/Gus' restyle (lighter maroon,
  club green + brass, numbered cards, crystal glass), added Gus' Sip & Dip
  (No. 27 NA 50 Best Bars) as a spot. Domain buzzrecs.vercel.app claimed.

## Auth chat update — 2026-07-18

- **Phone OTP live**: Supabase Auth phone provider = Twilio Verify. Verify Service "BuzzRecs" SID `VAda14361ed3ddcd28f63f995b6cc6761a`, Account SID `ACcd8446d21cde0925eb4147f54f44ec76`. Auth Token entered by Berke in dashboard only — never in repo/docs. Account is upgraded; any US number receives codes (~$0.05/verification).
- **New tables** (auth chat owns): `profiles` (id→auth.users, display_name, is_admin, auto-created via on_auth_user_created trigger) and `user_reviews` (community pours: whiskey_name, place_id→places nullable, bar_text, rating numeric 1–5, body, photo_url, status live/hidden/pending, FK user_id→profiles for PostgREST embeds). RLS: public reads live rows; users write own; RESTRICTIVE policy caps 5 reviews/user/24h. Verified: anon read 200, anon write 401.
- **New code**: `/gabbys-corner/review` (community OTP login + 1–5 review form), community feed section on `/gabbys-corner`, `getUserReviews()` in lib/supabase.js. Gabby's 0–10 video flow untouched.
- Community scale is 1–5 on purpose (Gabby's 0–10 stays distinct).

### Wizard post — 2026-07-18 (auth chat)

- `/gabbys-corner/review` is now a 4-step wizard: media → verdict → spot → post. `/gabbys-corner/upload` redirects there. Admins (profiles.is_admin) get required video (gabby-videos bucket) + 0–10 scale and post to gabbys_reviews; everyone else gets 1–5 and posts to user_reviews.
- Restaurant picker is typeahead search over approved places with free-text fallback → bar_text.
- New columns on BOTH review tables: menu_photo_url, rating_vibe, rating_menu (nullable; scale checks match each table). New public storage bucket `review-media` (menu pics, authenticated upload).
- Feed cards on /gabbys-corner render menu pics + optional vibe/menu scores.
