import Link from "next/link";
import { getPlacesWithHappyHours, getPlacesWithPatios } from "../lib/supabase";
import Directory from "./directory";
import HomeBrowse from "./home-browse";
import Carousel from "./carousel";
import Splash from "./splash";
import CityChip from "./city-chip";
import MenuNav from "./menu-nav";

export const dynamic = "force-dynamic";

export default async function Home() {
  const places = await getPlacesWithHappyHours();
  const patios = await getPlacesWithPatios();
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
            <CityChip />
            <MenuNav />
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

        {places && <HomeBrowse happyPlaces={places} patioPlaces={patios} />}

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
