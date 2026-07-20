"use client";

// My profile: edit public identity (display name, @handle, bio, avatar)
// and manage my own pours. Public face of this data lives at /u/[handle].

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../auth-context";
import AuthChip from "../auth-chip";

const HANDLE_RE = /^[a-z0-9_]{3,20}$/;

export default function ProfilePage() {
  const auth = useAuth();
  const { session, profile, openLogin, refreshProfile, signOut } = auth || {};

  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const [pours, setPours] = useState(null);

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.display_name || "");
    setHandle(profile.handle || "");
    setBio(profile.bio || "");
  }, [profile]);

  useEffect(() => {
    if (!supabase || !session) return;
    supabase
      .from("user_reviews")
      .select(
        "id, whiskey_name, bar_text, rating, status, created_at, places ( name )"
      )
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setPours(data || []));
  }, [session]);

  async function save(e) {
    e.preventDefault();
    setErr("");
    setMsg("");
    const h = handle.trim().toLowerCase();
    if (!HANDLE_RE.test(h))
      return setErr(
        "Handles are 3–20 characters: lowercase letters, numbers, underscores."
      );
    setBusy(true);
    try {
      let avatar_url;
      if (avatarFile) {
        const ext = (avatarFile.name.split(".").pop() || "jpg")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");
        const path = `avatars/${session.user.id}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("review-media")
          .upload(path, avatarFile, {
            contentType: avatarFile.type || undefined,
          });
        if (upErr) throw upErr;
        avatar_url = supabase.storage.from("review-media").getPublicUrl(path)
          .data.publicUrl;
      }
      const patch = {
        display_name: displayName.trim() || h,
        handle: h,
        bio: bio.trim() || null,
      };
      if (avatar_url) patch.avatar_url = avatar_url;
      const { error } = await supabase
        .from("profiles")
        .update(patch)
        .eq("id", session.user.id);
      if (error) {
        throw new Error(
          /duplicate|unique/i.test(error.message)
            ? "That handle's taken — try another."
            : error.message
        );
      }
      await refreshProfile();
      setAvatarFile(null);
      setMsg("Saved.");
    } catch (e2) {
      setErr(e2.message || String(e2));
    } finally {
      setBusy(false);
    }
  }

  async function deletePour(id) {
    if (!window.confirm("Pour this one out for good?")) return;
    const { error } = await supabase
      .from("user_reviews")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);
    if (!error) setPours((p) => p.filter((r) => r.id !== id));
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
            <AuthChip />
          </nav>
        </div>
      </div>

      <main className="container upload-wrap">
        <span className="script-sub">your spot at the bar</span>
        <h1 className="upload-title">My profile</h1>

        {!supabase && <p className="empty">Database not configured.</p>}

        {supabase && !session && (
          <div className="upload-card">
            <p>Sign in to set up your profile and manage your pours.</p>
            <button type="button" className="btn" onClick={openLogin}>
              Text me a code
            </button>
          </div>
        )}

        {session && (
          <>
            <form onSubmit={save} className="upload-card stack">
              <div className="profile-avatar-row">
                {avatarFile ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={URL.createObjectURL(avatarFile)}
                    alt=""
                    className="profile-avatar-lg"
                  />
                ) : profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="profile-avatar-lg"
                  />
                ) : (
                  <span className="profile-avatar-lg profile-avatar-empty">
                    {(displayName || handle || "?").charAt(0).toUpperCase()}
                  </span>
                )}
                <label className="avatar-pick">
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  />
                  {profile?.avatar_url || avatarFile
                    ? "swap photo"
                    : "add a photo"}
                </label>
              </div>

              <label>Display name</label>
              <input
                type="text"
                value={displayName}
                maxLength={40}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <label>Handle</label>
              <input
                type="text"
                value={handle}
                maxLength={20}
                placeholder="whiskey_wes"
                onChange={(e) => setHandle(e.target.value)}
                required
              />
              <label>Bio</label>
              <textarea
                value={bio}
                maxLength={200}
                rows={3}
                placeholder="Rye loyalist. Ice negotiable."
                onChange={(e) => setBio(e.target.value)}
              />
              <button disabled={busy} className="btn">
                {busy ? "Saving…" : "Save"}
              </button>
              {profile?.handle && (
                <p className="empty">
                  Your public page:{" "}
                  <Link href={`/u/${profile.handle}`} className="back-link">
                    /u/{profile.handle}
                  </Link>
                </p>
              )}
              {msg && <p className="script-sub">{msg}</p>}
              {err && <p className="form-err">{err}</p>}
            </form>

            <section className="upload-card stack" style={{ marginTop: 18 }}>
              <span className="script-sub">my pours</span>
              {pours === null && <p className="empty">Pouring…</p>}
              {pours && pours.length === 0 && (
                <p className="empty">
                  Nothing yet.{" "}
                  <Link href="/gabbys-corner/review" className="back-link">
                    Add your first pour →
                  </Link>
                </p>
              )}
              {pours &&
                pours.map((r) => (
                  <div key={r.id} className="pour-row">
                    <div>
                      <strong>{r.whiskey_name}</strong>
                      <span className="pour-meta">
                        {" "}
                        · {r.places?.name || r.bar_text || "somewhere"} ·{" "}
                        {Number(r.rating)}/5
                        {r.status !== "live" && ` · ${r.status}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="back-link pour-delete"
                      onClick={() => deletePour(r.id)}
                    >
                      pour it out
                    </button>
                  </div>
                ))}
            </section>

            <p style={{ marginTop: "1.6rem" }}>
              <button type="button" className="back-link" onClick={signOut}>
                sign out
              </button>
            </p>
          </>
        )}

        <p style={{ marginTop: "1rem" }}>
          <Link href="/gabbys-corner" className="back-link">
            ← back to Gabby&apos;s Corner
          </Link>
        </p>
      </main>
    </>
  );
}
