"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

const OTHER = "__other__";

export default function CommunityReview() {
  const [session, setSession] = useState(null);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  const [places, setPlaces] = useState([]);
  const [placeId, setPlaceId] = useState("");
  const [barText, setBarText] = useState("");
  const [whiskey, setWhiskey] = useState("");
  const [body, setBody] = useState("");
  const [score, setScore] = useState(3.5);
  const [displayName, setDisplayName] = useState("");

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
    if (!session || !supabase) return;
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", session.user.id)
      .maybeSingle()
      .then(({ data }) => setDisplayName(data?.display_name || ""));
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
    if (!whiskey.trim()) return setErr("Name the whiskey.");
    if (!placeId) return setErr("Pick the bar.");
    if (placeId === OTHER && !barText.trim()) return setErr("Name the spot.");
    setBusy(true);
    try {
      if (displayName.trim()) {
        await supabase
          .from("profiles")
          .update({ display_name: displayName.trim() })
          .eq("id", session.user.id);
      }
      const { error: insErr } = await supabase.from("user_reviews").insert({
        user_id: session.user.id,
        place_id: placeId === OTHER ? null : placeId,
        bar_text: placeId === OTHER ? barText.trim() : null,
        whiskey_name: whiskey.trim(),
        rating: score,
        body: body.trim() || null,
      });
      if (insErr) throw insErr;
      setDone(true);
    } catch (e2) {
      setErr(
        /rate limit|row-level security/i.test(e2.message || "")
          ? "Easy there — five pours a day is the house limit."
          : e2.message || String(e2)
      );
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
        <span className="script-sub">from the bar stools</span>
        <h1 className="upload-title">Add your pour</h1>

        {!supabase && <p className="empty">Database not configured.</p>}

        {done && (
          <div className="upload-card">
            <p className="script-sub">poured.</p>
            <p>
              Your review is live.{" "}
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
                <p className="empty">
                  No passwords. We text you a 6-digit code, that&apos;s the
                  whole login.
                </p>
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

        {!done && session && (
          <form onSubmit={submit} className="upload-card stack">
            <label>The whiskey</label>
            <input
              placeholder="e.g. Eagle Rare 10"
              value={whiskey}
              onChange={(e) => setWhiskey(e.target.value)}
              required
            />

            <label>Where&apos;d you have it?</label>
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

            <label>
              Your score: <strong className="score-echo">{score}</strong> / 5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
            />

            <label>Tasting notes (optional)</label>
            <textarea
              rows={3}
              placeholder="What'd it taste like? Would you order it again?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />

            <label>Name on the review (optional)</label>
            <input
              placeholder="Anonymous"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />

            <button disabled={busy} className="btn">
              {busy ? "Pouring…" : "Post it"}
            </button>
            {err && <p className="form-err">{err}</p>}
            <button
              type="button"
              className="btn ghost"
              onClick={() => supabase.auth.signOut()}
            >
              Sign out
            </button>
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
