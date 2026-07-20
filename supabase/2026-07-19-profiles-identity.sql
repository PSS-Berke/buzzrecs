-- Phase 1: site-wide identity — run in Supabase SQL editor.
-- Adds public identity fields to profiles. Phone numbers stay in auth.users
-- and are never exposed through profiles.

alter table public.profiles
  add column if not exists handle text,
  add column if not exists avatar_url text,
  add column if not exists bio text;

-- lowercase letters / digits / underscore, 3-20 chars
alter table public.profiles
  drop constraint if exists profiles_handle_format;
alter table public.profiles
  add constraint profiles_handle_format
  check (handle is null or handle ~ '^[a-z0-9_]{3,20}$');

create unique index if not exists profiles_handle_key
  on public.profiles (lower(handle));

-- Sanity: profiles should already be publicly readable (feed embeds) and
-- user-updatable-own. If not, uncomment:
-- create policy "public read profiles" on public.profiles for select using (true);
-- create policy "own update profiles" on public.profiles for update
--   using (auth.uid() = id) with check (auth.uid() = id);
