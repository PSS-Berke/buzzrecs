"use client";

// The Gabby's Corner social feed: one vertical stream of pours.
// Gabby's posts wear maroon + the crest; community pours wear club green.
// Cheers + comments live here (tables: cheers, comments — polymorphic
// over review_kind gabby|community).

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { useAuth } from "./auth-context";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
function fmtDate(ts) {
  const d = new Date(ts);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

export default function SocialFeed({ featured, items, expandComments = false }) {
  const auth = useAuth();
  const session = auth?.session;
  const [myCheers, setMyCheers] = useState(() => new Set());

  const all = [...(featured ? [featured] : []), ...(items || [])];

  useEffect(() => {
    if (!supabase || !session || all.length === 0) return;
    supabase
      .from("cheers")
      .select("review_kind, review_id")
      .eq("user_id", session.user.id)
      .in("review_id", all.map((i) => i.id))
      .then(({ data }) =>
        setMyCheers(
          new Set((data || []).map((c) => `${c.review_kind}:${c.review_id}`))
        )
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (all.length === 0)
    return <p className="empty">No pours on the record yet. Be the first.</p>;

  return (
    <div className="feed">
      {featured && (
        <>
          <span className="script-sub feed-label">Gabby&apos;s latest call</span>
          <PostCard
            item={featured}
            featured
            myCheers={myCheers}
            setMyCheers={setMyCheers}
            expandComments={expandComments}
          />
          {items && items.length > 0 && (
            <span className="script-sub feed-label">meanwhile, at the rail…</span>
          )}
        </>
      )}
      {(items || []).map((item) => (
        <PostCard
          key={`${item.kind}:${item.id}`}
          item={item}
          myCheers={myCheers}
          setMyCheers={setMyCheers}
          expandComments={expandComments}
        />
      ))}
    </div>
  );
}

function PostCard({ item, featured, myCheers, setMyCheers, expandComments }) {
  const auth = useAuth();
  const { session, profile, openLogin } = auth || {};
  const k = `${item.kind}:${item.id}`;
  const cheered = myCheers.has(k);
  const [cheerCount, setCheerCount] = useState(item.cheers);
  const [commentCount, setCommentCount] = useState(item.comments);
  const [commentsOpen, setCommentsOpen] = useState(expandComments);
  const [busy, setBusy] = useState(false);

  const isGabby = item.kind === "gabby";
  const tone = isGabby ? "post-gabby" : "post-community";

  async function toggleCheer() {
    if (!session) return openLogin();
    if (busy) return;
    setBusy(true);
    try {
      if (cheered) {
        setCheerCount((c) => Math.max(0, c - 1));
        setMyCheers((s) => {
          const n = new Set(s);
          n.delete(k);
          return n;
        });
        await supabase
          .from("cheers")
          .delete()
          .eq("user_id", session.user.id)
          .eq("review_kind", item.kind)
          .eq("review_id", item.id);
      } else {
        setCheerCount((c) => c + 1);
        setMyCheers((s) => new Set(s).add(k));
        const { error } = await supabase.from("cheers").insert({
          user_id: session.user.id,
          review_kind: item.kind,
          review_id: item.id,
        });
        if (error && !/duplicate/i.test(error.message)) {
          setCheerCount((c) => Math.max(0, c - 1));
          setMyCheers((s) => {
            const n = new Set(s);
            n.delete(k);
            return n;
          });
        }
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className={`post-card ${tone}${featured ? " post-featured" : ""}`}>
      <header className="post-head">
        {item.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.avatarUrl} alt="" className="post-avatar" />
        ) : (
          <span className="post-avatar post-avatar-empty">
            {(item.byline || "?").replace("@", "").charAt(0).toUpperCase()}
          </span>
        )}
        <div className="post-who">
          {item.bylineHref ? (
            <Link href={item.bylineHref} className="post-byline">
              {item.byline}
            </Link>
          ) : (
            <span className="post-byline">{item.byline}</span>
          )}
          <span className="post-where">
            {[item.venue, item.neighborhood].filter(Boolean).join(" · ") ||
              "somewhere in Chicago"}
          </span>
        </div>
        <Link
          href={`/gabbys-corner/pour/${item.kind}/${item.id}`}
          className="post-time"
        >
          {fmtDate(item.ts)}
        </Link>
      </header>

      {item.mediaType === "video" && (
        <div className="post-media">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video controls preload="metadata" src={item.mediaUrl} playsInline />
        </div>
      )}
      {item.mediaType === "image" && (
        <div className="post-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.mediaUrl} alt="" />
        </div>
      )}

      <div className="post-body">
        <div className="post-title-row">
          <span className="post-whiskey">
            {item.whiskey || item.venue || "the house pour"}
          </span>
          <span className="post-rating">
            <strong>{item.rating}</strong>/{item.ratingOutOf}
          </span>
        </div>
        {(item.vibe != null || item.menu != null) && (
          <div className="post-subratings">
            {item.vibe != null && (
              <span>
                vibe {item.vibe}/{item.ratingOutOf}
              </span>
            )}
            {item.menu != null && (
              <span>
                menu {item.menu}/{item.ratingOutOf}
              </span>
            )}
          </div>
        )}
        {item.notes && <p className="post-notes">{item.notes}</p>}

        <div className="post-actions">
          <button
            type="button"
            className={`cheer-btn${cheered ? " on" : ""}`}
            onClick={toggleCheer}
          >
            cheers{cheerCount > 0 ? ` · ${cheerCount}` : ""}
          </button>
          <button
            type="button"
            className="comment-toggle"
            onClick={() => setCommentsOpen((o) => !o)}
          >
            {commentCount > 0
              ? `${commentCount} comment${commentCount === 1 ? "" : "s"}`
              : "leave a comment"}
          </button>
        </div>

        {commentsOpen && (
          <Comments
            item={item}
            session={session}
            profile={profile}
            openLogin={openLogin}
            onCountChange={setCommentCount}
          />
        )}
      </div>
    </article>
  );
}

function Comments({ item, session, profile, openLogin, onCountChange }) {
  const [comments, setComments] = useState(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("comments")
      .select(
        "id, user_id, body, created_at, profiles ( display_name, handle, avatar_url )"
      )
      .eq("review_kind", item.kind)
      .eq("review_id", item.id)
      .eq("status", "live")
      .order("created_at", { ascending: true })
      .limit(100);
    setComments(data || []);
    onCountChange((data || []).length);
  }, [item.kind, item.id, onCountChange]);

  useEffect(() => {
    load();
  }, [load]);

  async function post(e) {
    e.preventDefault();
    if (!session) return openLogin();
    const body = draft.trim();
    if (!body) return;
    setBusy(true);
    setErr("");
    const { error } = await supabase.from("comments").insert({
      user_id: session.user.id,
      review_kind: item.kind,
      review_id: item.id,
      body,
    });
    setBusy(false);
    if (error) {
      return setErr(
        /row-level security/i.test(error.message)
          ? "Easy there — that's plenty of commentary for one day."
          : error.message
      );
    }
    setDraft("");
    load();
  }

  async function remove(id) {
    await supabase
      .from("comments")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);
    load();
  }

  return (
    <div className="comments">
      {comments === null && <p className="empty">Listening in…</p>}
      {comments &&
        comments.map((c) => (
          <div key={c.id} className="comment">
            <span className="comment-who">
              {c.profiles?.handle ? (
                <Link href={`/u/${c.profiles.handle}`} className="post-byline">
                  @{c.profiles.handle}
                </Link>
              ) : (
                c.profiles?.display_name || "Anonymous"
              )}
            </span>
            <span className="comment-body">{c.body}</span>
            {session?.user?.id === c.user_id && (
              <button
                type="button"
                className="comment-delete"
                onClick={() => remove(c.id)}
                aria-label="Delete comment"
              >
                ×
              </button>
            )}
          </div>
        ))}
      <form onSubmit={post} className="comment-form">
        <input
          type="text"
          maxLength={500}
          placeholder={
            session ? "Add to the conversation…" : "Sign in to chime in…"
          }
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onFocus={() => {
            if (!session) openLogin();
            else if (profile && !profile.handle) openLogin();
          }}
        />
        <button disabled={busy || !draft.trim()} className="comment-send">
          {busy ? "…" : "say it"}
        </button>
      </form>
      {err && <p className="form-err">{err}</p>}
    </div>
  );
}
