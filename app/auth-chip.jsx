"use client";

// Topbar auth chip: "sign in" when signed out; avatar/initial + handle with
// a tiny dropdown (sign out) when signed in. Drop into any .topnav.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "./auth-context";

export default function AuthChip() {
  const auth = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  if (!auth) return null;
  const { session, profile, openLogin, signOut } = auth;

  if (!session) {
    return (
      <button type="button" className="auth-chip" onClick={openLogin}>
        sign in
      </button>
    );
  }

  const name = profile?.handle
    ? `@${profile.handle}`
    : profile?.display_name || "you";
  const initial = (profile?.display_name || profile?.handle || "?")
    .charAt(0)
    .toUpperCase();

  return (
    <span className="auth-wrap" ref={ref}>
      <button
        type="button"
        className="auth-chip signed-in"
        onClick={() => (profile?.handle ? setOpen((o) => !o) : openLogin())}
      >
        {profile?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.avatar_url} alt="" className="auth-avatar" />
        ) : (
          <span className="auth-avatar auth-initial">{initial}</span>
        )}
        {name}
      </button>
      {open && (
        <span className="auth-menu">
          <Link
            href="/profile"
            className="auth-menu-item"
            onClick={() => setOpen(false)}
          >
            my profile
          </Link>
          <button
            type="button"
            className="auth-menu-item"
            onClick={() => {
              setOpen(false);
              signOut();
            }}
          >
            sign out
          </button>
        </span>
      )}
    </span>
  );
}
