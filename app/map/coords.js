// Hand-placed pin coordinates for the stylized Chicago map (viewBox 0 0 800 900).
// Positions are illustrative -- approximated from each spot's real cross streets,
// not a literal geocoded projection. Keyed by places.slug.
export const PIN_COORDS = {
  // River North
  "gilt-bar": { x: 390, y: 480 },
  "gus-sip-and-dip": { x: 520, y: 430 },
  "hub-51": { x: 565, y: 430 },
  "rpm-italian": { x: 605, y: 455 },
  "shaws-crab-house": { x: 650, y: 480 },
  "tortoise-supper-club": { x: 555, y: 520 },
  // West Loop
  aba: { x: 250, y: 650 },
  beatrix: { x: 330, y: 620 },
  "the-publican": { x: 370, y: 610 },
  // Gold Coast
  "hugos-frog-bar": { x: 620, y: 300 },
  "maple-and-ash": { x: 580, y: 350 },
  // Old Town
  benchmark: { x: 470, y: 320 },
  "old-town-pour-house": { x: 430, y: 360 },
  "the-vig": { x: 490, y: 290 },
  // Lincoln Park
  "blue-sushi": { x: 560, y: 150 },
  "j9-wine-bar": { x: 480, y: 190 },
  // The Loop
  cindys: { x: 560, y: 650 },
};

export const ZONES = [
  {
    name: "Lincoln Park",
    path: "M 300 230 L 300 90 L 460 45 L 700 60 L 700 230 Z",
    label: { x: 315, y: 112 },
  },
  {
    name: "Old Town",
    path: "M 340 400 L 340 240 L 520 240 L 520 400 Z",
    label: { x: 352, y: 268 },
  },
  {
    name: "Gold Coast",
    path: "M 520 390 L 520 260 L 560 220 L 680 240 L 680 390 Z",
    label: { x: 530, y: 253, size: 22 },
  },
  {
    name: "River North",
    path: "M 350 560 L 350 400 L 420 385 L 600 385 L 680 420 L 680 560 Z",
    label: { x: 358, y: 410 },
  },
  {
    name: "West Loop",
    path: "M 150 560 L 430 560 L 430 760 L 150 760 Z",
    label: { x: 163, y: 592 },
  },
  {
    name: "The Loop",
    path: "M 432 560 L 630 560 L 630 760 L 432 760 Z",
    label: { x: 444, y: 592 },
  },
];
