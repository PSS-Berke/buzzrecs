-- BuzzRecs — Patios STARTER SEED (patio specialist's opening lineup)
-- Run AFTER 2026-07-19-patios.sql, via the dashboard SQL editor.
--
-- ⚠️ VERIFY BEFORE TRUSTING. Per BUZZRECS_HANDBOOK.md data discipline, every
-- row here is a curated starting point built from well-known Chicago patios
-- that map to places already in the DB (so coords.js / logos.js /
-- reservationInfo.js already cover them). patio_type / view / vibe are the
-- confident bits. season is the Chicago default (Apr–Oct); hours are left NULL
-- so "in season" drives Open Now until someone verifies real patio hours.
-- verified_at is NULL on purpose = "not yet cross-checked against the venue."
-- Fix any detail, then set verified_at = now().
--
-- Each insert selects the place by slug and no-ops if the slug isn't present
-- or a patio already exists, so this is safe to re-run.

insert into patios
  (place_id, patio_type, covered, heated, dog_friendly, view, shade,
   fire_pit, live_music, seats, reservable, season_start, season_end,
   best_time, vibe, features)
select id, v.patio_type, v.covered, v.heated, v.dog_friendly, v.view, v.shade,
       v.fire_pit, v.live_music, v.seats, v.reservable, v.season_start,
       v.season_end, v.best_time, v.vibe, v.features
from places
join (values
  -- slug, type, covered, heated, dog, view, shade, firepit, music, seats, reservable, seasonStart, seasonEnd, bestTime, vibe, features
  ('cindys',
    'Rooftop', 'Partial', true, false, 'Skyline', 'Umbrellas', false, false,
    120, true, 4, 10, 'Sunset',
    'The rooftop terrace atop the Chicago Athletic Association — Millennium Park and the lake laid out in front of you.',
    array['Skyline view','String lights','Greenhouse bar']),

  ('aba',
    'Rooftop', 'Retractable roof', true, true, 'Street', 'Pergola', false, false,
    150, true, 4, 10, 'Evening',
    'Leafy River North rooftop — olive trees, string lights, and Mediterranean plates you eat with your hands.',
    array['Greenery','String lights','Retractable roof']),

  ('benchmark',
    'Rooftop', 'Retractable roof', true, true, 'Street', 'Full sun', false, true,
    100, false, 4, 10, 'Afternoon',
    'Old Town sports-bar rooftop with a roof that peels back the second the sun comes out.',
    array['Retractable roof','TVs','Game day']),

  ('the-vig',
    'Sidewalk', 'Open-air', false, true, 'Street', 'Umbrellas', false, false,
    40, false, 4, 10, 'Evening',
    'Easygoing Old Town sidewalk tables — a neighborhood pour with the door open to the street.',
    array['People-watching']),

  ('tavern-on-rush',
    'Sidewalk', 'Open-air', true, true, 'Street', 'Umbrellas', false, false,
    60, true, 4, 10, 'Evening',
    'The Gold Coast see-and-be-seen corner — Rush & Bellevue people-watching with a steak and a martini.',
    array['People-watching','Prime corner']),

  ('hugos-frog-bar',
    'Sidewalk', 'Open-air', false, true, 'Street', 'Awning', false, false,
    35, false, 4, 10, 'Evening',
    'Gold Coast sidewalk seating next to Gibsons — oysters and a cold one while the Rush Street parade goes by.',
    array['People-watching']),

  ('beatrix',
    'Sidewalk', 'Open-air', false, true, 'Street', 'Umbrellas', false, false,
    45, true, 4, 10, 'Afternoon',
    'Bright, plant-forward River North patio — good coffee, good wine, and a menu that covers every mood.',
    array['Greenery','Brunch'])
) as v(slug, patio_type, covered, heated, dog_friendly, view, shade,
       fire_pit, live_music, seats, reservable, season_start, season_end,
       best_time, vibe, features)
  on places.slug = v.slug
on conflict (place_id) do nothing;

-- Mark seeded places so scheduled tasks can find the patio beat.
update places set has_patio = true
where id in (select place_id from patios);
