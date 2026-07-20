import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProfileByHandle,
  getReviewsByProfile,
} from "../../../lib/supabase";
import ReviewCarousel from "../../review-carousel";
import AuthChip from "../../auth-chip";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  return {
    title: `@${params.handle} — BuzzRecs`,
    description: `@${params.handle}'s whiskey pours on BuzzRecs.`,
  };
}

export default async function PublicProfile({ params }) {
  const profile = await getProfileByHandle(params.handle);
  if (!profile) notFound();

  const reviews = (await getReviewsByProfile(profile.id)) || [];

  const items = reviews.map((r) => ({
    id: r.id,
    title: r.whiskey_name,
    subtitle: [
      r.places?.name ?? r.bar_text ?? "somewhere in Chicago",
      r.places?.neighborhood,
    ]
      .filter(Boolean)
      .join(" · "),
    byline: null,
    mediaType: r.menu_photo_url ? "image" : null,
    mediaUrl: r.menu_photo_url || null,
    rating: Number(r.rating),
    ratingOutOf: 5,
    vibe: r.rating_vibe != null ? Number(r.rating_vibe) : null,
    menu: r.rating_menu != null ? Number(r.rating_menu) : null,
    notes: r.body,
  }));

  const count = reviews.length;
  const avg = count
    ? (reviews.reduce((s, r) => s + Number(r.rating), 0) / count).toFixed(1)
    : null;
  const hauntCounts = {};
  for (const r of reviews) {
    const name = r.places?.name || r.bar_text;
    if (name) hauntCounts[name] = (hauntCounts[name] || 0) + 1;
  }
  const haunt =
    Object.entries(hauntCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

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

      <main className="container">
        <section className="gabby-hero u-hero">
          <div className="txt">
            <span className="script-sub">regular at the rail</span>
            <h1 className="u-name">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="profile-avatar-lg u-avatar"
                />
              ) : (
                <span className="profile-avatar-lg profile-avatar-empty u-avatar">
                  {(profile.display_name || profile.handle)
                    .charAt(0)
                    .toUpperCase()}
                </span>
              )}
              {profile.display_name || `@${profile.handle}`}
            </h1>
            <p className="u-handle">@{profile.handle}</p>
            {profile.bio && <p className="dek">{profile.bio}</p>}
            <div className="u-stats">
              <span>
                <strong>{count}</strong> pour{count === 1 ? "" : "s"}
              </span>
              {avg && (
                <span>
                  <strong>{avg}</strong>/5 average
                </span>
              )}
              {haunt && (
                <span>
                  usual haunt: <strong>{haunt}</strong>
                </span>
              )}
            </div>
          </div>
        </section>

        {items.length > 0 ? (
          <ReviewCarousel items={items} tone="club" />
        ) : (
          <p className="empty">No pours on the record yet.</p>
        )}

        <p style={{ marginTop: "2rem" }}>
          <Link href="/gabbys-corner" className="back-link">
            ← back to Gabby&apos;s Corner
          </Link>
        </p>
      </main>
    </>
  );
}
