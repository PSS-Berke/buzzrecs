-- BuzzRecs seed: Chicago core spots (verified July 2026 via littlechicagoguide.com + lettuce.com)
insert into cities (name, slug) values ('Chicago', 'chicago')
on conflict (slug) do nothing;

with c as (select id from cities where slug = 'chicago')
insert into places (city_id, name, slug, neighborhood, address, website_url, menu_url, reservation_url, description, is_core)
select c.id, p.* from c, (values
  ('The Publican', 'the-publican', 'West Loop / Fulton Market', '837 W Fulton Market, Chicago, IL 60607', 'https://www.thepublicanrestaurant.com', 'https://www.thepublicanrestaurant.com/menus/', 'https://www.thepublicanrestaurant.com/reservations/', 'Beer-hall vibes, farm-driven menu. Happy hour oyster and wine deals are among the best food deals in the city.', true),
  ('Aba', 'aba', 'West Loop / Fulton Market', '302 N Green St, 3rd Floor, Chicago, IL 60607', 'https://www.abarestaurants.com/chicago/', 'https://www.abarestaurants.com/chicago/menus/', 'https://www.abarestaurants.com/chicago/reservations/', 'Rooftop Mediterranean spot. Date flatbread + curated wine deals. Book ahead — fills up fast.', true),
  ('Beatrix', 'beatrix', 'West Loop / Fulton Market', '834 W Fulton Market, Chicago, IL 60607', 'https://www.beatrixrestaurants.com', 'https://www.beatrixrestaurants.com/menus/', 'https://www.beatrixrestaurants.com/reservations/', 'Healthy-ish neighborhood favorite. Drink deals plus apps like hummus, crispy kale salad, kung pao cauliflower.', true),
  ('Gilt Bar', 'gilt-bar', 'River North', '230 W Kinzie St, Chicago, IL 60654', 'https://www.giltbarchicago.com', 'https://www.giltbarchicago.com/menus', 'https://www.giltbarchicago.com', 'MICHELIN Bib Gourmand from Hogsalt. Moody room, craft cocktails, legendary fried chicken. HH daily from open.', true),
  ('RPM Italian', 'rpm-italian', 'River North', '66 W Kinzie St, Chicago, IL 60654', 'https://rpmrestaurants.com/rpm-italian-chicago/', 'https://rpmrestaurants.com/rpm-italian-chicago/menus/', 'https://rpmrestaurants.com/rpm-italian-chicago/reservations/', 'Glam Italian at the bar: $10 cocktails and wines, $5 beers during happy hour.', true),
  ('Hub 51', 'hub-51', 'River North', '51 W Hubbard St, Chicago, IL 60654', 'https://www.hub51chicago.com', 'https://www.hub51chicago.com/menus/', 'https://www.hub51chicago.com/reservations/', 'Big energetic room, great for groups. Bang Bang Crispy Cauliflower + draft specials.', true),
  ('Tortoise Supper Club', 'tortoise-supper-club', 'River North', '350 N State St, Chicago, IL 60654', 'https://www.tortoisesupperclub.com', 'https://www.tortoisesupperclub.com/menus/', 'https://www.tortoisesupperclub.com/reservations/', 'Jazz-era supper club steps from the Riverwalk. Live jazz Fri-Sat, prime rib and classic cocktails.', true),
  ('Maple & Ash', 'maple-and-ash', 'Gold Coast', '8 W Maple St, Chicago, IL 60610', 'https://mapleandash.com/chicago/', 'https://mapleandash.com/chicago/menus/', 'https://mapleandash.com/chicago/reservations/', 'Tower Hour: $35 fire-roasted seafood towers and $12 martinis. Late-night HH 9-11 pm in Eight Bar.', true),
  ('Hugo''s Frog Bar', 'hugos-frog-bar', 'Gold Coast', '1024 N Rush St, Chicago, IL 60611', 'https://www.hugosfrogbar.com', 'https://www.hugosfrogbar.com/menus/', 'https://www.hugosfrogbar.com/reservations/', 'Upscale seafood + steak on Rush Street. Oysters and cocktail deals, Sun-Thu happy hour.', true),
  ('Cindy''s', 'cindys', 'The Loop', '12 S Michigan Ave, Chicago, IL 60603', 'https://www.cindysrooftop.com', 'https://www.cindysrooftop.com/menus/', 'https://www.cindysrooftop.com/reservations/', 'Rooftop at the Chicago Athletic Association with Millennium Park + lake views. Best-view happy hour in town.', true),
  ('Shaw''s Crab House', 'shaws-crab-house', 'River North', '21 E Hubbard St, Chicago, IL 60611', 'https://www.shawscrabhouse.com', 'https://www.shawscrabhouse.com/menus/', 'https://www.shawscrabhouse.com/reservations/', 'Half-priced oysters on the half shell plus $5-10 beers, wines, and cocktails in the Oyster Bar.', true),
  ('The Promontory', 'the-promontory', 'Hyde Park', '5311 S Lake Park Ave W, Chicago, IL 60615', 'https://www.promontorychicago.com', 'https://www.promontorychicago.com/menu/', 'https://www.promontorychicago.com', 'Hyde Park cultural hub: live music, strong wine list, chef specials like pork belly and tuna tartare.', true)
) as p(name, slug, neighborhood, address, website_url, menu_url, reservation_url, description, is_core)
on conflict (slug) do nothing;

