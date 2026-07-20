"use client";

// Site-wide auth: one phone-OTP session shared by every page.
// Wraps the app (see layout.js); pages get to it via useAuth() and the
// topbar <AuthChip/>. The review wizard keeps its own inline login as a
// fallback but picks this session up automatically via supabase.auth.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../lib/supabase";

const AuthCtx = createContext(null);

export function useAuth() {
  return useContext(AuthCtx);
}

const normPhone = (p) => {
  const d = p.replace(/\D/g, "");
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d.startsWith("1")) return `+${d}`;
  return p.startsWith("+") ? p : `+${d}`;
};

const HANDLE_RE = /^[a-z0-9_]{3,20}$/;

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!supabase || !session) {
      setProfile(null);
      return null;
    }
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, handle, avatar_url, bio, is_admin")
      .eq("id", session.user.id)
      .maybeSingle();
    setProfile(data ?? null);
    return data ?? null;
  }, [session]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const value = {
    session,
    profile,
    isAdmin: !!profile?.is_admin,
    openLogin: () => setSheetOpen(true),
    closeLogin: () => setSheetOpen(false),
    refreshProfile,
    signOut,
  };

  return (
    <AuthCtx.Provider value={value}>
      {children}
      {sheetOpen && <LoginSheet />}
    </AuthCtx.Provider>
  );
}

// Phone → code → (first time) pick a handle. Reuses the wizard's card
// styling so it feels like the same bar.
function LoginSheet() {
  const { session, profile, closeLogin, refreshProfile } = useAuth();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const [handle, setHandle] = useState("");
  const [displayName, setDisplayName] = useState("");

  const needsOnboarding = session && profile && !profile.handle;

  useEffect(() => {
    if (profile?.display_name) setDisplayName(profile.display_name);
  }, [profile]);

  // Signed in and already onboarded → nothing left to do here.
  useEffect(() => {
    if (session && profile && profile.handle) closeLogin();
  }, [session, profile, closeLogin]);

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

  async function saveHandle(e) {
    e.preventDefault();
    setErr("");
    const h = handle.trim().toLowerCase();
    if (!HANDLE_RE.test(h))
      return setErr(
        "Handles are 3–20 characters: lowercase letters, numbers, underscores."
      );
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        handle: h,
        display_name: displayName.trim() || h,
      })
      .eq("id", session.user.id);
    setBusy(false);
    if (error) {
      return setErr(
        /duplicate|unique/i.test(error.message)
          ? "That handle's taken — try another."
          : error.message
      );
    }
    await refreshProfile();
    closeLogin();
  }

  return (
    <div className="sheet-overlay" onClick={closeLogin}>
      <div className="upload-card sheet-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="sheet-close"
          aria-label="Close"
          onClick={closeLogin}
        >
          ×
        </button>

        {!session && !codeSent && (
          <form onSubmit={sendCode} className="stack">
            <span className="script-sub">pull up a stool</span>
            <label>Phone number</label>
            <input
              type="tel"
              placeholder="(312) 555-0123"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              autoFocus
            />
            <button disabled={busy} className="btn">
              {busy ? "Sending…" : "Text me a code"}
            </button>
            <p className="empty">
              No passwords. We text you a 6-digit code, that&apos;s the whole
              login.
            </p>
          </form>
        )}

        {!session && codeSent && (
          <form onSubmit={verify} className="stack">
            <span className="script-sub">check your texts</span>
            <label>Enter the 6-digit code</label>
            <input
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              autoFocus
            />
            <button disabled={busy} className="btn">
              {busy ? "Checking…" : "Verify"}
            </button>
          </form>
        )}

        {needsOnboarding && (
          <form onSubmit={saveHandle} className="stack">
            <span className="script-sub">what do we call you?</span>
            <label>Pick a handle</label>
            <input
              type="text"
              placeholder="whiskey_wes"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              maxLength={20}
              required
              autoFocus
            />
            <label>Display name</label>
            <input
              type="text"
              placeholder="Wes"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={40}
            />
            <button disabled={busy} className="btn">
              {busy ? "Saving…" : "That's me"}
            </button>
            <p className="empty">
              Your handle is public on your pours. Your phone number never is.
            </p>
          </form>
        )}

        {session && profile === null && !needsOnboarding && (
          <p className="empty">Setting up your stool…</p>
        )}

        {err && <p className="form-err">{err}</p>}
      </div>
    </div>
  );
}
