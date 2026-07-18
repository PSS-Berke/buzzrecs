// Hand-placed map data for the stylized Chicago map.
// viewBox is "-20 -70 840 1010" -- a 800x900 city core with margin for the
// frame, title, and compass. Positions are illustrative, approximated from
// each spot's real cross streets -- not a literal geocoded projection.

export const VIEWBOX = { x: -20, y: -70, w: 840, h: 1010 };

// Keyed by places.slug
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
    center: { x: 480, y: 155 },
  },
  {
    name: "Old Town",
    path: "M 340 400 L 340 240 L 520 240 L 520 400 Z",
    label: { x: 352, y: 268 },
    center: { x: 430, y: 320 },
  },
  {
    name: "Gold Coast",
    path: "M 520 390 L 520 260 L 560 220 L 680 240 L 680 390 Z",
    label: { x: 530, y: 253, size: 22 },
    center: { x: 600, y: 320 },
  },
  {
    name: "River North",
    path: "M 350 560 L 350 400 L 420 385 L 600 385 L 680 420 L 680 560 Z",
    label: { x: 358, y: 410 },
    center: { x: 520, y: 470 },
  },
  {
    name: "West Loop",
    path: "M 150 560 L 430 560 L 430 760 L 150 760 Z",
    label: { x: 163, y: 592 },
    center: { x: 300, y: 630 },
  },
  {
    name: "The Loop",
    path: "M 432 560 L 630 560 L 630 760 L 432 760 Z",
    label: { x: 444, y: 592 },
    center: { x: 545, y: 630 },
  },
];

export const RIVERS = [
  "M 120 565 C 250 555, 320 575, 430 560 C 520 548, 600 545, 700 500",
  "M 430 560 C 425 650, 440 750, 432 900",
  "M 430 560 C 385 495, 345 445, 337 350 C 330 250, 302 150, 292 30",
];

export const LAKE =
  "M 660 -60 L 830 -60 L 830 930 L 640 930 L 655 700 L 625 500 L 648 300 L 618 150 L 645 40 Z";

export const PARKS = [
  {
    path: "M 700 60 L 700 230 L 645 225 L 655 140 L 630 90 L 660 55 Z",
    label: { x: 672, y: 140, rotate: -8, name: "Lincoln Park" },
  },
  {
    path: "M 580 562 L 630 562 L 630 618 L 585 613 Z",
    label: { x: 605, y: 595, rotate: 0, name: "Millennium Pk", size: 10 },
  },
];

export const STREETS = [
  { line: [540, 560, 540, 92], label: { x: 544, y: 115, rotate: -90, name: "State St" } },
  { line: [460, 560, 460, 242], label: { x: 440, y: 270, rotate: -90, name: "Wells St" } },
  { line: [610, 390, 610, 222], label: { x: 614, y: 245, rotate: -90, name: "Rush St" } },
  { line: [330, 758, 330, 95], label: { x: 312, y: 120, rotate: -90, name: "Halsted St" } },
  { line: [200, 605, 420, 605], label: { x: 260, y: 600, rotate: 0, name: "Fulton Market" } },
  { line: [350, 465, 630, 465], label: { x: 470, y: 461, rotate: 0, name: "Kinzie St" } },
  { line: [350, 440, 670, 440], label: { x: 470, y: 436, rotate: 0, name: "Hubbard St" } },
  { line: [600, 562, 600, 700], label: { x: 604, y: 660, rotate: -90, name: "Michigan Ave" } },
];

export const LANDMARKS = [
  { type: "pier", x: 685, y: 428, label: { x: 712, y: 455, name: "Navy Pier" } },
  { type: "tower", x: 435, y: 660, label: { x: 442, y: 720, name: "Willis Tower" } },
  { type: "castle", x: 630, y: 262, label: { x: 637, y: 298, name: "Water Tower" } },
];