insert into happy_hours (place_id, days, start_time, end_time, deals, source_url)
select p.id, h.days, h.start_time::time, h.end_time::time, h.deals, h.source_url
from places p
join (values
  ('the-publican', 'Mon-Fri', '16:00', '18:00', 'Deals on oysters and bottles of wine', 'https://littlechicagoguide.com/happy-hours-in-chicago/'),
  ('aba', 'Sun-Thu', '16:00', '18:00', 'Curated wine glasses + select beers; flatbread favorites', 'https://littlechicagoguide.com/happy-hours-in-chicago/'),
  ('beatrix', 'Tue-Thu', '15:00', '18:00', 'Drink deals + select appetizers', 'https://littlechicagoguide.com/happy-hours-in-chicago/'),
  ('gilt-bar', 'Daily', '16:00', '17:00', 'Craft cocktail + wine specials from open to 5 pm', 'https://littlechicagoguide.com/happy-hours-in-chicago/'),
  ('rpm-italian', 'Mon-Fri', '16:00', '18:00', '$10 select cocktails and wines, $5 select beers', 'https://www.lettuce.com/blog/happy-hour-deals-near-you/'),
  ('hub-51', 'Mon-Fri', '16:00', '18:00', 'Drink specials + selected drafts, Bang Bang Crispy Cauliflower', 'https://littlechicagoguide.com/happy-hours-in-chicago/'),
  ('tortoise-supper-club', 'Tue-Sat', '16:30', '18:00', 'Rotating cocktail + bar bite specials (check site)', 'https://littlechicagoguide.com/happy-hours-in-chicago/'),
  ('maple-and-ash', 'Sun-Thu', '17:00', '18:00', 'Tower Hour: $35 seafood towers, $12 martinis', 'https://littlechicagoguide.com/happy-hours-in-chicago/'),
  ('maple-and-ash', 'Daily', '21:00', '23:00', 'Late night: $15 cocktails + select wines in Eight Bar', 'https://littlechicagoguide.com/happy-hours-in-chicago/'),
  ('hugos-frog-bar', 'Sun-Thu', '15:00', '18:00', 'Oyster + drink specials at the bar', 'https://littlechicagoguide.com/happy-hours-in-chicago/'),
  ('cindys', 'Mon-Wed', '16:00', '18:00', 'Signature cocktails + local bites with rooftop views', 'https://littlechicagoguide.com/happy-hours-in-chicago/'),
  ('shaws-crab-house', 'Mon-Fri', '15:00', '17:00', 'Half-priced select oysters, $5-10 beers/wines/cocktails', 'https://www.lettuce.com/blog/happy-hour-deals-near-you/'),
  ('the-promontory', 'Mon-Fri', '16:00', '19:00', 'Wine list + chef specials: pork belly, spicy tuna tartare', 'https://littlechicagoguide.com/happy-hours-in-chicago/')
) as h(slug, days, start_time, end_time, deals, source_url)
on p.slug = h.slug;
