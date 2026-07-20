"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import { canTrim, getVideoDuration, trimVideo } from "../../../lib/trimVideo";

const STEPS = ["media", "rate", "spot", "post"];
const MAX_CLIP_SECONDS = 90;

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

  // trim stage
  const [videoURL, setVideoURL] = useState(null);
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [busyMsg, setBusyMsg] = useState("");
  const previewRef = useRef(null);

  // ratings + whiskey
  const [whiskey, setWhiskey] = useState("");
  const [score, setScore] = useState(null);
  const [vibe, setVibe] = useState(null);
  const [menuScore, setMenuScore] = useState(null);

  // spot
  const [places, setPlaces] = useState([]);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState(null); // {id,name} or {custom:true,name}
  const [location, setLocation] = useState("");

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
    if (!video) {
      setVideoURL(null);
      setDuration(0);
      setTrimStart(0);
      setTrimEnd(0);
      return;
    }
    const url = URL.createObjectURL(video);
    setVideoURL(url);
    getVideoDuration(video)
      .then((d) => {
        setDuration(d);
        setTrimStart(0);
        setTrimEnd(Math.min(d, MAX_CLIP_SECONDS));
      })
      .catch(() => setErr("Couldn't read that video — try a different file."));
    return () => URL.revokeObjectURL(url);
  }, [video]);

  // Keep the preview player inside the selected range
  useEffect(() => {
    const v = previewRef.current;
    if (!v) return;
    const clamp = () => {
      if (v.currentTime < trimStart - 0.3 || v.currentTime > trimEnd)
        v.currentTime = trimStart;
    };
    v.addEventListener("timeupdate", clamp);
    return () => v.removeEventListener("timeupdate", clamp);
  }, [trimStart, trimEnd, videoURL]);

  const fmt = (s) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const clipLen = Math.max(0, trimEnd - trimStart);
  // Every video goes through the clip stage (normalizes size + codec);
  // only skipped when the browser can't process video at all.
  const needsTrim = duration > 0 && canTrim();
  const estMB = needsTrim
    ? ((3_500_000 + 128_000) / 8 / 1024 / 1024) * clipLen
    : video
    ? video.size / 1024 / 1024
    : 0;

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

  const videoInputRef = useRef(null);
  const picInputRef = useRef(null);

  const tileStyle = {
    border: "2px dashed var(--brass)",
    borderRadius: 14,
    background: "var(--paper)",
    padding: "1.4rem 1rem",
    width: "100%",
    textAlign: "center",
    cursor: "pointer",
    color: "var(--maroon-deep)",
    fontFamily: "inherit",
    fontSize: "1rem",
  };
  const mediaActionsStyle = {
    display: "flex",
    gap: 12,
    alignItems: "center",
    fontSize: ".9rem",
  };

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
    if (step === 0 && video && clipLen > MAX_CLIP_SECONDS)
      return setErr(
        `Clips max out at ${MAX_CLIP_SECONDS} seconds — tighten the trim.`
      );
    if (step === 0 && video && clipLen < 1)
      return setErr("That clip is under a second — widen the trim.");
    if (step === 1) {
      if (!whiskey.trim()) return setErr("Name the whiskey.");
      if (score == null) return setErr("Give it a score.");
    }
    if (step === 2 && !picked) return setErr("Pick or name the spot.");
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  // Races a promise against a size-scaled time budget so a stalled upload
  // fails with a clear message instead of leaving "Pouring…" spinning
  // forever — this is the main fix for submissions that used to just hang.
  function withTimeout(promise, ms, message) {
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
  }

  async function uploadTo(bucket, file) {
    const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `${Date.now()}-${safe}`;
    // Min 30s, ~3.5s/MB — generous even on a slow mobile connection.
    const budgetMs = Math.max(30_000, (file.size / (1024 * 1024)) * 3500);
    const { error } = await withTimeout(
      supabase.storage
        .from(bucket)
        .upload(path, file, { contentType: file.type || undefined }),
      budgetMs,
      "Upload is taking too long — check your connection and try again."
    );
    if (error) throw error;
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }

  // Tries R2 (presigned direct upload) first; on any failure falls back
  // to Supabase storage, which fits because the clip stage caps size.
  // R2 has been unreliable from the browser (CORS) — the PUT is given a
  // short leash so a hung/rejected request fails fast and the reliable
  // Supabase fallback kicks in quickly instead of the submission stalling.
  const SUPA_LIMIT = 48 * 1024 * 1024;
  async function uploadVideo(file) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    try {
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
      if (!res.ok) throw new Error("presign unavailable");
      const { uploadUrl, publicUrl } = await res.json();

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15_000);
      let put;
      try {
        put = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type || "video/mp4" },
          body: file,
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timer);
      }
      if (!put.ok) throw new Error(`R2 rejected the upload (${put.status})`);
      return publicUrl;
    } catch (e) {
      // R2 unavailable (config or CORS) — Supabase handles clips ≤ ~48 MB
      console.warn("R2 upload failed, falling back to Supabase storage:", e);
      if (file.size > SUPA_LIMIT)
        throw new Error(
          "Upload service hiccuped and this clip is too big for the backup route — trim it a bit shorter and try again."
        );
      return uploadTo("gabby-videos", file);
    }
  }

  const wakeLockRef = useRef(null);
  async function acquireWakeLock() {
    try {
      if ("wakeLock" in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
      }
    } catch {
      // Best-effort — some browsers restrict this silently; not fatal.
      // Without it, a screen lock mid-trim/upload can pause the <video>
      // element and stall the whole submission on longer clips.
    }
  }
  function releaseWakeLock() {
    wakeLockRef.current?.release().catch(() => {});
    wakeLockRef.current = null;
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    await acquireWakeLock();
    try {
      let videoUrl = null;
      let menuUrl = null;
      if (isAdmin && video) {
        let toUpload = video;
        if (needsTrim && canTrim()) {
          try {
            setBusyMsg("Trimming the clip…");
            const { blob, ext, mimeType } = await trimVideo(
              video,
              trimStart,
              trimEnd,
              (p) => setBusyMsg(`Trimming the clip… ${Math.round(p * 100)}%`)
            );
            toUpload = new File([blob], `clip.${ext}`, { type: mimeType });
          } catch (trimErr) {
            // Trim hiccuped — post the original rather than fail, if it fits.
            if (video.size <= 48 * 1024 * 1024) {
              toUpload = video;
            } else {
              throw new Error(
                `Couldn't process the clip on this device (${
                  trimErr.message || "trim failed"
                }) and the original is too big to send raw — try a shorter/smaller video.`
              );
            }
          }
        }
        setBusyMsg("Uploading the video…");
        videoUrl = await uploadVideo(toUpload);
        setBusyMsg("");
      }
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
        location: location.trim() || null,
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
      setBusyMsg("");
      releaseWakeLock();
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
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      style={{ display: "none" }}
                      onChange={(e) => setVideo(e.target.files?.[0] || null)}
                    />
                    {!video && (
                      <button
                        type="button"
                        style={tileStyle}
                        onClick={() => videoInputRef.current?.click()}
                      >
                        <span style={{ fontSize: "1.6rem", display: "block" }}>
                          🎬
                        </span>
                        <strong>Add the video</strong>
                        <span
                          className="script-sub"
                          style={{ display: "block", marginTop: 4 }}
                        >
                          the review itself — required
                        </span>
                      </button>
                    )}
                    {video && videoURL && (
                      <div className="stack" style={{ gap: 8 }}>
                        <video
                          ref={previewRef}
                          src={videoURL}
                          controls
                          playsInline
                          preload="metadata"
                          style={{
                            maxWidth: 320,
                            width: "100%",
                            borderRadius: 10,
                            border: "2px solid var(--maroon-deep)",
                          }}
                        />
                        {duration > 0 && (
                          <>
                            <label>
                              Clip: {fmt(trimStart)} – {fmt(trimEnd)}{" "}
                              <strong className="score-echo">
                                ({Math.round(clipLen)}s)
                              </strong>{" "}
                              · ~{estMB.toFixed(0)} MB
                              {clipLen > MAX_CLIP_SECONDS
                                ? ` — max ${MAX_CLIP_SECONDS}s`
                                : ""}
                            </label>
                            <label style={{ fontWeight: "normal" }}>
                              Start
                            </label>
                            <input
                              type="range"
                              min={0}
                              max={duration}
                              step={0.5}
                              value={trimStart}
                              onChange={(e) => {
                                const v = Math.min(
                                  Number(e.target.value),
                                  trimEnd - 1
                                );
                                setTrimStart(Math.max(0, v));
                                if (previewRef.current)
                                  previewRef.current.currentTime = v;
                              }}
                            />
                            <label style={{ fontWeight: "normal" }}>End</label>
                            <input
                              type="range"
                              min={0}
                              max={duration}
                              step={0.5}
                              value={trimEnd}
                              onChange={(e) => {
                                const v = Math.max(
                                  Number(e.target.value),
                                  trimStart + 1
                                );
                                setTrimEnd(Math.min(duration, v));
                                if (previewRef.current)
                                  previewRef.current.currentTime = Math.max(
                                    trimStart,
                                    v - 2
                                  );
                              }}
                            />
                            {!canTrim() && (
                              <p className="form-err">
                                This browser can&apos;t trim — the full video
                                will upload as-is (must be under ~48 MB).
                              </p>
                            )}
                            {clipLen > 15 && (
                              <p className="empty">
                                Longer clips take a minute or two to process —
                                keep this tab open and your screen on until it
                                posts.
                              </p>
                            )}
                          </>
                        )}
                        <div style={mediaActionsStyle}>
                          <button
                            type="button"
                            className="back-link"
                            onClick={() => videoInputRef.current?.click()}
                          >
                            swap video
                          </button>
                          <button
                            type="button"
                            className="back-link"
                            onClick={() => setVideo(null)}
                          >
                            remove
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <input
                  ref={picInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => setMenuPic(e.target.files?.[0] || null)}
                />
                {!menuPic && (
                  <button
                    type="button"
                    style={tileStyle}
                    onClick={() => picInputRef.current?.click()}
                  >
                    <span style={{ fontSize: "1.6rem", display: "block" }}>
                      📷
                    </span>
                    <strong>Add a menu pic</strong>
                    <span
                      className="script-sub"
                      style={{ display: "block", marginTop: 4 }}
                    >
                      {isAdmin ? "optional" : "optional but loved"}
                    </span>
                  </button>
                )}
                {menuPic && menuPicPreview && (
                  <div className="stack" style={{ gap: 8 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={menuPicPreview}
                      alt="Menu preview"
                      style={{
                        maxWidth: 220,
                        borderRadius: 10,
                        border: "2px solid var(--maroon-deep)",
                        boxShadow: "4px 4px 0 var(--brass)",
                      }}
                    />
                    <div style={mediaActionsStyle}>
                      <button
                        type="button"
                        className="back-link"
                        onClick={() => picInputRef.current?.click()}
                      >
                        swap pic
                      </button>
                      <button
                        type="button"
                        className="back-link"
                        onClick={() => setMenuPic(null)}
                      >
                        remove
                      </button>
                    </div>
                  </div>
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
                <label>Location (optional)</label>
                <input
                  placeholder="e.g. at the bar, patio, upstairs"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
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
                  {whiskey || "—"} · {picked?.name || "—"}
                  {location.trim() ? ` (${location.trim()})` : ""} ·{" "}
                  {score ?? "—"}/{max}
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
                  Back
                </button>
              )}
              {step < STEPS.length - 1 && (
                <button type="button" className="btn" onClick={next}>
                  Next
                </button>
              )}
              {step === STEPS.length - 1 && (
                <button disabled={busy} className="btn">
                  {busy ? busyMsg || "Pouring…" : "Post the review"}
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
