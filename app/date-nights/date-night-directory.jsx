"use client";

import { useMemo, useState } from "react";
import { getPlaceLogo } from "../../lib/logos";
import { TIER_ORDER, tierKey, accolades } from "../../lib/dateNightTier";

export default function DateNightDirectory({ places }) {
  const [tier, setTier] = useState("All");

  const rows = useMemo(
    () =>
      (places || [])
        .filter((p) => p.dn)
        .map((p) => ({ ...p, tier: tierKey(p.dn), badges: accolades(p.dn) })),
    [places]
  );

  const tiers = TIER_ORDER.filter((t) => rows.some((p) => p.tier === t.key));
  const visible = rows.filter((p) => tier === "All" || p.tier === tier);
  const visibleTiers = tiers.filter((t) => visible.some((p) => p.tier === t.key));

  // sequential "No." numbering across tiers
  const numberOf = {};
  let n = 0;
  for (const t of visibleTiers)
    for (const p of visible
      .filter((x) => x.tier === t.key)
      .sort((a, b) => a.name.localeCompare(b.name)))
      numberOf[p.id] = ++n;

  return (
    <>
      <div className="filters">
        <button
          className={`pill ${tier === "All" ? "active" : ""}`}
          onClick={() => setTier("All")}
        >
          All<span className="count">{rows.length}</span>
        </button>
        {tiers.map((t) => (
          <button
            key={t.key}
            className={`pill ${tier === t.key ? "active" : ""}`}
            onClick={() => setTier(tier === t.key ? "All" : t.key)}
          >
            {t.label}
            <span className="count">
              {rows.filter((p) => p.tier === t.key).length}
            </span>
          </button>
        ))}
      </div>

      {visibleTiers.map((t) => {
        const spots = visible
          .filter((p) => p.tier === t.key)
          .sort((a, b) => a.name.localeCompare(b.name));
        return (
          <section className="hood" key={t.key}>
            <div className="hood-head">
              <h2>{t.label}</h2>
              <span className="n">
                {spots.length} {spots.length === 1 ? "spot" : "spots"}
              </span>
            </div>
            <div className="grid">
              {spots.map((p) => {
                const dn = p.dn;
                const logo = getPlaceLogo(p.name);
                const meta = [p.neighborhood, dn.cuisine, dn.price]
                  .filter(Boolean)
                  .join(" · ");
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
