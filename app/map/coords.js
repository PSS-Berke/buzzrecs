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
};

// Neighborhood centroids, for the quick-jump chips' flyTo target.
export const ZONE_CENTERS = {
  "River North": { lat: 41.8895, lng: -87.63015, zoom: 16 },
  "West Loop": { lat: 41.88684, lng: -87.64903, zoom: 16 },
  "Gold Coast": { lat: 41.90156, lng: -87.62836, zoom: 16 },
  "Old Town": { lat: 41.90919, lng: -87.63465, zoom: 16 },
  "Lincoln Park": { lat: 41.92096, lng: -87.64755, zoom: 15 },
  "The Loop": { lat: 41.88164, lng: -87.6248, zoom: 16 },
};

export const CITY_VIEW = { lat: 41.8972, lng: -87.6358, zoom: 13 };
