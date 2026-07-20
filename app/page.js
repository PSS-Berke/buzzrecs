import Link from "next/link";
import { getPlacesWithHappyHours } from "../lib/supabase";
import Directory from "./directory";
import Carousel from "./carousel";
import Splash from "./splash";
import AuthChip from "./auth-chip";

export const dynamic = "force-dynamic";

export default async function Home() {
  const places = await getPlacesWithHappyHours();
  const slides = (places || []).filter((p) => p.image_url);

  return (
    <>
      <Splash />
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="wordmark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-wordmark.png"
              alt="Buzz's Recs"
              className="wm-chip"
            />
          </div>
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
        <header className="hero">
          <span className="kicker">the happy hour directory</span>
          <h1>Leave work early. We&apos;ll tell you where.</h1>
          <p className="dek">
            Hand-picked happy hours across River North, West Loop, Gold Coast,
            Old Town, Lincoln Park, and the Loop — times, deals, menus, and
            reservations in one place.
          </p>
        </header>

        <Carousel slides={slides} />

        {!places && (
          <p className="empty">
            We&apos;re between pours — the database connection needs
            configuring. Check back shortly.
          </p>
        )}

        {places && <Directory places={places} />}

        <footer className="site">
          <span>Hours and deals change — always confirm with the venue.</span>
          <Link href="/beginning" className="fm">
            Chicago is just the beginning…
          </Link>
        </footer>
      </main>
    </>
  );
}
