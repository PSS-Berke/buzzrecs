import Link from "next/link";
import { getUnifiedFeed } from "../../lib/supabase";
import WhiskeyGlass from "../whiskey-glass";
import SocialFeed from "../social-feed";
import AuthChip from "../auth-chip";
import CityChip from "../city-chip";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gabby's Corner — BuzzRecs",
  description: "Gabby's whiskey reviews from Chicago's best bars.",
};

export default async function GabbysCorner() {
  const feed = (await getUnifiedFeed()) || [];
  const featured = feed.find((i) => i.kind === "gabby") || null;
  const rest = feed.filter((i) => i !== featured);

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
            <CityChip />
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

        <SocialFeed featured={featured} items={rest} />

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
