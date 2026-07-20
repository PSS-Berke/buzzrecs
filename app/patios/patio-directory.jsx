"use client";

import { useMemo, useState } from "react";
import { isPatioOpenNow, isInSeason, seasonLabel } from "../../lib/isPatioOpenNow";
import { getPlaceLogo } from "../../lib/logos";
import { withReservationInfo } from "../../lib/reservationInfo";

const HOOD_ORDER = [
  "River North",
  "West Loop",
  "Gold Coast",
  "Old Town",
  "Lincoln Park",
  "The Loop",
  "Lakeview",
];

// Attribute quick-filters. Each is a predicate over the flattened patio object.
const ATTR_FILTERS = [
  { key: "Rooftop", test: (pt) => pt.patio_type === "Rooftop" },
  { key: "Heated", test: (pt) => !!pt.heated },
  { key: "Dog-friendly", test: (pt) => !!pt.dog_friendly },
  { key: "Covered", test: (pt) => pt.covered && pt.covered !== "Open-air" },
];

export default function PatioDirectory({ places }) {
  const [hood, setHood] = useState("All");
  const [attr, setAttr] = useState(null); // one of ATTR_FILTERS keys or null
  const [openOnly, setOpenOnly] = useState(false);
  const [flipped, setFlipped] = useState(() => new Set());

  const toggleFlip = (id) =>
    setFlipped((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const now = new Date();
  const rows = useMemo(
    () =>
      (places || [])
        .map(withReservationInfo)
        .filter(Boolean)
        .filter((p) => p.patio) // guard: only real patios
        .map((p) => ({
          ...p,
          openNow: isPatioOpenNow(p.patio, now),
          inSeason: isInSeason(p.patio, now),
        })),
    [places]
  );

  const openCount = rows.filter((p) => p.openNow).length;
  const hoods = HOOD_ORDER.filter((h) => rows.some((p) => p.neighborhood === h));

  const visible = rows.filter(
    (p) =>
      (hood === "All" || p.neighborhood === hood) &&
      (!attr || ATTR_FILTERS.find((f) => f.key === attr)?.test(p.patio)) &&
      (!openOnly || p.openNow)
  );

  const visibleHoods = hoods.filter((h) =>
    visible.some((p) => p.neighborhood === h)
  );

  // Gus'-menu-style sequential numbering across sections.
  const numberOf = {};
  let n = 0;
  for (const h of visibleHoods)
    for (const p of visible.filter((x) => x.neighborhood === h))
      numberOf[p.id] = ++n;

  return (
    <>
      <div className="filters">
        <button
          className={`pill ${hood === "All" && !attr && !openOnly ? "active" : ""}`}
          onClick={() => {
            setHood("All");
            setAttr(null);
            setOpenOnly(false);
          }}
        >
          All<span className="count">{rows.length}</span>
        </button>
        {hoods.map((h) => (
          <button
            key={h}
            className={`pill ${hood === h ? "active" : ""}`}
            onClick={() => setHood(hood === h ? "All" : h)}
          >
            {h}
            <span className="count">
              {rows.filter((p) => p.neighborhood === h).length}
            </span>
          </button>
        ))}
        <button
          className={`pill open-pill ${openOnly ? "active" : ""}`}
          onClick={() => setOpenOnly(!openOnly)}
        >
          ● Open now<span className="count">{openCount}</span>
        </button>
      </div>

      <div className="filters attr-filters">
        {ATTR_FILTERS.map((f) => (
          <button
            key={f.key}
            className={`pill attr ${attr === f.key ? "active" : ""}`}
            onClick={() => setAttr(attr === f.key ? null : f.key)}
          >
            {f.key}
            <span className="count">
              {rows.filter((p) => f.test(p.patio)).length}
            </span>
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="empty">
          No patios match — try clearing a filter, or check back when the sun&apos;s out.
        </p>
      )}

      {visibleHoods.map((hoodName) => {
        const spots = visible.filter((p) => p.neighborhood === hoodName);
        return (
          <section className="hood" key={hoodName}>
            <div className="hood-head">
              <h2>{hoodName}</h2>
              <span className="n">
                {spots.length} {spots.length === 1 ? "patio" : "patios"}
              </span>
            </div>
            <div className="grid">
              {spots.map((p) => {
                const pt = p.patio;
                const logo = getPlaceLogo(p.name);
                const isFlipped = flipped.has(p.id);
                const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${p.name} ${p.address || ""}`
                )}`;
                const chips = [
                  pt.patio_type,
                  pt.view && `${pt.view} view`,
                  pt.covered && pt.covered !== "Open-air" ? pt.covered : null,
                  pt.heated && "Heated",
                  pt.dog_friendly && "Dog-friendly",
                  pt.fire_pit && "Fire pit",
                  pt.live_music && "Live music",
                  ...(pt.features || []),
                ]
                  .filter(Boolean)
                  .filter((c, i, arr) => {
                    const k = String(c).toLowerCase();
                    return arr.findIndex((x) => String(x).toLowerCase() === k) === i;
                  });

                return (
                  <article className={`card${isFlipped ? " flipped" : ""}`} key={p.id}>
                    <div className="card-inner">
                      {/* ---------- FRONT ---------- */}
                      <div className="card-face card-face-front">
                        <div className="card-top">
                          <div className="card-title-row">
                            {logo && (
                              <span className={`card-logo${logo.dark ? " dark" : ""}`}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={logo.src} alt="" />
                              </span>
                            )}
                            <h3>
                              <span className="no">No. {numberOf[p.id]}</span>
                              {p.name}
                            </h3>
                          </div>
                          {p.openNow ? (
                            <span className="badge-now">
                              <span className="dot" /> Open now
                            </span>
                          ) : (
                            <span className="badge-season">{seasonLabel(pt)}</span>
                          )}
                        </div>
                        <div className="addr">{p.address}</div>

                        <div className="patio-type-line">
                          <span className="pt-kind">{pt.patio_type}</span>
                          {pt.best_time && <span className="pt-best"> · best at {pt.best_time.toLowerCase()}</span>}
                        </div>

                        {pt.vibe && <p className="desc">{pt.vibe}</p>}
                        {!pt.vibe && p.description && <p className="desc">{p.description}</p>}

                        <div className="patio-tags">
                          {chips.map((c, i) => (
                            <span className="ptag" key={i}>{c}</span>
                          ))}
                        </div>

                        <div className="links">
                          {p.menu_url && (
                            <a href={p.menu_url} target="_blank" rel="noreferrer">Menu</a>
                          )}
                          {p.reservation_url && (
                            <a href={p.reservation_url} target="_blank" rel="noreferrer">Reserve</a>
                          )}
                          {p.website_url && (
                            <a href={p.website_url} target="_blank" rel="noreferrer">Site</a>
                          )}
                        </div>
                        <button type="button" className="flip-trigger" onClick={() => toggleFlip(p.id)}>
                          Full details →
                        </button>
                      </div>

                      {/* ---------- BACK ---------- */}
                      <div className="card-face card-face-back">
                        <button type="button" className="flip-trigger back" onClick={() => toggleFlip(p.id)}>
                          ← Back
                        </button>
                        {p.image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.image_url} alt="" className="card-photo" />
                        )}
                        <h3 className="card-back-title">
                          <span className="no">No. {numberOf[p.id]}</span>
                          {p.name}
                        </h3>
                        <a className="addr-link" href={directionsUrl} target="_blank" rel="noreferrer">
                          {p.address} · Get directions →
                        </a>

                        <dl className="patio-spec">
                          <div><dt>Type</dt><dd>{pt.patio_type}{pt.covered ? ` · ${pt.covered}` : ""}</dd></div>
                          {pt.view && <div><dt>View</dt><dd>{pt.view}</dd></div>}
                          {pt.shade && <div><dt>Shade</dt><dd>{pt.shade}</dd></div>}
                          <div><dt>Season</dt><dd>{seasonLabel(pt)}{p.inSeason ? " · in season" : " · off-season"}</dd></div>
                          {pt.seats != null && <div><dt>Seats</dt><dd>~{pt.seats}</dd></div>}
                          <div><dt>Reservable</dt><dd>{pt.reservable ? "Yes — book the patio" : "Walk-in / first-come"}</dd></div>
                          {pt.best_time && <div><dt>Best time</dt><dd>{pt.best_time}</dd></div>}
                        </dl>

                        {(p.reservation_notes || p.reservation_platform) && (
                          <div className="res-info">
                            <div className="res-head">
                              Reservations
                              {p.reservation_platform && (
                                <span className="res-badge">{p.reservation_platform}</span>
                              )}
                            </div>
                            {p.reservation_notes && <p className="res-blurb">{p.reservation_notes}</p>}
                            {(p.reservation_tips || []).length > 0 && (
                              <ul className="res-tips">
                                {p.reservation_tips.map((t, i) => <li key={i}>{t}</li>)}
                              </ul>
                            )}
                            {p.phone && <div className="res-phone">☎ {p.phone}</div>}
                          </div>
                        )}

                        <div className="back-links">
                          {p.menu_url && (
                            <a href={p.menu_url} target="_blank" rel="noreferrer" className="btn ghost">Menu</a>
                          )}
                          {p.reservation_url && (
                            <a href={p.reservation_url} target="_blank" rel="noreferrer" className="btn ghost">Reserve</a>
                          )}
                          {p.website_url && (
                            <a href={p.website_url} target="_blank" rel="noreferrer" className="btn ghost">Site</a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}
