// Restaurant logo marks, keyed by exact `places.name`. `dark: true` means the
// logo is light/white and needs a dark chip behind it to read; otherwise it
// sits on the default paper chip.
export const PLACE_LOGOS = {
  Aba: { src: "/logos/aba.png", dark: true },
  Beatrix: { src: "/logos/beatrix.png", dark: true },
  Benchmark: { src: "/logos/benchmark.png", dark: true },
  "Gilt Bar": { src: "/logos/gilt-bar.png", dark: true },
  "Hub 51": { src: "/logos/hub-51.png", dark: true },
  "J9 Wine Bar": { src: "/logos/j9-wine-bar.png", dark: false },
  "Old Town Pour House": { src: "/logos/old-town-pour-house.png", dark: false },
  "RPM Italian": { src: "/logos/rpm-italian.png", dark: false },
  "Shaw's Crab House": { src: "/logos/shaws-crab-house.png", dark: true },
  "The Publican": { src: "/logos/the-publican.png", dark: false },
  "The VIG": { src: "/logos/the-vig.png", dark: true },
  "Tortoise Supper Club": { src: "/logos/tortoise-supper-club.png", dark: false },

  // ---- River North batch (added July 20, 2026) ----
  "Bub City": { src: "/logos/bub-city.png", dark: true },
  "RPM Steak": { src: "/logos/rpm-steak.png", dark: true },
  "RPM Seafood": { src: "/logos/rpm-seafood.png", dark: false },
  "Siena Tavern": { src: "/logos/siena-tavern.png", dark: false },
  "Untitled Supper Club": { src: "/logos/untitled-supper-club.png", dark: true },
  "The Kerryman": { src: "/logos/the-kerryman.png", dark: true },
  Tanta: { src: "/logos/tanta-river-north.png", dark: true },
  "Kinzie Chophouse": { src: "/logos/kinzie-chophouse.png", dark: false },
  Wildfire: { src: "/logos/wildfire-river-north.png", dark: true },
  "Osteria Via Stato": { src: "/logos/osteria-via-stato.png", dark: false },
  "Quartino Ristorante": { src: "/logos/quartino-ristorante.png", dark: false },
  Barrio: { src: "/logos/barrio-river-north.png", dark: false },
  "River Roast": { src: "/logos/river-roast.png", dark: true },
  "Hubbard Inn": { src: "/logos/hubbard-inn.png", dark: false },
  "The Hampton Social": { src: "/logos/the-hampton-social-river-north.png", dark: false },
  "Sunda New Asian": { src: "/logos/sunda-new-asian-river-north.png", dark: false },
};

export function getPlaceLogo(name) {
  return PLACE_LOGOS[name] || null;
}
