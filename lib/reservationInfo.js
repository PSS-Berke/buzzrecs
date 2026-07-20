// Verified reservation info (July 19, 2026) — overrides stale DB values at render.
// Once the DB migration (reservation-update.sql) runs, DB fields can take over.
// closed: true hides the card entirely.

export const RESERVATION_INFO = {
  "gilt-bar": {
    platform: "Resy",
    url: "https://resy.com/cities/chicago-il/venues/gilt-bar",
    blurb:
      "Books on Resy. Dates open 21 days out and drop daily at 9 AM, with a $2.50/person fee for online bookings (walk-ins are free).",
    tips: ["Online parties max out at 8", "Full menu at the bar — walk-ins welcome"],
    phone: "(312) 464-9544",
  },
  "hub-51": { closed: true },
  "old-town-pour-house": { closed: true },
  "rpm-italian": {
    platform: "OpenTable",
    url: "https://www.opentable.com/rpm-italian",
    address: "52 W Illinois St, Chicago, IL 60654",
    blurb:
      "Books on OpenTable — pick your seating type (dining room, Bar Hightop, Amaro Bar). Prime weekend slots go fast.",
    tips: [
      "Online up to 20; bigger groups call (312) 955-1413",
      "Bar is walk-in friendly for happy hour (Mon–Fri 4–6 PM)",
    ],
    phone: "(312) 222-1888",
  },
  "shaws-crab-house": {
    platform: "OpenTable",
    url: "https://www.opentable.com/r/shaws-crab-house-and-oyster-bar-chicago-chicago",
    blurb:
      "Books on OpenTable. Seating type matters: “Standard” is the main dining room, “Hightop” is the casual Oyster Bar.",
    tips: ["Online up to 20 guests", "Oyster Bar tables are mostly first-come, first-served"],
    phone: "(312) 527-2722",
  },
  "tortoise-supper-club": {
    platform: "Tock",
    url: "https://www.exploretock.com/tortoisesupperclub",
    blurb:
      "Books on Tock. No deposit for parties up to 8; 9+ and holidays carry a per-person deposit ($15–50).",
    tips: ["Standard bookings take 1–48 guests", "Live jazz in the lounge Fri–Sat — good walk-in target"],
    phone: "(312) 755-1700",
  },
  "gus-sip-and-dip": {
    platform: "Walk-in only",
    url: null,
    blurb: "No reservations — first-come, first-served. Just show up.",
    tips: ["21+ only", "Happy hour Mon–Fri 4–5 PM with a $6 rotating cocktail"],
    phone: "(312) 736-0163 (text)",
  },
  aba: {
    platform: "OpenTable",
    url: "https://www.opentable.com/r/aba-chicago",
    blurb:
      "Books on OpenTable — choose Indoor Table, Rooftop Patio Table, or Rooftop Patio Lounge. Dates open ~30 days out; summer rooftop slots can sell out same day.",
    tips: ["Online up to 20; bigger groups (773) 645-1430", "Walk-ins taken when there’s room"],
    phone: "(773) 645-1400",
  },
  beatrix: {
    platform: "OpenTable",
    url: "https://www.opentable.com/r/beatrix-fulton-market-chicago",
    blurb:
      "Books on OpenTable — no deposit, instant confirmation. Reserve ahead for weekend brunch and peak dinner.",
    tips: ["Online up to 20 guests", "Coffee/bakery counter is walk-up"],
    phone: "(312) 733-0370",
  },
  "the-publican": {
    platform: "OpenTable",
    url: "https://www.opentable.com/r/the-publican-chicago",
    blurb:
      "Books on OpenTable — instant confirmation, no deposit for standard tables. Special feasts book by phone.",
    tips: ["Patio is strictly first-come, first-served", "Occasionally closes for buyouts — check before you go"],
    phone: "(312) 733-9555",
  },
  "hugos-frog-bar": {
    platform: "OpenTable",
    url: "https://www.opentable.com/r/hugos-frog-bar-and-fish-house-chicago",
    blurb: "Books free on OpenTable — no card required for standard tables. Book ahead for weekends.",
    tips: [
      "Online up to 20 guests",
      "Happy hour (Sun–Thu 3–6 PM, half-price oysters + wine bottles) is bar-only, walk-in",
    ],
    phone: "(312) 640-0999",
  },
  "maple-and-ash": {
    platform: "SevenRooms",
    url: "https://www.sevenrooms.com/explore/mapleandashchicagodiningroom/reservations/create/search/?venues=mapleandashchicagodiningroom%2Ceightbarchicago",
    blurb:
      "Books on SevenRooms — one search covers the dining room and downstairs Eight Bar. A card holds every booking; cancel 24+ hours ahead or it’s $50/person.",
    tips: [
      "Instant booking up to 8; 9+ is request-only",
      "Dress code: business casual or better",
      "Eight Bar and patio take walk-ins and serve the sushi menu",
    ],
    phone: "(312) 944-8888 (call or text)",
  },
  benchmark: {
    platform: "OpenTable",
    url: "https://www.opentable.com/r/benchmark-chicago",
    blurb:
      "Books free on OpenTable, though it’s mostly a walk-in sports bar. Reserve for groups or big game days.",
    tips: ["Online up to 20; private spaces via the events team", "Opens 5 PM weekdays, 11 AM weekends"],
    phone: "(312) 649-9640",
  },
  "the-vig": {
    platform: "Resy",
    url: "https://resy.com/cities/chicago-il/venues/the-vig",
    blurb:
      "Books on Resy for up to 6; bigger groups email the events team. Half the room is always held for walk-ins.",
    tips: [
      "7+ guests: Events@TheVIGChicago.com",
      "Whole party must arrive before you’re seated",
      "Patio can’t be reserved — first-come only",
    ],
    phone: "(312) 982-2186",
  },
  "blue-sushi": {
    platform: "OpenTable",
    url: "https://www.opentable.com/r/blue-sushi-sake-grill-chicago",
    blurb: "Books on OpenTable — free, instant confirmation (Lincoln Common location).",
    tips: [
      "Happy hour Mon–Fri 11 AM–6:30 PM, Sat 12–6:30, all day Sun",
      "No private dining room — call for large groups",
    ],
    phone: "(773) 241-7111",
  },
  "j9-wine-bar": {
    platform: "Walk-in only",
    url: null,
    blurb:
      "No reservations on any platform — strictly first-come, first-served. Arrive early on weekend evenings; seating is limited.",
    tips: ["Large groups can no longer be accommodated", "Every bottle on the list is 25% off to-go"],
    phone: "(312) 982-2488",
  },
  cindys: {
    platform: "OpenTable",
    url: "https://www.opentable.com/r/cindys-rooftop-chicago",
    blurb:
      "Books on OpenTable, opening 14 days out for up to 10 guests. Reservations cover indoor atrium tables only — the outdoor terrace is always first-come, first-served.",
    tips: [
      "Terrace closes at 11 PM and is weather-dependent",
      "Express Elevator to the 13th floor — expect lines at sunset",
      "11+ guests is a private event",
    ],
    phone: "(312) 792-3502",
  },
  // ---- Lakeview (verified July 19, 2026) ----
  "bites-asian-kitchen-bar": {
    platform: "OpenTable",
    url: "https://www.opentable.com/r/bites-asian-kitchen-and-bar-restaurant-chicago",
    blurb:
      "Books on OpenTable — a card holds the table (nothing charged). Cancel by 3 PM day-of or it’s $25/person.",
    tips: ["Parties of 7+ email info@biteskitchen.com", "Patio seating; Cubs game days get slammed"],
    phone: "(773) 270-5972",
  },
  "felix-lakeview": {
    platform: "OpenTable",
    url: "https://www.opentable.com/r/felix-modern-american-dining-chicago",
    blurb:
      "Books on OpenTable — instant confirmation, no deposit. Weekend brunch (DJs, bottomless mimosas) goes fast.",
    tips: ["Closed Tuesdays", "Happy hour Mon/Wed–Fri 4–6 PM", "Expect Cubs crowds on game days"],
    phone: "(312) 955-0059",
  },
  avaspi: {
    platform: "OpenTable",
    url: "https://www.opentable.com/r/avaspi-chicago",
    blurb:
      "Books on OpenTable — instant confirmation, no deposit. Anatolian tapas made for group mezze spreads.",
    tips: ["Closed Mondays", "Request the garden patio when booking", "Fills up pre-show nights (Vic/Belmont theaters)"],
    phone: "(773) 720-1297",
  },
  "le-petit-marcel": {
    platform: "OpenTable",
    url: "https://www.opentable.com/r/le-petit-marcel-reservations-chicago",
    blurb:
      "Books on OpenTable — instant confirmation. Happy hour is bar and patio only, walk-in first-come, no reservations.",
    tips: ["HH Mon–Thu 4–6 PM, Fri 3–5 PM", "Small room, lively Fri–Sat; open till midnight weekends"],
    phone: "(773) 697-8478",
  },
  "el-nuevo-mexicano": {
    platform: "SevenRooms",
    url: "https://www.sevenrooms.com/explore/elnuevomexicano/reservations/create/search/",
    blurb:
      "Books on SevenRooms — pick the dining room or the year-round heated patio.",
    tips: ["Some RESERVE buttons on their site go to takeout ordering — use this link", "Near Wrigley; game days get busy"],
    phone: "(773) 528-2131",
  },
  "figo-wine-bar": {
    platform: "OpenTable",
    url: "https://www.opentable.com/r/figo-wine-bar-chicago",
    blurb:
      "Books on OpenTable for up to 22, including the private wine cellar (6+). Cellar on Fri–Sat is phone-only.",
    tips: ["Closed Mondays", "Happy hour at the bar Mon–Thu 5–6 PM, Fri 4–5 PM", "Kitchen closes ~1 hr before the bar"],
    phone: "(312) 819-6111",
  },
  "drews-on-halsted": {
    platform: "Direct",
    url: "https://tmt.spotapps.co/reservations?spot_id=8735",
    blurb:
      "Books on Drew’s own form — pick inside or patio, dinner only, no card needed.",
    tips: ["Online takes 1–7; call for bigger groups", "Weekend brunch is walk-in or phone only"],
    phone: "(773) 244-9191",
  },
  "swift-tavern-wrigleyville": {
    platform: "OpenTable",
    url: "https://www.opentable.com/r/swift-tavern-wrigleyville-chicago",
    blurb:
      "Books on OpenTable — instant confirmation. Directly across from Wrigley; reserve well ahead on game days.",
    tips: ["Online up to 20; private spaces for 12–300", "2nd floor has Wrigley Field views", "4% surcharge on checks (removable on request)"],
    phone: "(773) 360-0207",
  },
  "mia-francesca-lakeview": {
    platform: "OpenTable",
    url: "https://www.opentable.com/mia-francesca",
    blurb:
      "Books on OpenTable — make sure it’s the original Clark St location (the Francesca’s family has a dozen others).",
    tips: ["Dinner only, from 4 PM daily", "Cobblestone terrace is seasonal — ask when booking", "Walk-ins wait at the antique bar"],
    phone: "(773) 281-3310",
  },
  "sheffields-beer-garden": {
    platform: "Walk-in only",
    url: null,
    blurb:
      "No reservations — grab a beer-garden table or bar spot first-come, first-served. Groups book private spaces via events@sheffieldschicago.com.",
    tips: ["Packed on warm days and Cubs game days", "No kids after 7 PM; service dogs only", "Open till 2 AM (3 AM Sat)"],
    phone: "(773) 281-4989",
  },
  "finley-dunnes-tavern": {
    platform: "Walk-in only",
    url: null,
    blurb:
      "No reservations — first-come, first-served. The private party room (up to 40, 4 TVs) books by inquiry or phone.",
    tips: ["Opens 5 PM Mon–Thu (11 AM weekends)", "Official Blackhawks + Illini bar — packed for games"],
    phone: "(773) 477-7311",
  },
  "butchers-tap": {
    platform: "Walk-in only",
    url: null,
    blurb:
      "No reservations — first-come, first-served. Groups and watch parties book through the Book A Party inquiry.",
    tips: ["Southport Corridor, short walk to Wrigley", "Seasonal patio + garage windows", "Cubs/Ohio State/Bears/Steelers fan bar — game days are packed"],
    phone: "(773) 325-0123",
  },
  // ---- Gold Coast additions (verified July 19-20, 2026) ----
  "tavern-on-rush": {
    platform: "OpenTable",
    url: "https://www.opentable.com/tavern-on-rush-reservations-chicago",
    blurb:
      "Books on OpenTable — instant confirmation, no deposit. Rush Hour happy hour is bar-area only, walk-in.",
    tips: ["Happy hour Sun–Thu 3–6 PM, bar area only", "Patio not covered by the Rush Hour menu"],
    phone: "(312) 664-9600",
  },
  adalina: {
    platform: "OpenTable",
    url: "https://www.opentable.com/r/adalina-chicago",
    blurb:
      "Books on OpenTable — fills up fast, especially weekends. Parties over 10 go through the events team.",
    tips: ["Happy hour Mon–Fri 4–6 PM", "Weekends get loud and busy — book ahead"],
    phone: "(312) 820-9000",
  },
  "eduardos-enoteca": {
    platform: "Tock",
    url: "https://www.eduardosenoteca.com/reservations",
    blurb:
      "Books on Tock (switched over from OpenTable in 2024) — same-page link routes to the current booking widget.",
    tips: ["Happy hour Mon–Thu 3–5 PM", "Also still listed on OpenTable, but Tock is primary"],
    phone: "(312) 337-4490",
  },
  "la-storia": {
    platform: "OpenTable",
    url: "https://www.opentable.com/la-storia",
    blurb:
      "Books on OpenTable — choose the main dining room, small bar, upstairs room, or rear courtyard.",
    tips: ["Happy hour Mon–Thu 4–6 PM", "Closed Mondays for dinner service"],
    phone: "(312) 915-5950",
  },
  sparrow: {
    platform: "Call ahead / walk-in",
    url: null,
    blurb:
      "Sources disagree on whether Sparrow takes reservations — safest bet is to call ahead, otherwise it's a walk-in Art Deco cocktail lounge.",
    tips: ["Happy hour Mon–Fri 4–7 PM: half off drafts, $10 wine", "Small room — arrives early on weekends"],
    phone: "(312) 725-0732",
  },
};

// Merge overlay onto a DB row. Returns null if the place is closed.
export function withReservationInfo(place) {
  const info = RESERVATION_INFO[place.slug];
  if (!info) return place;
  if (info.closed) return null;
  return {
    ...place,
    address: info.address || place.address,
    reservation_url: info.url !== undefined ? info.url : place.reservation_url,
    reservation_platform: place.reservation_platform || info.platform,
    reservation_notes: place.reservation_notes || info.blurb,
    reservation_tips: place.reservation_tips || info.tips,
    phone: place.phone || info.phone,
  };
}

