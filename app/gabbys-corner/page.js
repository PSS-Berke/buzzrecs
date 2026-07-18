import Link from "next/link";
import { getGabbysReviews, getUserReviews } from "../../lib/supabase";
import WhiskeyGlass from "../whiskey-glass";

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
              <Link href="/" className="back-link">
                ← back to the happy hours
              </Link>
            </div>
          </div>
          <WhiskeyGlass />
        </section>

        {(!reviews || reviews.length === 0) && (
          <div className="gabby-empty">
            <div className="script-sub">the glass is poured…</div>
            <p>
              First reviews landing soon. Gabby is out doing very important
              research.
            </p>
          </div>
        )}

        {reviews && reviews.length > 0 && (
          <div className="review-grid">
            {reviews.map((r) => (
              <article className="review" key={r.id}>
                <div className="whiskey">
                  {r.places?.name ?? r.bar_text ?? r.whiskey_name}
                </div>
                {(r.whiskey_name || r.places?.neighborhood) && (
                  <div className="at">
                    {r.whiskey_name
                      ? `${r.whiskey_name}`
                      : ""}
                    {r.whiskey_name && r.places?.neighborhood ? " · " : ""}
                    {r.places?.neighborhood ?? ""}
                  </div>
                )}
                {r.video_url && (
                  <video controls preload="metadata" src={r.video_url} />
                )}
                {r.menu_photo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.menu_photo_url}
                    alt="The menu"
                    style={{ width: "100%", borderRadius: 10 }}
                  />
                )}
                <div className="rating-row">
                  <span className="rating-num">{Number(r.rating)}</span>
                  <span className="rating-outof">/ 10 — Gabby&apos;s call</span>
                </div>
                {(r.rating_vibe != null || r.rating_menu != null) && (
                  <div className="at">
                    {r.rating_vibe != null && `vibe ${Number(r.rating_vibe)}/10`}
                    {r.rating_vibe != null && r.rating_menu != null && " · "}
                    {r.rating_menu != null && `menu ${Number(r.rating_menu)}/10`}
                  </div>
                )}
                {r.notes && <p className="desc">{r.notes}</p>}
              </article>
            ))}
          </div>
        )}

        <section className="gabby-hero" style={{ marginTop: "3rem" }}>
          <div className="txt">
            <span className="script-sub">from the bar stools</span>
            <h2>The community pours</h2>
            <p className="dek">
              Verified drinkers, real orders. Log in with your phone and add
              yours — no passwords, just a text.
            </p>
            <div className="gabby-actions">
              <Link href="/gabbys-corner/review" className="gabby-link">
                add your pour
              </Link>
            </div>
          </div>
        </section>

        {(!communityReviews || communityReviews.length === 0) && (
          <div className="gabby-empty">
            <div className="script-sub">the stools are empty…</div>
            <p>No community pours yet. Be the first one up.</p>
          </div>
        )}

        {communityReviews && communityReviews.length > 0 && (
          <div className="review-grid">
            {communityReviews.map((r) => (
              <article className="review" key={r.id}>
                <div className="whiskey">{r.whiskey_name}</div>
                <div className="at">
                  {r.places?.name ?? r.bar_text ?? "somewhere in Chicago"}
                  {r.places?.neighborhood ? ` · ${r.places.neighborhood}` : ""}
                </div>
                {r.menu_photo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.menu_photo_url}
                    alt="The menu"
                    style={{ width: "100%", borderRadius: 10 }}
                  />
                )}
                <div className="rating-row">
                  <span className="rating-num">{Number(r.rating)}</span>
                  <span className="rating-outof">
                    / 5 — {r.profiles?.display_name || "Anonymous"}
                  </span>
                </div>
                {(r.rating_vibe != null || r.rating_menu != null) && (
                  <div className="at">
                    {r.rating_vibe != null && `vibe ${Number(r.rating_vibe)}/5`}
                    {r.rating_vibe != null && r.rating_menu != null && " · "}
                    {r.rating_menu != null && `menu ${Number(r.rating_menu)}/5`}
                  </div>
                )}
                {r.body && <p className="desc">{r.body}</p>}
              </article>
            ))}
          </div>
        )}

        <footer className="site">
          <span>Drink responsibly. Rate ruthlessly.</span>
          <span className="fm">— Gabby</span>
        </footer>
      </main>
    </>
  );
}
