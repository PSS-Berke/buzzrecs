"use client";

import { useCallback, useRef, useState } from "react";

// Mobile-first, snap-scrolling row of review cards — the "social feed" feel
// for Gabby's Corner. Takes normalized items so it can render either
// Gabby's professional reviews or the community pours.
export default function ReviewCarousel({ items, tone = "maroon" }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    if (el.scrollLeft > 8) setScrolled(true);
    const first = el.children[0];
    const cardW = first ? first.getBoundingClientRect().width + 16 : 1;
    const idx = Math.round(el.scrollLeft / cardW);
    setActive(Math.max(0, Math.min(idx, items.length - 1)));
  }, [items.length]);

  const goTo = (i) => {
    const el = trackRef.current;
    const card = el?.children[i];
    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.children[0];
    const cardW = first ? first.getBoundingClientRect().width + 16 : 300;
    el.scrollBy({ left: dir * cardW, behavior: "smooth" });
  };

  if (!items || items.length === 0) return null;

  const icon = tone === "club" ? "🍹" : "🥃";

  return (
    <div className={`rc-wrap rc-${tone}`}>
      {items.length > 1 && (
        <div className={`rc-hint${scrolled ? " rc-hint-hidden" : ""}`}>
          swipe for more <span>→</span>
        </div>
      )}

      {items.length > 1 && (
        <button
          type="button"
          className="rc-arrow rc-arrow-prev"
          onClick={() => scrollByCard(-1)}
          aria-label="Previous review"
        >
          ‹
        </button>
      )}

      <div className="rc-track" ref={trackRef} onScroll={onScroll}>
        {items.map((r) => (
          <article className="rc-card" key={r.id}>
            <div className="rc-media">
              {r.mediaType === "video" && (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video controls preload="metadata" src={r.mediaUrl} playsInline />
              )}
              {r.mediaType === "image" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.mediaUrl} alt="" />
              )}
              {!r.mediaType && (
                <div className="rc-media-placeholder">
                  <span>{icon}</span>
                </div>
              )}
              <div className="rc-scrim" aria-hidden="true" />
              <span className="rc-rating">
                <strong>{r.rating}</strong>/{r.ratingOutOf}
              </span>
            </div>
            <div className="rc-body">
              <div className="rc-title">{r.title}</div>
              {r.subtitle && <div className="rc-subtitle">{r.subtitle}</div>}
              {r.byline && <div className="rc-byline">{r.byline}</div>}
              {(r.vibe != null || r.menu != null) && (
                <div className="rc-sub-ratings">
                  {r.vibe != null && (
                    <span>
                      vibe {r.vibe}/{r.ratingOutOf}
                    </span>
                  )}
                  {r.vibe != null && r.menu != null && (
                    <span className="rc-sub-dot">·</span>
                  )}
                  {r.menu != null && (
                    <span>
                      menu {r.menu}/{r.ratingOutOf}
                    </span>
                  )}
                </div>
              )}
              {r.notes && <p className="rc-notes">{r.notes}</p>}
            </div>
          </article>
        ))}
      </div>

      {items.length > 1 && (
        <button
          type="button"
          className="rc-arrow rc-arrow-next"
          onClick={() => scrollByCard(1)}
          aria-label="Next review"
        >
          ›
        </button>
      )}

      {items.length > 1 && (
        <div className="rc-dots">
          {items.map((r, i) => (
            <button
              key={r.id}
              type="button"
              className={`rc-dot${i === active ? " on" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
