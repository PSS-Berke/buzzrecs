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

