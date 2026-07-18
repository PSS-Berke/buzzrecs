"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

const STEPS = ["media", "rate", "spot", "post"];

export default function ReviewWizard() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const [step, setStep] = useState(0);

  // media
  const [video, setVideo] = useState(null);
  const [menuPic, setMenuPic] = useState(null);
  const [menuPicPreview, setMenuPicPreview] = useState(null);

  // ratings + whiskey
  const [whiskey, setWhiskey] = useState("");
  const [score, setScore] = useState(null);
  const [vibe, setVibe] = useState(null);
  const [menuScore, setMenuScore] = useState(null);

  // spot
  const [places, setPlaces] = useState([]);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState(null); // {id,name} or {custom:true,name}

  // post
  const [body, setBody] = useState("");
  const [displayName, setDisplayName] = useState("");

  const max = isAdmin ? 10 : 5;
  const min = isAdmin ? 0 : 1;

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
      .select("is_admin, display_name")
      .eq("id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        setIsAdmin(!!data?.is_admin);
        setDisplayName(data?.display_name || "");
      });
  }, [session]);

  useEffect(() => {
    if (!menuPic) return setMenuPicPreview(null);
    const url = URL.createObjectURL(menuPic);
    setMenuPicPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [menuPic]);

  useEffect(() => {
    setScore((s) => (s == null ? null : Math.min(Math.max(s, min), max)));
  }, [isAdmin, min, max]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return places
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.neighborhood || "").toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query, places]);

  const exactMatch = matches.some(
    (p) => p.name.toLowerCase() === query.trim().toLowerCase()
  );

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

  function next() {
    setErr("");
    if (step === 0 && isAdmin && !video)
      return setErr("Pick the video first — that's the review.");
    if (step === 1) {
      if (!whiskey.trim()) return setErr("Name the whiskey.");
      if (score == null) return setErr("Give it a score.");
    }
    if (step === 2 && !picked) return setErr("Pick or name the spot.");
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function uploadTo(bucket, file) {
    const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `${Date.now()}-${safe}`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { contentType: file.type || undefined });
    if (error) throw error;
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }

  // Big videos go straight to R2 via a presigned URL; falls back to
  // Supabase storage (50 MB cap) if R2 isn't configured yet.
  async function uploadVideo(file) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    const res = await fetch("/api/upload-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type || "video/mp4",
        size: file.size,
      }),
    });
    if (res.status === 501) {
      if (file.size > 50 * 1024 * 1024)
        throw new Error(
          "Video hosting is still being set up — for now keep it under 50 MB (about 45 seconds at 720p)."
        );
      return uploadTo("gabby-videos", file);
    }
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j.error || "Could not start the upload.");
    }
    const { uploadUrl, publicUrl } = await res.json();
    const put = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "video/mp4" },
      body: file,
    });
    if (!put.ok) throw new Error("Video upload failed — try again.");
    return publicUrl;
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      let videoUrl = null;
      let menuUrl = null;
      if (isAdmin && video) videoUrl = await uploadVideo(video);
      if (menuPic) menuUrl = await uploadTo("review-media", menuPic);

      if (displayName.trim()) {
        await supabase
          .from("profiles")
          .update({ display_name: displayName.trim() })
          .eq("id", session.user.id);
      }

      const common = {
        place_id: picked.custom ? null : picked.id,
        bar_text: picked.custom ? picked.name : null,
        whiskey_name: whiskey.trim(),
        rating: score,
        rating_vibe: vibe,
        rating_menu: menuScore,
        menu_photo_url: menuUrl,
        notes: body.trim() || null,
      };

      let insErr;
      if (isAdmin) {
        ({ error: insErr } = await supabase
          .from("gabbys_reviews")
          .insert({ ...common, video_url: videoUrl }));
      } else {
        const { notes, ...rest } = common;
        ({ error: insErr } = await supabase.from("user_reviews").insert({
          ...rest,
          body: notes,
          user_id: session.user.id,
        }));
      }
      if (insErr) throw insErr;
      setDone(true);
    } catch (e2) {
      setErr(
        /row-level security/i.test(e2.message || "")
          ? "Easy there — five pours a day is the house limit."
          : e2.message || String(e2)
      );
    } finally {
      setBusy(false);
    }
  }

  const scoreSlider = (val, setVal, label, required) => (
    <div>
      <label>
        {label}:{" "}
        <strong className="score-echo">{val == null ? "—" : val}</strong> /{" "}
        {max}
        {!required && val != null && (
          <button
            type="button"
            className="back-link"
            style={{ marginLeft: 10 }}
            onClick={() => setVal(null)}
          >
            clear
          </button>
        )}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step="0.5"
        value={val == null ? (min + max) / 2 : val}
        onChange={(e) => setVal(Number(e.target.value))}
        onClick={(e) => val == null && setVal(Number(e.target.value))}
      />
    </div>
  );

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
        <span className="script-sub">
          {isAdmin ? "bartender's entrance" : "from the bar stools"}
        </span>
        <h1 className="upload-title">
          {done ? "Poured." : isAdmin ? "Pour one in" : "Add your pour"}
        </h1>

        {!supabase && <p className="empty">Database not configured.</p>}

        {done && (
          <div className="upload-card">
            <p className="script-sub">cheers.</p>
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
          <form
            onSubmit={submit}
            className="upload-card stack"
            style={{ position: "relative" }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              {STEPS.map((s, i) => (
                <span
                  key={s}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    border: "2px solid var(--maroon-deep)",
                    background:
                      i === step
                        ? "var(--club)"
                        : i < step
                        ? "var(--brass)"
                        : "transparent",
                    color: i <= step ? "var(--paper)" : "var(--maroon-deep)",
                  }}
                >
                  {i + 1}
                </span>
              ))}
              <span className="script-sub" style={{ marginLeft: 6 }}>
                {["the goods", "the verdict", "the spot", "last call"][step]}
              </span>
            </div>

            {step === 0 && (
              <>
                {isAdmin && (
                  <>
                    <label>The video (required)</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideo(e.target.files?.[0] || null)}
                    />
                    {video && <p className="empty">🎬 {video.name}</p>}
                  </>
                )}
                <label>
                  Menu pic {isAdmin ? "(optional)" : "(optional but loved)"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMenuPic(e.target.files?.[0] || null)}
                />
                {menuPicPreview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={menuPicPreview}
                    alt="Menu preview"
                    style={{
                      maxWidth: 180,
                      borderRadius: 10,
                      border: "2px solid var(--maroon-deep)",
                    }}
                  />
                )}
              </>
            )}

            {step === 1 && (
              <>
                <label>The whiskey</label>
                <input
                  placeholder="e.g. Eagle Rare 10"
                  value={whiskey}
                  onChange={(e) => setWhiskey(e.target.value)}
                />
                {scoreSlider(score, setScore, "The pour", true)}
                <p className="empty">Optional extra calls:</p>
                {scoreSlider(vibe, setVibe, "The vibe", false)}
                {scoreSlider(menuScore, setMenuScore, "The menu", false)}
              </>
            )}

            {step === 2 && (
              <>
                <label>Where&apos;d you have it?</label>
                <input
                  placeholder="Start typing… e.g. Gilt, VIG, Maple"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPicked(null);
                  }}
                />
                {picked && (
                  <p className="empty">
                    ✓ {picked.name}
                    {picked.custom ? " (new spot)" : ""}
                  </p>
                )}
                {!picked && query.trim() && (
                  <div className="stack" style={{ gap: 6 }}>
                    {matches.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className="btn ghost"
                        onClick={() => {
                          setPicked({ id: p.id, name: p.name });
                          setQuery(p.name);
                        }}
                      >
                        {p.name} — {p.neighborhood}
                      </button>
                    ))}
                    {!exactMatch && (
                      <button
                        type="button"
                        className="btn ghost"
                        onClick={() =>
                          setPicked({ custom: true, name: query.trim() })
                        }
                      >
                        Somewhere else: use &quot;{query.trim()}&quot;
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {step === 3 && (
              <>
                <label>Tasting notes (optional)</label>
                <textarea
                  rows={3}
                  placeholder="What'd it taste like? Would you order it again?"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
                {!isAdmin && (
                  <>
                    <label>Name on the review (optional)</label>
                    <input
                      placeholder="Anonymous"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </>
                )}
                <p className="empty">
                  {whiskey || "—"} · {picked?.name || "—"} · {score ?? "—"}/
                  {max}
                  {vibe != null ? ` · vibe ${vibe}` : ""}
                  {menuScore != null ? ` · menu ${menuScore}` : ""}
                </p>
              </>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              {step > 0 && (
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => {
                    setErr("");
                    setStep((s) => s - 1);
                  }}
                >
                  ← Back
                </button>
              )}
              {step < STEPS.length - 1 && (
                <button type="button" className="btn" onClick={next}>
                  Next →
                </button>
              )}
              {step === STEPS.length - 1 && (
                <button disabled={busy} className="btn">
                  {busy ? "Pouring…" : "Post the review"}
                </button>
              )}
            </div>
            {err && <p className="form-err">{err}</p>}
            <button
              type="button"
              className="back-link"
              style={{ alignSelf: "flex-start" }}
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
