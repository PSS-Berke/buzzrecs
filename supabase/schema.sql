-- BuzzRecs schema v1
create table if not exists cities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz default now()
);

create table if not exists places (
  id uuid primary key default gen_random_uuid(),
  city_id uuid references cities(id) on delete cascade,
  name text not null,
  slug text not null unique,
  neighborhood text,
  address text,
  website_url text,
  menu_url text,
  reservation_url text,
  description text,
  is_core boolean default false,        -- core spots tracked by scheduled refresh
  status text default 'approved',       -- approved | pending (for future user submissions)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists happy_hours (
  id uuid primary key default gen_random_uuid(),
  place_id uuid references places(id) on delete cascade,
  days text not null,                   -- e.g. 'Mon-Fri'
  start_time time,
  end_time time,
  deals text,                           -- freeform description of specials
  source_url text,
  verified_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Public read access (anon key); writes only via service role
alter table cities enable row level security;
alter table places enable row level security;
alter table happy_hours enable row level security;

create policy "public read cities" on cities for select using (true);
create policy "public read approved places" on places for select using (status = 'approved');
create policy "public read happy_hours" on happy_hours for select using (true);
