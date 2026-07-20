"use client";

import { useEffect, useState } from "react";

export default function Carousel({ slides }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!slides || slides.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 4200);
    return () => clearInterval(t);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="carousel">
      {slides.map((s, idx) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={s.slug}
          src={s.image_url}
          alt={s.name}
          className={idx === i ? "on" : ""}
          loading={idx === 0 ? "eager" : "lazy"}
        />
      ))}
      <div className="caption">{slides[i].name}</div>
    </div>
  );
}
