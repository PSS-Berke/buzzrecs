"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

const OTHER = "__other__";

export default function UploadReview() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null); // null = checking
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  const [places, setPlaces] = useState([]);
  const [placeId, setPlaceId] = useState("");
  const [barText, setBarText] = useState("");
  const [file, setFile] = useState(null);
  const [score, setScore] = useState(7.5);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s)
    );
    supabase
      .from("places")
      .select("id, name, neighborhood")
      .eq("status", "approved")
      .order("name")
      .then(({ data }) => setPlaces(data || []));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return setIsAdmin(null);
    supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", session.user.id)
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data?.is_admin));
  }, [session]);

  const normPhone = (p) => {
    const d = p.replace(/\D/g, "");
    if (d.length === 10) return `+1${d}`;
    if (d.length === 11 && d.startsWith("1")) return `+${d}`;
    return p.startsWith("+") ? p : `+${d}`;
  };

  async function sendCode(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      phone: normPhone(phone),
    });
    setBusy(false);
    if (error) return setErr(error.message);
    setCodeSent(true);
  }

  async function verify(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: normPhone(phone),
      token: code.trim(),
      type: "sms",
    });
    setBusy(false);
    if (error) return setErr(error.message);
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    if (!file) return setErr("Pick a video first.");
    if (!placeId) return setErr("Pick the restaurant.");
    if (placeId === OTHER && !barText.trim())
      return setErr("Name the spot.");
    setBusy(true);
    try {
      const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const path = `${Date.now()}-${safe}`;
      const { error: upErr } = await supabase.storage
        .from("gabby-videos")
        .upload(path, file, { contentType: file.type || "video/mp4" });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage
        .from("gabby-videos")
        .getPublicUrl(path);
      const { error: insErr } = await supabase.from("gabbys_reviews").insert({
        place_id: placeId === OTHER ? null : placeId,
        bar_text: placeId === OTHER ? barText.trim() : null,
        rating: score,
        video_url: pub.publicUrl,
      });
      if (insErr) throw insErr;
      setDone(true);
    } catch (e2) {
      setErr(e2.message || String(e2));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <Link href="/" className="wordmark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-wordmark.png"
              alt="Buzz's Recs"
              className="wm-chip"
            />
          </Link>
          <nav className="topnav">
            <Link href="/gabbys-corner" className="gabby-link">
              Gabby&apos;s Corner
            </Link>
          </nav>
        </div>
      </div>

      <main className="container upload-wrap">
        <span className="script-sub">bartender&apos;s entrance</span>
        <h1 className="upload-title">Pour one in</h1>

        {!supabase && <p className="empty">Database not configured.</p>}

        {done && (
          <div className="upload-card">
            <p className="script-sub">poured.</p>
            <p>
              The review is live.{" "}
              <Link href="/gabbys-corner" className="back-link">
                See it in Gabby&apos;s Corner →
              </Link>
            </p>
          </div>
        )}

        {!done && supabase && !session && (
          <div className="upload-card">
            {!codeSent ? (
              <form onSubmit={sendCode} className="stack">
                <label>Phone number</label>
                <input
                  type="tel"
                  placeholder="(312) 555-0123"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <button disabled={busy} className="btn">
                  {busy ? "Sending…" : "Text me a code"}
                </button>
              </form>
            ) : (
              <form onSubmit={verify} className="stack">
                <label>Enter the 6-digit code</label>
                <input
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
                <button disabled={busy} className="btn">
                  {busy ? "Checking…" : "Verify"}
                </button>
              </form>
            )}
            {err && <p className="form-err">{err}</p>}
          </div>
        )}

        {!done && session && isAdmin === false && (
          <div className="upload-card">
            <p>
              You&apos;re signed in, but this corner is Gabby&apos;s only.
              Ask Berke to flip your admin switch.
            </p>
            <button
              className="btn ghost"
              onClick={() => supabase.auth.signOut()}
            >
              Sign out
            </button>
          </div>
        )}

        {!done && session && isAdmin && (
          <form onSubmit={submit} className="upload-card stack">
            <label>Restaurant / bar</label>
            <select
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
              required
            >
              <option value="">Pick a spot…</option>
              {places.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.neighborhood}
                </option>
              ))}
              <option value={OTHER}>Somewhere else…</option>
            </select>
            {placeId === OTHER && (
              <input
                placeholder="Name the spot"
                value={barText}
                onChange={(e) => setBarText(e.target.value)}
              />
            )}

            <label>The video</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />

            <label>
              Gabby&apos;s score: <strong className="score-echo">{score}</strong> / 10
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
            />

            <button disabled={busy} className="btn">
              {busy ? "Pouring…" : "Post the review"}
            </button>
            {err && <p className="form-err">{err}</p>}
          </form>
        )}

        <p>
          <Link href="/gabbys-corner" className="back-link">
            ← back to Gabby&apos;s Corner
          </Link>
        </p>
      </main>
    </>
  );
}
