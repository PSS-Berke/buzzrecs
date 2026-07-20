-- BuzzRecs — Date Night category (Chicago's "recognized" restaurants:
-- Michelin stars + Bib Gourmand + World's 50 Best + NYT Best). Sibling to
-- happy_hours / patios. Run via the dashboard SQL editor.
--
-- Date-night spots attach to the SAME `places` table (many are brand-new
-- venues, inserted alongside their date_nights row in the seed).

create table if not exists date_nights (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references places(id) on delete cascade,

  -- ---- Accolades (the reason it's a date-night spot) ----
  michelin_stars smallint default 0,     -- 0-3
  bib_gourmand boolean default false,
  fifty_best text,                        -- e.g. "World's 50 Best Restaurants #17"
  nyt boolean default false,              -- on the current NYT Best Chicago list

  -- ---- What to expect ----
  cuisine text,
  price text,                             -- '$'..'$$$$'
  reservation_platform text,              -- Resy | Tock | OpenTable | SevenRooms | Direct | Walk-in
  reservation_lead text,                  -- optional note, e.g. "books 30 days out"
  vibe text,                              -- one-line editorial blurb

  source_url text,
  verified_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  constraint date_nights_place_unique unique (place_id),
  constraint date_nights_stars_ck check (michelin_stars between 0 and 3)
);

create index if not exists date_nights_place_id_idx on date_nights (place_id);

alter table date_nights enable row level security;
drop policy if exists "public read date_nights" on date_nights;
create policy "public read date_nights" on date_nights for select using (true);

-- convenience flag on places (mirrors has_patio)
alter table places add column if not exists is_date_night boolean default false;
