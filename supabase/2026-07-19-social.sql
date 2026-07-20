-- Phase 3: cheers + comments — run in Supabase SQL editor.
-- Polymorphic over the two review tables: review_kind 'gabby' -> gabbys_reviews,
-- 'community' -> user_reviews. No FK to the review row (two tables), so both
-- review tables keep their ids stable; app joins by (kind, id).

create table if not exists public.cheers (
  user_id uuid not null references public.profiles(id) on delete cascade,
  review_kind text not null check (review_kind in ('gabby','community')),
  review_id uuid not null,
  created_at timestamptz default now(),
  primary key (user_id, review_kind, review_id)
);
create index if not exists cheers_review_idx
  on public.cheers (review_kind, review_id);

alter table public.cheers enable row level security;
drop policy if exists "public read cheers" on public.cheers;
create policy "public read cheers" on public.cheers
  for select using (true);
drop policy if exists "own insert cheers" on public.cheers;
create policy "own insert cheers" on public.cheers
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "own delete cheers" on public.cheers;
create policy "own delete cheers" on public.cheers
  for delete to authenticated using (auth.uid() = user_id);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  review_kind text not null check (review_kind in ('gabby','community')),
  review_id uuid not null,
  body text not null check (char_length(body) between 1 and 500),
  status text not null default 'live' check (status in ('live','hidden')),
  created_at timestamptz default now()
);
create index if not exists comments_review_idx
  on public.comments (review_kind, review_id, created_at);

alter table public.comments enable row level security;
drop policy if exists "public read live comments" on public.comments;
create policy "public read live comments" on public.comments
  for select using (status = 'live');
drop policy if exists "own insert comments" on public.comments;
create policy "own insert comments" on public.comments
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "own delete comments" on public.comments;
create policy "own delete comments" on public.comments
  for delete to authenticated using (auth.uid() = user_id);
-- same RESTRICTIVE rate-cap pattern as user_reviews' 5/day
drop policy if exists "comment rate cap" on public.comments;
create policy "comment rate cap" on public.comments
  as restrictive for insert to authenticated
  with check (
    (select count(*) from public.comments c
      where c.user_id = auth.uid()
        and c.created_at > now() - interval '24 hours') < 30
  );
