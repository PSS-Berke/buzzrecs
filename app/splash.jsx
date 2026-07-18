"use client";

import { useEffect, useState } from "react";
import { HAPPY_HOUR_QUIPS } from "../lib/happyHourQuips";

export default function Splash() {
  const [phase, setPhase] = useState("hold"); // hold -> split -> gone
  const [quip, setQuip] = useState("");

  useEffect(() => {
    setQuip(
      HAPPY_HOUR_QUIPS[Math.floor(Math.random() * HAPPY_HOUR_QUIPS.length)]
    );
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
    <div className={`splash${phase === "split" ? " splash-split" : ""}`} aria-hidden="true">
      <div className="splash-half splash-left" />
      <div className="splash-half splash-right" />
      <div className="splash-content">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-buzzrecs.png" alt="" className="splash-logo" />
        {quip && <p className="splash-quip">{quip}</p>}
      </div>
    </div>
  );
}
