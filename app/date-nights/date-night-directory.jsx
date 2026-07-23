"use client";

import { useMemo, useState } from "react";
import { getPlaceLogo } from "../../lib/logos";
import { TIER_ORDER, tierKey, accolades } from "../../lib/dateNightTier";

// Bucket for the rare place with no neighborhood on file, so it still shows
// up somewhere instead of silently vanishing from the list.
const UNKNOWN_HOOD = "Other Neighborhoods";

export default function DateNightDirectory({ places }) {
  const [hood, setHood] = useState("All");
  const [accolade, setAccolade] = useState(null); // one of TIER_ORDER keys or null

  const rows = useMemo(
    () =>
      (places || [])
        .filter((p) => p.dn)
        .map((p) => ({
          ...p,
          neighborhood: p.neighborhood || UNKNOWN_HOOD,
          tier: tierKey(p.dn),
          badges: accolades(p.dn),
        })),
    [places]
  );

  // Date Night spots skew toward different pockets of the city than the
  // happy-hour/patio lists (way more Michelin-and-friends spread across
  // neighborhoods like Logan Square, Fulton Market, Pilsen, etc.), so this
  // list discovers its own neighborhoods from the data instead of reusing
  // the other categories' fixed HOOD_ORDER — new neighborhoods just get
  // their own section. "Other Neighborhoods" is always sorted last.
  const hoods = useMemo(
    () =>
      Array.from(new Set(rows.map((p) => p.neighborhood))).sort((a, b) => {
        if (a === UNKNOWN_HOOD) return 1;
        if (b === UNKNOWN_HOOD) return -1;
        return a.localeCompare(b);
      }),
    [rows]
  );

  const accoladeFilters = TIER_ORDER.filter((t) => rows.some((p) => p.tier === t.key));

  const visible = rows.filter(
    (p) =>
      (hood === "All" || p.neighborhood === hood) &&
      (!accolade || p.tier === accolade)
  );

  const visibleHoods = hoods.filter((h) => visible.some((p) => p.neighborhood === h));

  // sequential "No." numbering across neighborhood sections
  const numberOf = {};
  let n = 0;
  for (const h of visibleHoods)
    for (const p of visible
      .filter((x) => x.neighborhood === h)
      .sort((a, b) => a.name.localeCompare(b.name)))
      numberOf[p.id] = ++n;

  return (
    <>
      <div className="filters">
        <button
          className={`pill ${hood === "All" && !accolade ? "active" : ""}`}
          onClick={() => {
            setHood("All");
            setAccolade(null);
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
      </div>

      <div className="filters attr-filters">
        {accoladeFilters.map((t) => (
          <button
            key={t.key}
            className={`pill attr ${accolade === t.key ? "active" : ""}`}
            onClick={() => setAccolade(accolade === t.key ? null : t.key)}
          >
            {t.label}
            <span className="count">
              {rows.filter((p) => p.tier === t.key).length}
            </span>
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="empty">
          No date-night spots match — try clearing a filter.
        </p>
      )}

      {visibleHoods.map((hoodName) => {
        const spots = visible
          .filter((p) => p.neighborhood === hoodName)
          .sort((a, b) => a.name.localeCompare(b.name));
        return (
          <section className="hood" key={hoodName}>
            <div className="hood-head">
              <h2>{hoodName}</h2>
              <span className="n">
                {spots.length} {spots.length === 1 ? "spot" : "spots"}
              </span>
            </div>
            <div className="grid">
              {spots.map((p) => {
                const dn = p.dn;
                const logo = getPlaceLogo(p.name);
                const meta = [dn.cuisine, dn.price].filter(Boolean).join(" · ");
                const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${p.name} ${p.address || ""}`
                )}`;
                return (
                  <article className="card dn-card" key={p.id}>
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
                      </div>

                      <div className="dn-badges">
                        {p.badges.map((b, i) => (
                          <span className={`dn-badge dn-${b.kind}`} key={i}>
                            {b.text}
                          </span>
                        ))}
                      </div>

                      <a
                        className="addr-link"
                        href={directionsUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {p.address}
                      </a>
                      {meta && <div className="dn-meta">{meta}</div>}
                      {dn.vibe && <p className="desc">{dn.vibe}</p>}

                      <div className="links">
                        {p.reservation_url && (
                          <a href={p.reservation_url} target="_blank" rel="noreferrer">
                            Reserve{dn.reservation_platform ? ` · ${dn.reservation_platform}` : ""}
                          </a>
                        )}
                        {!p.reservation_url && dn.reservation_platform && (
                          <span className="dn-res-note">{dn.reservation_platform}</span>
                        )}
                        {p.website_url && (
                          <a href={p.website_url} target="_blank" rel="noreferrer">
                            Site
                          </a>
                        )}
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
