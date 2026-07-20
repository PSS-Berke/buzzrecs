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
  // ---- The Loop batch (verified July 19, 2026) ----
  "the-gage": {
    platform: "OpenTable",
    url: "https://www.opentable.com/r/the-gage-chicago",
    blurb:
      "Books on OpenTable — reserve for the dining room. Happy hour itself is bar-only, first-come, first-served.",
    tips: ["Arrive right at 2 PM for a bar stool", "Mini-martinis are bar service only", "Groups of 12+ call (312) 372-4001"],
    phone: "(312) 372-4243",
  },
  acanto: {
    platform: "OpenTable",
    url: "https://www.opentable.com/r/acanto-chicago",
    blurb:
      "Books on OpenTable — a table across from Millennium Park is worth locking in. Aperitivo pricing is dine-in only.",
    tips: ["Ask about the rotating sommelier wine features", "3.5% surcharge on checks (removable on request)"],
    phone: "(312) 578-0763",
  },
  "the-dearborn": {
    platform: "OpenTable",
    url: "https://www.opentable.com/r/the-dearborn-chicago",
    blurb:
      "Books on OpenTable. Steps from the Loop theaters — grab a table before an evening show.",
    tips: ["Happy hour is Monday only — plan the week around it", "Sunday live jazz brunch, noon–2 PM"],
    phone: "(312) 384-1242",
  },
  petterinos: {
    platform: "OpenTable",
    url: "https://www.opentable.com/r/petterinos-chicago",
    blurb:
      "Books on OpenTable, but happy hour pricing lives in the bar area and patio. Fills fast on Goodman/Nederlander show nights.",
    tips: ["Come 2–4 PM for elbow room; pre-theater rush hits 5:30", "The 8 PM-to-close encore round is a post-show steal"],
    phone: "(312) 422-0150",
  },
  "the-roanoke": {
    platform: "OpenTable",
    url: "https://www.theroanokerestaurant.com/reservations",
    blurb:
      "Book the dining room online; pull up a bar stool for happy hour pricing. 4 PM arrivals beat the LaSalle Street exodus.",
    tips: ["HH is bar-only, Mon–Fri 4–6 PM", "Mon + Fri add a 2–5 PM $12 cocktail hour", "Cashless — cards only"],
    phone: "(312) 361-3800",
  },
  venteux: {
    platform: "Direct",
    url: "https://www.venteuxchicago.com",
    blurb:
      "Reserve through the widget on Venteux's site (Pendry Chicago). Oyster hour is popular — a 4 PM booking is the smart play.",
    tips: ["$1 oysters need a half-dozen minimum", "Tuesdays extend $1 oysters all day"],
    phone: "(312) 777-9003",
  },
  "land-and-lake-kitchen": {
    platform: "Direct",
    url: "https://www.landandlakekitchen.com/visit-us",
    blurb:
      "Relaxed spot where walking in works fine, especially at the bar. Groups can arrange seating via the visit page or phone.",
    tips: ["HH specials are dine-in only", "3:30 PM start beats every nearby 4 PM crowd", "Steps from the Riverwalk"],
    phone: "(312) 253-2337",
  },
  "beatrix-loop": {
    platform: "OpenTable",
    url: "https://www.opentable.com/restref/client/?restref=1237885&lang=en-US",
    blurb:
      "Takes happy hour reservations via OpenTable — a rarity in the Loop. Book a table or slide into the bar for the same pricing.",
    tips: ["Monday half-price wine bottles run all day", "Closed weekends — a weekday play"],
    phone: "(312) 736-0404",
  },
  "sushi-san-willis-tower": {
    platform: "Walk-in only",
    url: null,
    blurb:
      "The $5 hand roll deal lives at the Hand Roll Bar — strictly first-come, first-served.",
    tips: ["Arrive right at 3 PM; the counter fills fast", "Weekdays only, 3–5 PM", "Enter through Willis Tower's Catalog food hall"],
    phone: null,
  },
  boleo: {
    platform: "OpenTable",
    url: "https://www.opentable.com/restref/client/?restref=264589&lang=en-US",
    blurb:
      "Reserve via OpenTable to guarantee a rooftop perch atop the Kimpton Gray. The happy hour window is short — book early.",
    tips: ["Only one hour (5–6 PM), Wed–Sat", "Roof opens in warm weather; sunset views", "Tableside guacamole to start"],
    phone: "(312) 750-9007",
  },
  remingtons: {
    platform: "Tock",
    url: "https://www.exploretock.com/remingtonschicago",
    blurb:
      "Books through Tock. For happy hour pricing, settle in at the bar or the Michigan Avenue patio rail.",
    tips: ["Ask for the separate happy hour menu", "Patio seats go first on warm evenings", "4% admin fee on checks"],
    phone: "(312) 782-6000",
  },
  "the-village-italian-village": {
    platform: "Resy",
    url: "https://resy.com/cities/chi/italian-village",
    blurb:
      "Reserve on Resy for the starlit dining room; happy hour deals pour at the bar. A century of hospitality — walk-ins welcome too.",
    tips: ["Thursday $8 martini lunch runs noon–4 PM", "Second floor is stairs-only", "Sister bars Sotto and Bar Sotto downstairs"],
    phone: "(312) 332-7005",
  },
  "the-grillroom-chophouse": {
    platform: "OpenTable",
    url: "https://www.opentable.com/the-grillroom-chophouse-and-wine-bar",
    blurb:
      "Book ahead for pre-theater dinner; happy hour lives at the bar and the flower-lined Monroe Street patio.",
    tips: ["HH is bar and patio only", "Summer patio seats ~50 — arrive by 4:30", "Handy pre-show stop for the CIBC Theatre"],
    phone: "(312) 960-0000",
  },
  "elephant-and-castle-adams": {
    platform: "Walk-in only",
    url: null,
    blurb:
      "It's a pub — walk in, find a high-top, order at the bar. Work groups can inquire via the website for reserved space.",
    tips: ["Everything on the HH menu is a flat $6", "Solid European draft list beyond the deal beers"],
    phone: "(312) 236-6656",
  },
  "elephant-and-castle-wabash": {
    platform: "Walk-in only",
    url: null,
    blurb:
      "No reservations needed — grab a booth under the L tracks. Handy for pre-theater pints near the Nederlander.",
    tips: ["All HH items are $6 flat", "Quieter than the Adams location on Fridays"],
    phone: "(312) 345-1710",
  },
  acebounce: {
    platform: "SevenRooms",
    url: "https://www.sevenrooms.com/explore/acebounce/reservations/create/search",
    blurb:
      "Book a ping pong table through SevenRooms for 2–12; the bar welcomes walk-ins. Tuesday pairs HH with 6 PM Trick Shot Trivia.",
    tips: ["HH runs till 7 PM — an hour longer than most", "Closed Sun–Mon", "Groups of 13+ use the events form"],
    phone: "(773) 219-0900",
  },
  "roof-on-thewit": {
    platform: "Direct",
    url: "https://roofonthewit.com/reservations/",
    blurb:
      "Reserve through ROOF's site to skip the elevator-lobby line, especially Thu–Fri. Early arrivals get the rail seats.",
    tips: ["Come at 4 PM sharp for window seats", "Smart-casual after dark", "Retractable roof — runs year-round"],
    phone: "(312) 239-9502",
  },
  "about-last-knife": {
    platform: "Direct",
    url: "https://arlohotels.com/chicago/eat-and-drink/about-last-knife/",
    blurb:
      "Part of the Arlo Chicago hotel — most happy hour guests walk in at the bar; book dinner via the hotel's dining page.",
    tips: ["Three full hours (3–6 PM)", "Steak-centric dinner menu if you stay past 6"],
    phone: null,
  },
  "flight-club-chicago": {
    platform: "Direct",
    url: "https://flightclubdartsusa.com/chicago/wacker",
    blurb:
      "Book a darts oche online for groups; the bars welcome walk-ins for drinks and bites.",
    tips: ["Reserve an oche for groups of 4+", "HH is Mon–Thu only", "The back bar is usually quieter"],
    phone: null,
  },
  "90th-meridian": {
    platform: "Walk-in only",
    url: null,
    blurb:
      "A drop-in spot built for the after-work rush — no reservation needed at the bar. Call for larger groups.",
    tips: ["Four-hour window (3–7 PM), Tue–Thu only", "Right by the Quincy L stop"],
    phone: "(312) 929-3948",
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

