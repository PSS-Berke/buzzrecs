"use client";

import { useEffect, useState } from "react";

export default function Splash() {
  const [phase, setPhase] = useState("hold"); // hold -> split -> gone

  useEffect(() => {
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-buzzrecs.png" alt="" className="splash-logo" />
    </div>
  );
}
