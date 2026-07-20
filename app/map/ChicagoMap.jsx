"use client";

import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isHappyHourNow, formatTime } from "../../lib/isHappyHourNow";
import { PIN_COORDS, ZONE_CENTERS, CITY_VIEW } from "./coords";

const HOOD_ORDER = [
  "River North",
  "West Loop",
  "Gold Coast",
  "Old Town",
  "Lincoln Park",
  "The Loop",
  "Lakeview",
];

const TILE_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>';

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}

// Teardrop pin, same silhouette as the old illustrated map. iconAnchor below
// points at the tip (bottom point of the path) so Leaflet places the tip --
// not the pin's geometric center -- exactly on the coordinate.
function pinIconHtml(number, live, label) {
  return `<svg viewBox="-24 -26 48 60" width="40" height="50" class="map-pin-svg" role="img" aria-label="${escapeHtml(label)}">
    <path d="M0,-22 C12,-22 20,-14 20,-2 C20,12 0,30 0,30 C0,30 -20,12 -20,-2 C-20,-14 -12,-22 0,-22 Z" class="map-pin-body"></path>
    <circle cx="0" cy="-4" r="10" class="map-pin-dot"></circle>
    <text x="0" y="0" text-anchor="middle" class="map-pin-num">${number}</text>
    ${live ? '<circle cx="13" cy="-16" r="4" class="map-pin-live-dot"></circle>' : ""}
  </svg>`;
}

