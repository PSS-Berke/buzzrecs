"use client";

import { useEffect, useState } from "react";

// Patio-themed one-liners for the intro.
const PATIO_QUIPS = [
  "Chicago has two seasons: patio and waiting for patio.",
  "Sixty degrees and suddenly everyone's a regular.",
  "Sunshine's free. The fros\u00e9 isn't.",
  "If the umbrella's up, so are we.",
  "Golden hour has a happy hour.",
  "The best seat in the house is outside.",
  "Table for two, sky included.",
  "Bring the dog. Bring the date. Bring both.",
  "Heat lamps: extending the season since forever.",
  "Skyline on one side, spritz on the other.",
  "String lights absolutely count as ambiance.",
  "Rooftops were made for this.",
  "First-warm-day energy, all summer long.",
  "Weather permitting \u2014 and it's permitting.",
  "Sit outside. Thank us later.",
]

const CREAM = "#f6efe0";

function PatioMark() {
  return (
    <svg className="splash-mark" viewBox="0 0 640 560" aria-hidden="true">
      <g
        fill="none"
        stroke={CREAM}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* umbrella */}
        <path d="M322 158 Q432 52 542 158" />
        <path d="M322 158 q27.5 34 55 0 q27.5 34 55 0 q27.5 34 55 0 q27.5 34 55 0" />
        <path d="M432 150 L432 360" />
        <circle cx="432" cy="49" r="6" fill={CREAM} />
        {/* bistro table */}
        <ellipse cx="320" cy="432" rx="74" ry="15" />
        <path d="M320 447 L320 505 M296 505 L344 505" />
        {/* left chair */}
        <path d="M182 452 C176 388 254 388 248 452" />
        <path d="M182 452 L248 452" />
        <path d="M190 452 L184 512 M240 452 L246 512" />
        {/* right chair */}
        <path d="M392 452 C386 388 464 388 458 452" />
        <path d="M392 452 L458 452" />
        <path d="M400 452 L394 512 M450 452 L456 512" />
      </g>

      {/* sparkles */}
      <g fill={CREAM}>
        <path d="M560 118 l3 9 9 3 -9 3 -3 9 -3 -9 -9 -3 9 -3 z" />
        <path d="M126 300 l2.4 7 7 2.4 -7 2.4 -2.4 7 -2.4 -7 -7 -2.4 7 -2.4 z" />
        <path d="M556 430 l2.4 7 7 2.4 -7 2.4 -2.4 7 -2.4 -7 -7 -2.4 7 -2.4 z" />
      </g>

      {/* wordmark */}
      <text
        x="112"
        y="180"
        fill={CREAM}
        fontSize="42"
        style={{
          fontFamily: "var(--font-body), sans-serif",
          fontWeight: 700,
          letterSpacing: "0.22em",
        }}
      >
        BUZZ&apos;S
      </text>
      <text
        x="322"
        y="358"
        textAnchor="middle"
        fill={CREAM}
        fontSize="196"
        style={{ fontFamily: "var(--font-script), cursive" }}
      >
        Patio
      </text>
    </svg>
  );
}

export default function PatioSplash() {
  const [phase, setPhase] = useState("hold"); // hold -> split -> gone
  const [quip, setQuip] = useState("");

  useEffect(() => {
    setQuip(PATIO_QUIPS[Math.floor(Math.random() * PATIO_QUIPS.length)]);
    document.body.classList.add("splash-lock");
    const toSplit = setTimeout(() => setPhase("split"), 1500);
    const toGone = setTimeout(() => {
      setPhase("gone");
      document.body.classList.remove("splash-lock");
    }, 2450);
    return () => {
      clearTimeout(toSplit);
      clearTimeout(toGone);
      document.body.classList.remove("splash-lock");
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className={`splash${phase === "split" ? " splash-split" : ""}`}
      aria-hidden="true"
    >
      <div className="splash-half splash-left" />
      <div className="splash-half splash-right" />
      <div className="splash-content">
        <PatioMark />
        {quip && <p className="splash-quip">{quip}</p>}
      </div>
    </div>
  );
}
