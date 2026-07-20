"use client";

import { useState } from "react";
import Directory from "./directory";
import PatioDirectory from "./patios/patio-directory";
import { CatIcon } from "./cat-icons";

// Order per Berke: Both, Happy Hour, Patio.
const CATS = [
  { key: "both", label: "Both" },
  { key: "happy", label: "Happy Hour" },
  { key: "patio", label: "Patio" },
];

export default function HomeBrowse({ happyPlaces, patioPlaces }) {
  const [cat, setCat] = useState("happy"); // land on happy hours (matches hero)
  const hasPatios = (patioPlaces || []).length > 0;

  return (
    <>
      <div className="cat-switch" role="group" aria-label="Browse by category">
        {CATS.map((c) => (
          <button
            key={c.key}
            type="button"
            className={`cat-btn ${cat === c.key ? "active" : ""}`}
            onClick={() => setCat(c.key)}
            aria-pressed={cat === c.key}
          >
            <CatIcon kind={c.key} />
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {(cat === "happy" || cat === "both") && happyPlaces && (
        <section className="cat-section">
          {cat === "both" && <h2 className="cat-sec-head">Happy Hours</h2>}
          <Directory places={happyPlaces} />
        </section>
      )}

      {(cat === "patio" || cat === "both") && hasPatios && (
        <section className="cat-section">
          {cat === "both" && <h2 className="cat-sec-head">Patios</h2>}
          <PatioDirectory places={patioPlaces} />
        </section>
      )}
    </>
  );
}
