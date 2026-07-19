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
};

export function getPlaceLogo(name) {
  return PLACE_LOGOS[name] || null;
}
