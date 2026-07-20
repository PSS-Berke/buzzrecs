// Real, geocoded coordinates (via OpenStreetMap Nominatim) for each spot.
// Keyed by places.slug. lat/lng pairs, WGS84.
//
// Note: Hub 51 and Gus' Sip & Dip share the same building (51 W Hubbard) --
// Gus' is nudged a few meters so both pins are distinguishable on the map.
export const PIN_COORDS = {
  "gilt-bar": { lat: 41.889282, lng: -87.635114 },
  "gus-sip-and-dip": { lat: 41.889929, lng: -87.629770 },
  "hub-51": { lat: 41.889849, lng: -87.629870 },
  "rpm-italian": { lat: 41.889375, lng: -87.630591 },
  "shaws-crab-house": { lat: 41.889880, lng: -87.627153 },
  "tortoise-supper-club": { lat: 41.888767, lng: -87.628310 },
  aba: { lat: 41.887019, lng: -87.648873 },
  beatrix: { lat: 41.886940, lng: -87.648965 },
  "the-publican": { lat: 41.886557, lng: -87.649252 },
  "hugos-frog-bar": { lat: 41.901163, lng: -87.627977 },
  "maple-and-ash": { lat: 41.901966, lng: -87.628741 },
  benchmark: { lat: 41.909508, lng: -87.634995 },
  "old-town-pour-house": { lat: 41.908139, lng: -87.634464 },
  "the-vig": { lat: 41.909912, lng: -87.634487 },
  "blue-sushi": { lat: 41.924191, lng: -87.646848 },
  "j9-wine-bar": { lat: 41.917730, lng: -87.648247 },
  cindys: { lat: 41.881645, lng: -87.624797 },
  // ---- Gold Coast additions (geocoded July 19-20, 2026) ----
  "tavern-on-rush": { lat: 41.9014256, lng: -87.6276623 },
  adalina: { lat: 41.9001080, lng: -87.6281854 },
  "eduardos-enoteca": { lat: 41.9043789, lng: -87.6304180 },
  "la-storia": { lat: 41.9034576, lng: -87.6303284 },
  sparrow: { lat: 41.9033723, lng: -87.6290617 },
  // ---- Lakeview (geocoded July 19-20, 2026) ----
  avaspi: { lat: 41.9399693, lng: -87.6611959 },
  "bites-asian-kitchen-bar": { lat: 41.9421958, lng: -87.6523157 },
  "butchers-tap": { lat: 41.9467903, lng: -87.6637385 },
  "drews-on-halsted": { lat: 41.9401060, lng: -87.6491600 },
  "el-nuevo-mexicano": { lat: 41.9353036, lng: -87.6471628 },
  "felix-lakeview": { lat: 41.9419418, lng: -87.6520273 },
  "figo-wine-bar": { lat: 41.9402434, lng: -87.6539754 },
  "finley-dunnes-tavern": { lat: 41.9447383, lng: -87.6725845 },
  "le-petit-marcel": { lat: 41.9354334, lng: -87.6445950 },
  "mia-francesca-lakeview": { lat: 41.9421793, lng: -87.6521992 },
  "sheffields-beer-garden": { lat: 41.9416050, lng: -87.6545104 },
  "swift-tavern-wrigleyville": { lat: 41.9473681, lng: -87.6568915 },
};

// Neighborhood centroids, for the quick-jump chips' flyTo target.
export const ZONE_CENTERS = {
  "River North": { lat: 41.8895, lng: -87.63015, zoom: 16 },
  "West Loop": { lat: 41.88684, lng: -87.64903, zoom: 16 },
  "Gold Coast": { lat: 41.90156, lng: -87.62836, zoom: 16 },
  "Old Town": { lat: 41.90919, lng: -87.63465, zoom: 16 },
  "Lincoln Park": { lat: 41.92096, lng: -87.64755, zoom: 15 },
  "The Loop": { lat: 41.88164, lng: -87.6248, zoom: 16 },
  Lakeview: { lat: 41.9418, lng: -87.6555, zoom: 15 },
};

export const CITY_VIEW = { lat: 41.8972, lng: -87.6358, zoom: 13 };
