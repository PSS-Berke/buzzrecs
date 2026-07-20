"use client";

import { useMemo, useState } from "react";
import { isHappyHourNow, formatTime } from "../lib/isHappyHourNow";
import { getPlaceLogo } from "../lib/logos";

const HOOD_ORDER = [
  "River North",
  "West Loop",
  "Gold Coast",
  "Old Town",
  "Lincoln Park",
  "The Loop",
];

export default function Directory({ places }) {
  const [filter, setFilter] = useState("All");
  const [liveOnly, setLiveOnly] = useState(false);
  const [flipped, setFlipped] = useState(() => new Set());

  const toggleFlip = (id) =>
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const now = new Date();
  const withLive = useMemo(
    () =>
      (places || []).map((p) => ({
        ...p,
        liveNow: (p.happy_hours || []).some((hh) => isHappyHourNow(hh, now)),
      })),
    [places]
  );

  const liveCount = withLive.filter((p) => p.liveNow).length;

  const hoods = HOOD_ORDER.filter((h) =>
    withLive.some((p) => p.neighborhood === h)
  );

  const visible = withLive.filter(
    (p) =>
      (filter === "All" || p.neighborhood === filter) &&
      (!liveOnly || p.liveNow)
  );

  const visibleHoods = hoods.filter((h) =>
    visible.some((p) => p.neighborhood === h)
  );

  // Gus'-menu-style numbering, sequential across sections
  const numberOf = {};
  let n = 0;
  for (const h of visibleHoods) {
    for (const p of visible.filter((x) => x.neighborhood === h)) {
      numberOf[p.id] = ++n;
    }
  }

  return (
    <>
      <div className="filters">
        <button
          className={`pill ${filter === "All" && !liveOnly ? "active" : ""}`}
          onClick={() => {
            setFilter("All");
            setLiveOnly(false);
          }}
        >
          All<span className="count">{withLive.length}</span>
        </button>
        {hoods.map((h) => (
          <button
            key={h}
            className={`pill ${filter === h ? "active" : ""}`}
            onClick={() => setFilter(filter === h ? "All" : h)}
          >
            {h}
            <span className="count">
              {withLive.filter((p) => p.neighborhood === h).length}
            </span>
          </button>
        ))}
        <button
          className={`pill live-pill ${liveOnly ? "active" : ""}`}
          onClick={() => setLiveOnly(!liveOnly)}
        >
          ● On now<span className="count">{liveCount}</span>
        </button>
      </div>

      {visible.length === 0 && (
        <p className="empty">
          Nothing pouring right now — check back closer to 4 o&apos;clock.
        </p>
      )}

      {visibleHoods.map((hood) => {
        const spots = visible.filter((p) => p.neighborhood === hood);
        return (
          <section className="hood" key={hood}>
            <div className="hood-head">
              <h2>{hood}</h2>
              <span className="n">
                {spots.length} {spots.length === 1 ? "spot" : "spots"}
              </span>
            </div>
            <div className="grid">
              {spots.map((p) => {
                const logo = getPlaceLogo(p.name);
                const isFlipped = flipped.has(p.id);
                const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${p.name} ${p.address || ""}`
                )}`;
                return (
                <article className={`card${isFlipped ? " flipped" : ""}`} key={p.id}>
                  <div className="card-inner">
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
                        {p.liveNow && (
                          <span className="badge-now">
                            <span className="dot" /> On now
                          </span>
                        )}
                      </div>
                      <div className="addr">{p.address}</div>
                      {p.description && <p className="desc">{p.description}</p>}
                      {(p.happy_hours || []).map((hh, i) => (
                        <div className="hh" key={i}>
                          <div className="when">
                            <span className="days">{hh.days}</span> ·{" "}
                            {formatTime(hh.start_time)}–{formatTime(hh.end_time)}
                          </div>
                          {hh.deals && <div className="deals">{hh.deals}</div>}
                        </div>
                      ))}
                      <div className="links">
                        {p.menu_url && (
                          <a href={p.menu_url} target="_blank" rel="noreferrer">
                            Menu
                          </a>
                        )}
                        {p.reservation_url && (
                          <a
                            href={p.reservation_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Reserve
                          </a>
                        )}
                        {p.website_url && (
                          <a href={p.website_url} target="_blank" rel="noreferrer">
                            Site
                          </a>
                        )}
                      </div>
                      <button
                        type="button"
                        className="flip-trigger"
                        onClick={() => toggleFlip(p.id)}
                      >
                        Full details →
                      </button>
                    </div>

                    <div className="card-face card-face-back">
                      <button
                        type="button"
                        className="flip-trigger back"
                        onClick={() => toggleFlip(p.id)}
                      >
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
                      <a
                        className="addr-link"
                        href={directionsUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {p.address} · Get directions →
                      </a>
                      {p.description && <p className="desc">{p.description}</p>}
                      {(p.happy_hours || []).length > 0 && (
                        <div className="back-hours">
                          {p.happy_hours.map((hh, i) => (
                            <div className="hh" key={i}>
                              <div className="when">
                                <span className="days">{hh.days}</span> ·{" "}
                                {formatTime(hh.start_time)}–{formatTime(hh.end_time)}
                              </div>
                              {hh.deals && <div className="deals">{hh.deals}</div>}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="back-links">
                        {p.menu_url && (
                          <a href={p.menu_url} target="_blank" rel="noreferrer" className="btn ghost">
                            Menu
                          </a>
                        )}
                        {p.reservation_url && (
                          <a
                            href={p.reservation_url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn ghost"
                          >
                            Reserve
                          </a>
                        )}
                        {p.website_url && (
                          <a href={p.website_url} target="_blank" rel="noreferrer" className="btn ghost">
                            Site
                          </a>
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
