-- BuzzRecs — Patios category (new collection, sibling to happy_hours)
-- Run via the Supabase dashboard SQL editor (same flow as every other schema
-- change — see BUZZRECS_HANDBOOK.md "Deploy process"). RLS is enabled on all
-- tables; accept the linter dialog with "Run without RLS".
--
-- Design note: patios attach to the SAME `places` rows as happy_hours, so a
-- venue that has both a happy hour AND a notable patio is ONE place with a
-- happy_hours row and a patios row. This reuses coords.js, logos.js and
-- reservationInfo.js (all keyed by slug/name) for free.

create table if not exists patios (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references places(id) on delete cascade,

  -- ---- What kind of patio (the headline attribute) ----
  patio_type text not null,             -- 'Rooftop' | 'Sidewalk' | 'Garden' |
                                        -- 'Courtyard' | 'Terrace' | 'Riverwalk' |
                                        -- 'Street-side' | 'Beer garden'
  covered text default 'Open-air',      -- 'Open-air' | 'Covered' |
                                        -- 'Retractable roof' | 'Partial'

  -- ---- Comfort / season-extension ----
  heated boolean default false,         -- heaters (extends the season)
  fire_pit boolean default false,
  misters boolean default false,        -- summer cooling
  shade text,                           -- 'Umbrellas' | 'Awning' | 'Pergola' |
                                        -- 'Tree cover' | 'Full sun'

  -- ---- Who / what it's good for ----
  dog_friendly boolean default false,
  view text,                            -- 'Skyline' | 'River' | 'Lake' |
                                        -- 'Street' | 'Garden' | 'Park' | null
  tvs boolean default false,
  live_music boolean default false,
  seats int,                            -- approx patio capacity
  reservable boolean default false,     -- can you book the patio specifically?

  -- ---- Seasonality (Chicago patios are seasonal) ----
  season_start smallint default 4,      -- month 1-12 the patio opens (Apr)
  season_end   smallint default 10,     -- month 1-12 the patio closes (Oct)
  -- Daily patio hours (optional). If null, "in season" alone drives Open Now.
  days text default 'Daily',            -- same grammar as happy_hours.days
  open_time  time,
  close_time time,

  -- ---- Editorial ----
  best_time text,                       -- 'Sunset' | 'Afternoon' | 'Evening'
  vibe text,                            -- one-line descriptor in site voice
  features text[] default '{}',         -- extra tags: 'String lights',
                                        -- 'Cabanas', 'Bocce', 'Ivy walls'...

  source_url text,
  verified_at timestamptz,              -- NULL = not yet verified (see handbook)
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  constraint patios_place_unique unique (place_id),      -- one patio per place
  constraint patios_type_ck check (patio_type is not null and patio_type <> ''),
  constraint patios_season_ck check (season_start between 1 and 12
                                     and season_end between 1 and 12)
);

create index if not exists patios_place_id_idx on patios (place_id);

-- Public read (anon key); writes only via SQL editor / service role, exactly
-- like happy_hours.
alter table patios enable row level security;

drop policy if exists "public read patios" on patios;
create policy "public read patios" on patios for select using (true);

-- Optional convenience flag on places, mirroring is_core, so scheduled tasks
-- can target the patios beat specifically. Safe to skip.
alter table places add column if not exists has_patio boolean default false;
