"use client";

import { useMemo, useState } from "react";
import { isHappyHourNow, formatTime } from "../../lib/isHappyHourNow";
import { PIN_COORDS, ZONES } from "./coords";

const HOOD_ORDER = [
  "River North",
  "West Loop",
  "Gold Coast",
  "Old Town",
  "Lincoln Park",
  "The Loop",
];

const PIN_PATH =
  "M0,-22 C12,-22 20,-14 20,-2 C20,12 0,30 0,30 C0,30 -20,12 -20,-2 C-20,-14 -12,-22 0,-22 Z";

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
  const selectedPlace = withLive.find((p) => p.id === selected);

  const hoods = HOOD_ORDER.filter((h) => withLive.some((p) => p.neighborhood === h));

  return (
    <div className="map-layout">
      <div className="map-canvas">
        <svg viewBox="0 0 800 900" className="map-svg" role="img" aria-label="Map of BuzzRecs spots across Chicago">
          <defs>
            <filter id="wobbly" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="7" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id="wobbly-soft" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.01 0.014" numOctaves="2" seed="3" result="noise2" />
              <feDisplacementMap in="SourceGraphic" in2="noise2" scale="6" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>

          <rect x="0" y="0" width="800" height="900" fill="var(--cream-deep)" />

          <path
            d="M 660 -20 L 820 -20 L 820 920 L 640 920 L 655 700 L 625 500 L 648 300 L 618 150 L 645 40 Z"
            className="map-lake"
            filter="url(#wobbly)"
          />
          <text x="770" y="450" className="map-lake-label" transform="rotate(90 770 450)" textAnchor="middle">
            LAKE MICHIGAN
          </text>

          <path
            d="M 120 565 C 250 555, 320 575, 430 560 C 520 548, 600 545, 700 500"
            className="map-river"
            filter="url(#wobbly-soft)"
          />
          <path d="M 430 560 C 425 650, 440 750, 432 900" className="map-river" filter="url(#wobbly-soft)" />

          {ZONES.map((z) => (
            <path key={z.name} d={z.path} className="map-zone" filter="url(#wobbly)" />
          ))}
          {ZONES.map((z) => (
            <text
              key={z.name}
              x={z.label.x}
              y={z.label.y}
              className="map-zone-label"
              fontSize={z.label.size || 25}
              transform={`rotate(-2 ${z.label.x} ${z.label.y})`}
            >
              {z.name}
            </text>
          ))}

          {withLive.map((p) => {
            const c = PIN_COORDS[p.slug];
            const isSelected = p.id === selected;
            return (
              <g
                key={p.id}
                transform={`translate(${c.x},${c.y}) scale(${isSelected ? 1.28 : 1})`}
                className={`map-pin ${p.liveNow ? "live" : ""} ${isSelected ? "selected" : ""}`}
                onClick={() => setSelected(p.id === selected ? null : p.id)}
                tabIndex={0}
                role="button"
                aria-label={`No. ${numberOf[p.id]} ${p.name}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelected(p.id === selected ? null : p.id);
                }}
              >
                <path d={PIN_PATH} className="map-pin-body" />
                <circle cx="0" cy="-4" r="10" className="map-pin-dot" />
                <text y="0" className="map-pin-num">
                  {numberOf[p.id]}
                </text>
                {p.liveNow && <circle cx="13" cy="-16" r="4" className="map-pin-live-dot" />}
              </g>
            );
          })}
        </svg>
        <p className="map-caption">
          A hand-drawn take on the city, not a turn-by-turn map — tap a pin (or the list) for details.
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
                      onClick={() => setSelected(p.id === selected ? null : p.id)}
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
