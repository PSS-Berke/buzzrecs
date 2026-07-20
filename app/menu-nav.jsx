"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./auth-context";

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