export default function ChicagoMap({ places }) {
  const now = new Date();

  const withLive = useMemo(
    () =>
      (places || [])
        .filter((p) => PIN_COORDS[p.slug])
        .map((p) => ({
          ...p,
          liveNow: (p.happy_hours || []).some((hh) => isHappyHourNow(hh, now)),
        })),
    [places]
  );

  // Same "Gus' menu" numbering scheme as the home directory: sequential
  // across neighborhoods in HOOD_ORDER, alphabetical within each (the
  // Supabase query already sorts by neighborhood, name).
  const numberOf = {};
  let n = 0;
  for (const h of HOOD_ORDER) {
    for (const p of withLive.filter((x) => x.neighborhood === h)) {
      numberOf[p.id] = ++n;
    }
  }

  const [selected, setSelected] = useState(null);
  const [activeHood, setActiveHood] = useState(null);
  const selectedPlace = withLive.find((p) => p.id === selected);
  const hoods = HOOD_ORDER.filter((h) => withLive.some((p) => p.neighborhood === h));

  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const resizeObserverRef = useRef(null);
  const boundsRef = useRef(null);

  // Leaflet touches `window` at import time in some code paths, so it's
  // loaded dynamically inside an effect -- this only ever runs client-side,
  // keeping the component safe to server-render (the container just starts
  // as an empty div and the map takes over after mount).
  useEffect(() => {
    let cancelled = false;

    import("leaflet").then((mod) => {
      if (cancelled || !containerRef.current || mapRef.current) return;
      const L = mod.default || mod;

      const map = L.map(containerRef.current, {
        zoomControl: false,
        minZoom: 11,
        maxZoom: 18,
      }).setView([CITY_VIEW.lat, CITY_VIEW.lng], CITY_VIEW.zoom);

      L.tileLayer(TILE_URL, {
        attribution: TILE_ATTRIBUTION,
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      const latLngs = [];
      withLive.forEach((p) => {
        const c = PIN_COORDS[p.slug];
        if (!c) return;
        latLngs.push([c.lat, c.lng]);
        const label = `No. ${numberOf[p.id]} ${p.name}`;
        const icon = L.divIcon({
          html: pinIconHtml(numberOf[p.id], p.liveNow, label),
          className: `map-pin-icon${p.liveNow ? " live" : ""}`,
          iconSize: [40, 50],
          iconAnchor: [20, 47],
        });
        const marker = L.marker([c.lat, c.lng], { icon, keyboard: true, title: label }).addTo(map);
        marker.on("click", () => setSelected((cur) => (cur === p.id ? null : p.id)));
        markersRef.current[p.id] = marker;
      });

      // The opening view should show every spot, not just a fixed downtown
      // crop -- fit to the actual bounds of every pin instead of a hand-set
      // center/zoom, so it stays correct as new neighborhoods get added.
      boundsRef.current = latLngs.length ? L.latLngBounds(latLngs) : null;

      mapRef.current = map;

      // Leaflet reads its container's pixel size once, synchronously, at
      // construction time. If that happens before the CSS grid/aspect-ratio
      // layout has fully settled (webfonts loading, sidebar content still
      // reflowing, etc.), the map renders at the wrong size and -- since
      // nothing else constrains it -- bleeds outside its rounded box. A
      // ResizeObserver keeps it correctly sized for the container's actual,
      // current dimensions at all times (including later window resizes).
      // Fitting bounds is also deferred to the same frame, since it needs
      // the container's settled (correct) size to compute the right zoom.
      requestAnimationFrame(() => {
        map.invalidateSize();
        if (boundsRef.current) map.fitBounds(boundsRef.current, { padding: [30, 30] });
      });
      if (typeof ResizeObserver !== "undefined") {
        const ro = new ResizeObserver(() => map.invalidateSize());
        ro.observe(containerRef.current);
        resizeObserverRef.current = ro;
      }
    });

    return () => {
      cancelled = true;
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current = {};
    };
    // Places come from a single server-side fetch and don't change client-side,
    // so it's correct to build the map + markers once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focusOn = useCallback((lat, lng, zoom) => {
    if (mapRef.current) mapRef.current.flyTo([lat, lng], zoom, { duration: 1.1 });
  }, []);

  const resetView = useCallback(() => {
    setActiveHood(null);
    if (!mapRef.current) return;
    if (boundsRef.current) {
      mapRef.current.flyToBounds(boundsRef.current, { padding: [30, 30], duration: 1.1 });
    } else {
      mapRef.current.flyTo([CITY_VIEW.lat, CITY_VIEW.lng], CITY_VIEW.zoom, { duration: 1.1 });
    }
  }, []);

  const handleListClick = (place) => {
    if (place.id === selected) {
      setSelected(null);
      return;
    }
    setSelected(place.id);
    const c = PIN_COORDS[place.slug];
    if (c) focusOn(c.lat, c.lng, 17);
  };

  const jumpToHood = (hood) => {
    const willActivate = hood !== activeHood;
    setActiveHood(willActivate ? hood : null);
    if (!willActivate) {
      resetView();
      return;
    }
    const zone = ZONE_CENTERS[hood];
    if (zone) focusOn(zone.lat, zone.lng, zone.zoom);
  };

  // Reflect selection on the actual marker elements (fill + scale via CSS).
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      if (!el) return;
      el.classList.toggle("selected", id === selected);
    });
  }, [selected]);

  return (
    <div className="map-layout">
      <div className="map-canvas">
        <div className="map-toolbar">
          <button className={`pill ${!activeHood ? "active" : ""}`} onClick={resetView}>
            Whole city
          </button>
          {hoods.map((h) => (
            <button
              key={h}
              className={`pill ${activeHood === h ? "active" : ""}`}
              onClick={() => jumpToHood(h)}
            >
              {h}
            </button>
          ))}
        </div>

        <div className="map-viewport-wrap">
          <div
            className="map-viewport"
            ref={(el) => {
              containerRef.current = el;
            }}
          />
          <div className="map-zoom-controls">
            <button type="button" aria-label="Zoom in" onClick={() => mapRef.current?.zoomIn()}>
              +
            </button>
            <button type="button" aria-label="Zoom out" onClick={() => mapRef.current?.zoomOut()}>
              −
            </button>
            <button type="button" aria-label="Reset view" onClick={resetView}>
              ⟲
            </button>
          </div>
        </div>
        <p className="map-caption">
          Drag to pan, scroll or pinch to zoom — or tap a neighborhood above to jump right in.
        </p>
      </div>

      <aside className="map-legend">
        {selectedPlace && (
          <div className="map-callout">
            <div className="card-top">
              <h3>
                <span className="no">No. {numberOf[selectedPlace.id]}</span>
                {selectedPlace.name}
              </h3>
              {selectedPlace.liveNow && (
                <span className="badge-now">
                  <span className="dot" /> On now
                </span>
              )}
            </div>
            <div className="addr">{selectedPlace.address}</div>
            {selectedPlace.description && <p className="desc">{selectedPlace.description}</p>}
            {(selectedPlace.happy_hours || []).map((hh, i) => (
              <div className="hh" key={i}>
                <div className="when">
                  <span className="days">{hh.days}</span> · {formatTime(hh.start_time)}–{formatTime(hh.end_time)}
                </div>
                {hh.deals && <div className="deals">{hh.deals}</div>}
              </div>
            ))}
            <div className="links">
              {selectedPlace.menu_url && (
                <a href={selectedPlace.menu_url} target="_blank" rel="noreferrer">
                  Menu
                </a>
              )}
              {selectedPlace.reservation_url && (
                <a href={selectedPlace.reservation_url} target="_blank" rel="noreferrer">
                  Reserve
                </a>
              )}
              {selectedPlace.website_url && (
                <a href={selectedPlace.website_url} target="_blank" rel="noreferrer">
                  Site
                </a>
              )}
            </div>
          </div>
        )}

        {hoods.map((hood) => (
          <div className="map-hood" key={hood}>
            <h4>{hood}</h4>
            <ul>
              {withLive
                .filter((p) => p.neighborhood === hood)
                .map((p) => (
                  <li key={p.id}>
                    <button
                      className={`map-list-item ${p.id === selected ? "active" : ""}`}
                      onClick={() => handleListClick(p)}
                    >
                      <span className="no">No. {numberOf[p.id]}</span>
                      {p.name}
                      {p.liveNow && <span className="dot-live" aria-label="On now" />}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </aside>
    </div>
  );
}
