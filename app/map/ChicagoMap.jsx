"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isHappyHourNow, formatTime } from "../../lib/isHappyHourNow";
import { PIN_COORDS, ZONES, RIVERS, LAKE, PARKS, STREETS, LANDMARKS, VIEWBOX } from "./coords";

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

const MIN_K = 1;
const MAX_K = 5;
const clampK = (k) => Math.min(MAX_K, Math.max(MIN_K, k));

// Keep the panned content covering the viewport -- no dragging off into
// blank space beyond the map's edges.
const clampPan = (x, y, k, rect) => {
  const minX = rect.width * (1 - k);
  const minY = rect.height * (1 - k);
  return { x: Math.min(0, Math.max(minX, x)), y: Math.min(0, Math.max(minY, y)) };
};

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

  // ---- pan / zoom ----
  const viewportRef = useRef(null);
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const pointers = useRef(new Map());
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const pinchRef = useRef(null);

  const zoomAt = useCallback((clientX, clientY, factor) => {
    const el = viewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    setView((v) => {
      const k2 = clampK(v.k * factor);
      if (k2 === v.k) return v;
      const x2 = px - ((px - v.x) * k2) / v.k;
      const y2 = py - ((py - v.y) * k2) / v.k;
      return { ...clampPan(x2, y2, k2, rect), k: k2 };
    });
  }, []);

  const focusOn = useCallback((cx, cy, targetK) => {
    const el = viewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scale = rect.width / VIEWBOX.w;
    const bx = (cx - VIEWBOX.x) * scale;
    const by = (cy - VIEWBOX.y) * scale;
    const k2 = clampK(targetK);
    const x2 = rect.width / 2 - k2 * bx;
    const y2 = rect.height / 2 - k2 * by;
    setView({ ...clampPan(x2, y2, k2, rect), k: k2 });
  }, []);

  const resetView = useCallback(() => {
    setView({ x: 0, y: 0, k: 1 });
    setActiveHood(null);
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const factor = Math.pow(1.0018, -e.deltaY);
      zoomAt(e.clientX, e.clientY, factor);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  // Dragging/pinching is tracked with window-level listeners (added only
  // while a gesture is active) rather than setPointerCapture -- capturing
  // the pointer on the viewport element would retarget the eventual click
  // away from whichever pin was pressed, silently breaking pin selection.
  const onWindowPointerMove = useCallback((e) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchRef.current) {
      const pts = Array.from(pointers.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const rect = viewportRef.current.getBoundingClientRect();
      const start = pinchRef.current;
      const px = start.mid.x - rect.left;
      const py = start.mid.y - rect.top;
      const k2 = clampK(start.k * (dist / start.dist));
      const x2 = px - ((px - start.x) * k2) / start.k;
      const y2 = py - ((py - start.y) * k2) / start.k;
      movedRef.current = true;
      setView({ ...clampPan(x2, y2, k2, rect), k: k2 });
    } else if (draggingRef.current && pointers.current.size === 1) {
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 2) movedRef.current = true;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      const rect = viewportRef.current.getBoundingClientRect();
      setView((v) => ({ ...clampPan(v.x + dx, v.y + dy, v.k, rect), k: v.k }));
    }
  }, []);

  const onWindowPointerEnd = useCallback((e) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchRef.current = null;
    if (pointers.current.size === 0) {
      draggingRef.current = false;
      window.removeEventListener("pointermove", onWindowPointerMove);
      window.removeEventListener("pointerup", onWindowPointerEnd);
      window.removeEventListener("pointercancel", onWindowPointerEnd);
    } else if (pointers.current.size === 1) {
      const remaining = Array.from(pointers.current.values())[0];
      lastPosRef.current = remaining;
      draggingRef.current = true;
    }
  }, [onWindowPointerMove]);

  const onPointerDown = (e) => {
    const wasEmpty = pointers.current.size === 0;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (wasEmpty) {
      movedRef.current = false;
      window.addEventListener("pointermove", onWindowPointerMove);
      window.addEventListener("pointerup", onWindowPointerEnd);
      window.addEventListener("pointercancel", onWindowPointerEnd);
    }
    if (pointers.current.size === 1) {
      draggingRef.current = true;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
    } else if (pointers.current.size === 2) {
      draggingRef.current = false;
      const pts = Array.from(pointers.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchRef.current = {
        dist,
        k: view.k,
        x: view.x,
        y: view.y,
        mid: { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 },
      };
    }
  };

  // Clean up window listeners if the component unmounts mid-gesture.
  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", onWindowPointerMove);
      window.removeEventListener("pointerup", onWindowPointerEnd);
      window.removeEventListener("pointercancel", onWindowPointerEnd);
    };
  }, [onWindowPointerMove, onWindowPointerEnd]);

  const handlePinClick = (id) => {
    if (movedRef.current) return;
    setSelected(id === selected ? null : id);
  };

  const handleListClick = (place) => {
    if (place.id === selected) {
      setSelected(null);
      return;
    }
    setSelected(place.id);
    const c = PIN_COORDS[place.slug];
    if (c) focusOn(c.x, c.y, 2.6);
  };

  const jumpToHood = (hood) => {
    setActiveHood(hood === activeHood ? null : hood);
    if (hood === activeHood) {
      resetView();
      return;
    }
    const zone = ZONES.find((z) => z.name === hood);
    if (zone) focusOn(zone.center.x, zone.center.y, 2.1);
  };

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

        <div
          className="map-viewport"
          ref={viewportRef}
          style={{ aspectRatio: `${VIEWBOX.w} / ${VIEWBOX.h}` }}
          onPointerDown={onPointerDown}
        >
          <svg
            viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}
            className="map-svg"
            role="img"
            aria-label="Map of BuzzRecs spots across Chicago"
            style={{
              transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`,
              transformOrigin: "0 0",
            }}
          >
            <defs>
              <filter id="wobbly" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="7" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
              </filter>
              <filter id="wobbly-soft" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.01 0.014" numOctaves="2" seed="3" result="noise2" />
                <feDisplacementMap in="SourceGraphic" in2="noise2" scale="6" xChannelSelector="R" yChannelSelector="G" />
              </filter>
              <filter id="wobbly-fine" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.02 0.03" numOctaves="2" seed="11" result="noise3" />
                <feDisplacementMap in="SourceGraphic" in2="noise3" scale="3" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>

            <rect
              x={VIEWBOX.x}
              y={VIEWBOX.y}
              width={VIEWBOX.w}
              height={VIEWBOX.h}
              fill="var(--cream-deep)"
            />

            <path d={LAKE} className="map-lake" filter="url(#wobbly)" />
            <text x="775" y="450" className="map-lake-label" transform="rotate(90 775 450)" textAnchor="middle">
              LAKE MICHIGAN
            </text>

            {RIVERS.map((d, i) => (
              <path key={i} d={d} className="map-river" filter="url(#wobbly-soft)" />
            ))}

            {ZONES.map((z) => (
              <path key={z.name} d={z.path} className="map-zone" filter="url(#wobbly)" />
            ))}

            {PARKS.map((p, i) => (
              <g key={i}>
                <path d={p.path} className="map-park" filter="url(#wobbly)" />
                <text
                  x={p.label.x}
                  y={p.label.y}
                  className="map-park-label"
                  fontSize={p.label.size || 12}
                  textAnchor="middle"
                  transform={`rotate(${p.label.rotate} ${p.label.x} ${p.label.y})`}
                >
                  {p.label.name}
                </text>
              </g>
            ))}

            <g className="map-streets" filter="url(#wobbly-fine)">
              {STREETS.map((s, i) => (
                <line key={i} x1={s.line[0]} y1={s.line[1]} x2={s.line[2]} y2={s.line[3]} />
              ))}
            </g>
            <g className="map-street-labels">
              {STREETS.map((s, i) => (
                <text
                  key={i}
                  x={s.label.x}
                  y={s.label.y}
                  transform={`rotate(${s.label.rotate} ${s.label.x} ${s.label.y})`}
                >
                  {s.label.name}
                </text>
              ))}
            </g>

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

            <g className="map-landmarks" filter="url(#wobbly-fine)">
              {LANDMARKS.map((l, i) => {
                if (l.type === "pier") {
                  return (
                    <g key={i}>
                      <rect x={l.x} y={l.y} width="55" height="10" className="map-landmark" />
                      <circle cx={l.x + 60} cy={l.y + 5} r="9" className="map-landmark-ring" />
                    </g>
                  );
                }
                if (l.type === "tower") {
                  return (
                    <path
                      key={i}
                      d={`M ${l.x} ${l.y + 45} L ${l.x} ${l.y} L ${l.x + 7} ${l.y - 5} L ${l.x + 14} ${l.y} L ${l.x + 14} ${l.y + 45} Z`}
                      className="map-landmark-solid"
                    />
                  );
                }
                return (
                  <g key={i}>
                    <rect x={l.x} y={l.y} width="14" height="18" className="map-landmark" />
                    <path d={`M ${l.x - 2} ${l.y} L ${l.x + 18} ${l.y} L ${l.x + 8} ${l.y - 12} Z`} className="map-landmark-solid" />
                  </g>
                );
              })}
            </g>
            <g className="map-landmark-labels">
              {LANDMARKS.map((l, i) => (
                <text key={i} x={l.label.x} y={l.label.y} textAnchor="middle">
                  {l.label.name}
                </text>
              ))}
            </g>

            <g className="map-compass" transform="translate(40,30)" filter="url(#wobbly-fine)">
              <circle r="26" className="map-compass-ring" />
              <path d="M0,-20 L7,0 L0,20 L-7,0 Z" className="map-compass-needle" />
              <path d="M-20,0 L0,7 L20,0 L0,-7 Z" className="map-compass-needle-2" />
              <text y="-30" textAnchor="middle" className="map-compass-n">
                N
              </text>
            </g>

            <text x="400" y="-30" textAnchor="middle" className="map-title">
              Chicago, painted
            </text>

            {withLive.map((p) => {
              const c = PIN_COORDS[p.slug];
              const isSelected = p.id === selected;
              return (
                <g
                  key={p.id}
                  transform={`translate(${c.x},${c.y}) scale(${isSelected ? 1.28 : 1})`}
                  className={`map-pin ${p.liveNow ? "live" : ""} ${isSelected ? "selected" : ""}`}
                  onClick={() => handlePinClick(p.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`No. ${numberOf[p.id]} ${p.name}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handlePinClick(p.id);
                  }}
                >
                  <path d={PIN_PATH} className="map-pin-body" />
                  <circle cx="0" cy="-4" r="10" className="map-pin-dot" />
                  <text y="0" className="map-pin-num" textAnchor="middle">
                    {numberOf[p.id]}
                  </text>
                  {p.liveNow && <circle cx="13" cy="-16" r="4" className="map-pin-live-dot" />}
                </g>
              );
            })}

            <rect
              x={VIEWBOX.x + 5}
              y={VIEWBOX.y + 5}
              width={VIEWBOX.w - 10}
              height={VIEWBOX.h - 10}
              className="map-frame-outer"
              filter="url(#wobbly)"
            />
            <rect
              x={VIEWBOX.x + 12}
              y={VIEWBOX.y + 12}
              width={VIEWBOX.w - 24}
              height={VIEWBOX.h - 24}
              className="map-frame-inner"
              filter="url(#wobbly)"
            />
          </svg>

          <div className="map-zoom-controls">
            <button
              type="button"
              aria-label="Zoom in"
              onClick={() => {
                const r = viewportRef.current.getBoundingClientRect();
                zoomAt(r.left + r.width / 2, r.top + r.height / 2, 1.4);
              }}
            >
              +
            </button>
            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => {
                const r = viewportRef.current.getBoundingClientRect();
                zoomAt(r.left + r.width / 2, r.top + r.height / 2, 1 / 1.4);
              }}
            >
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
