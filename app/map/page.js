import Link from "next/link";
import { getPlacesWithHappyHours } from "../../lib/supabase";
import ChicagoMap from "./ChicagoMap";
import AuthChip from "../auth-chip";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Map — BuzzRecs",
  description:
    "A stylized map of every BuzzRecs happy hour spot across River North, West Loop, Gold Coast, Old Town, Lincoln Park, the Loop, and Lakeview.",
};

export default async function MapPage() {
  const places = await getPlacesWithHappyHours();

  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <Link href="/" className="wordmark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-wordmark.png" alt="Buzz's Recs" className="wm-chip" />
          </Link>
          <nav className="topnav">
            <span className="city">Chicago</span>
            <Link href="/gabbys-corner" className="gabby-link">
              Gabby&apos;s Corner
            </Link>
            <AuthChip />
          </nav>
        </div>
      </div>

      <main className="container">
        <header className="hero map-hero">
          <span className="kicker">every pour, plotted</span>
          <h1>The lay of the land.</h1>
          <p className="dek">
            Every spot on BuzzRecs, painted onto one tavern map — River North,
            West Loop, Gold Coast, Old Town, Lincoln Park, the Loop, and
            Lakeview.
          </p>
          <Link href="/" className="back-link">
            ← back to the happy hours
          </Link>
        </header>

        {!places && (
          <p className="empty">
            We&apos;re between pours — the database connection needs
            configuring. Check back shortly.
          </p>
        )}

        {places && <ChicagoMap places={places} />}

        <footer className="site">
          <span>Hours and deals change — always confirm with the venue.</span>
          <span className="fm">Chicago is just the beginning…</span>
        </footer>
      </main>
    </>
  );
}
