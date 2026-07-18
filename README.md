# BuzzRecs

Chicago happy hours: times, deals, menus, reservations. Next.js + Supabase.

## Setup

1. Create a free Supabase project.
2. In the Supabase SQL editor, run `supabase/schema.sql`, then `supabase/seed.sql`.
3. Set env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. `npm install && npm run dev`

## Roadmap

- Phase 2: scheduled freshness checks of core spots
- Phase 3: phone OTP auth (Supabase)
- Phase 4: user-submitted places, more cities, SMS recs
