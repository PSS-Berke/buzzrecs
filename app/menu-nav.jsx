"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./auth-context";

const REC_LISTS = [
  { href: "/", label: "Happy Hours", note: null },
  { href: "/patios", label: "Patios", note: null },
  { href: "/date-nights", label: "Date Nights", note: "soon" },
];

// Little tavern menu-card mark. Inline SVG so it can use the page's script
// font (--font-script / Kaushan) and palette vars; transparent, crisp at any
// size. Swap this out if a raster icon lands in /public later.
function MenuMark() {
  return (
    <svg className="menu-mark" viewBox="0 0 52 58" aria-hidden="true">
      <g transform="rotate(-5 26 30)">
        {/* back sheet peeking behind */}
        <rect x="15" y="9" width="28" height="41" rx="2.5"
              fill="#fcf7ea" stroke="#b08a3e" strokeWidth="1.1" opacity="0.75" />
        {/* front sheet */}
        <rect x="9" y="6" width="29" height="44" rx="2.5"
              fill="#fcf7ea" stroke="#b08a3e" strokeWidth="1.6" />
        {/* tack holes */}
        <circle cx="14.5" cy="11" r="1" fill="#b08a3e" />
        <circle cx="32.5" cy="11" r="1" fill="#b08a3e" />
        {/* script heading */}
        <text x="23.5" y="22" textAnchor="middle" fontSize="12"
              style={{ fontFamily: "var(--font-script), cursive" }}
              fill="#5e2634">Menu</text>
        {/* underline swash */}
        <path d="M13 25 Q23.5 29 34 25" fill="none"
              stroke="#b08a3e" strokeWidth="1.1" strokeLinecap="round" />
        {/* list rows */}
        <path d="M13 31 l1.6 -1.6 1.6 1.6 -1.6 1.6 z" fill="#b08a3e" />
        <line x1="18" y1="31" x2="33" y2="31" stroke="#b08a3e" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
        <circle cx="14.6" cy="37" r="1.5" fill="#b08a3e" />
        <line x1="18" y1="37" x2="33" y2="37" stroke="#b08a3e" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
        <circle cx="14.6" cy="43" r="1.5" fill="#b08a3e" />
        <line x1="18" y1="43" x2="30" y2="43" stroke="#b08a3e" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
      </g>
      {/* sparkles */}
      <path d="M43 9 l1 3 3 1 -3 1 -1 3 -1 -3 -3 -1 3 -1 z" fill="#d4af6a" />
      <path d="M9 46 l0.8 2.4 2.4 0.8 -2.4 0.8 -0.8 2.4 -0.8 -2.4 -2.4 -0.8 2.4 -0.8 z" fill="#d4af6a" />
    </svg>
  );
}

export default function MenuNav() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const pathname = usePathname() || "/";
  const auth = useAuth();

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

  const session = auth?.session;
  const profile = auth?.profile;
  const name = profile?.handle
    ? `@${profile.handle}`
    : profile?.display_name || "you";
  const initial = (profile?.display_name || profile?.handle || "?")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="menu-nav" ref={wrapRef}>
      <button
        type="button"
        className={`menu-btn${open ? " open" : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Menu"
        onClick={() => setOpen((o) => !o)}
      >
        <MenuMark />
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

          {auth && (
            <>
              <div className="menu-rule" />
              <div className="menu-sec">
                <span className="menu-kick">Account</span>
                {!session ? (
                  <button
                    type="button"
                    className="menu-item menu-item-btn"
                    onClick={() => {
                      setOpen(false);
                      auth.openLogin();
                    }}
                    role="menuitem"
                  >
                    Sign in
                  </button>
                ) : (
                  <>
                    <Link
                      href="/profile"
                      className={`menu-item${isHere("/profile") ? " here" : ""}`}
                      onClick={() => setOpen(false)}
                      role="menuitem"
                    >
                      <span className="menu-avatar" aria-hidden="true">
                        {profile?.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={profile.avatar_url} alt="" />
                        ) : (
                          <span className="menu-initial">{initial}</span>
                        )}
                      </span>
                      <span className="menu-me">
                        My profile
                        <span className="menu-handle">{name}</span>
                      </span>
                      {isHere("/profile") && <span className="menu-dot" />}
                    </Link>
                    <button
                      type="button"
                      className="menu-item menu-item-btn"
                      onClick={() => {
                        setOpen(false);
                        auth.signOut();
                      }}
                      role="menuitem"
                    >
                      Sign out
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
