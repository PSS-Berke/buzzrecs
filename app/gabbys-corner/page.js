import Link from "next/link";
import { getGabbysReviews, getUserReviews } from "../../lib/supabase";
import WhiskeyGlass from "../whiskey-glass";
import ReviewCarousel from "../review-carousel";
import AuthChip from "../auth-chip";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gabby's Corner — BuzzRecs",
  description: "Gabby's whiskey reviews from Chicago's best bars.",
};

export default async function GabbysCorner() {
  const [reviews, communityReviews] = await Promise.all([
    getGabbysReviews(),
    getUserReviews(),
  ]);

  const gabbyItems = (reviews || []).map((r) => ({
    id: r.id,
    title: r.places?.name ?? r.bar_text ?? r.whiskey_name,
    subtitle: [r.whiskey_name, r.places?.neighborhood].filter(Boolean).join(" · "),
    byline: "Gabby's call",
    mediaType: r.video_url ? "video" : r.menu_photo_url ? "image" : null,
    mediaUrl: r.video_url || r.menu_photo_url || null,
    rating: Number(r.rating),
    ratingOutOf: 10,
    vibe: r.rating_vibe != null ? Number(r.rating_vibe) : null,
    menu: r.rating_menu != null ? Number(r.rating_menu) : null,
    notes: r.notes,
  }));

  const communityItems = (communityReviews || []).map((r) => ({
    id: r.id,
    title: r.whiskey_name,
    subtitle: [r.places?.name ?? r.bar_text ?? "somewhere in Chicago", r.places?.neighborhood]
      .filter(Boolean)
      .join(" · "),
    byline: r.profiles?.display_name || "Anonymous",
    mediaType: r.menu_photo_url ? "image" : null,
    mediaUrl: r.menu_photo_url || null,
    rating: Number(r.rating),
    ratingOutOf: 5,
    vibe: r.rating_vibe != null ? Number(r.rating_vibe) : null,
    menu: r.rating_menu != null ? Number(r.rating_menu) : null,
    notes: r.body,
  }));

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
            <span className="city">Chicago</span>
            <Link href="/map" className="map-link">
              The Map
            </Link>
            <AuthChip />
          </nav>
        </div>
      </div>

      <main className="container">
        <section className="gabby-hero">
          <div className="txt">
            <span className="script-sub">neat, with one big cube</span>
            <h1>Gabby&apos;s Corner</h1>
            <p className="dek">
              One whiskey, one bar, one honest rating at a time. Gabby drinks
              her way through Chicago&apos;s back bars so you know exactly what
              to order — and where to order it.
            </p>
            <div className="gabby-actions">
              <Link href="/gabbys-corner/review" className="gabby-link">
                add your pour
              </Link>
            </div>
          </div>
          <WhiskeyGlass />
        </section>

        {communityItems.length > 0 && (
          <ReviewCarousel items={communityItems} tone="club" />
        )}

        {gabbyItems.length > 0 && (
          <ReviewCarousel items={gabbyItems} tone="maroon" />
        )}

        <p style={{ marginTop: "2rem" }}>
          <Link href="/" className="back-link">
            ← back to the happy hours
          </Link>
        </p>

        <footer className="site">
          <span>Drink responsibly. Rate ruthlessly.</span>
          <span className="fm">— Gabby</span>
        </footer>
      </main>
    </>
  );
}
