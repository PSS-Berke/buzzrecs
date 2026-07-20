"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Rec Lists shown in the dropdown. Add future lists here.
const REC_LISTS = [
  { href: "/", label: "Happy Hours", note: null },
  { href: "/patios", label: "Patios", note: null },
  { href: "/date-nights", label: "Date Nights", note: "soon" },
];

export default function MenuNav() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const pathname = usePathname() || "/";

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isHere = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="menu-nav" ref={wrapRef}>
      <button
        type="button"
        className={`menu-btn${open ? " open" : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
      >
        {/* PLACEHOLDER icon — replace this <span.menu-glyph> with
            <img src="/menu-icon.svg" alt="" className="menu-glyph-img" />
            once Berke's icon is dropped into public/. */}
        <span className="menu-glyph" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="menu-btn-label">Menu</span>
      </button>

      {open && (
        <div className="menu-pop" role="menu">
          <div className="menu-sec">
            <span className="menu-kick">The Map</span>
            <Link
              href="/map"
              className={`menu-item${isHere("/map") ? " here" : ""}`}
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              Explore the map
              {isHere("/map") && <span className="menu-dot" />}
            </Link>
          </div>

          <div className="menu-rule" />

          <div className="menu-sec">
            <span className="menu-kick">Rec Lists</span>
            {REC_LISTS.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={`menu-item${isHere(it.href) ? " here" : ""}`}
                onClick={() => setOpen(false)}
                role="menuitem"
              >
                {it.label}
                {it.note ? (
                  <span className="menu-soon">{it.note}</span>
                ) : (
                  isHere(it.href) && <span className="menu-dot" />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
