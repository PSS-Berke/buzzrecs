"use client";

import { useMemo, useState } from "react";
import { isHappyHourNow, formatTime } from "../lib/isHappyHourNow";

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
              {spots.map((p) => (
                <article className="card" key={p.id}>
                  <div className="card-top">
                    <h3>
                      <span className="no">No. {numberOf[p.id]}</span>
                      {p.name}
                    </h3>
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
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
