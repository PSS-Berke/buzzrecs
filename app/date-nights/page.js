import Link from "next/link";
import { getPlacesWithDateNights } from "../../lib/supabase";
import DateNightDirectory from "./date-night-directory";
import CityChip from "../city-chip";
import MenuNav from "../menu-nav";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Date Nights · Buzz's Recs",
  description:
    "Chicago's most date-worthy tables — Michelin stars, Bib Gourmands, and the city's best bars, in one place.",
};

export default async function DateNights() {
  const places = await getPlacesWithDateNights();

  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <Link href="/" className="wordmark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-wordmark.png" alt="Buzz's Recs" className="wm-chip" />
          </Link>
          <nav className="topnav">
            <CityChip />
            <MenuNav />
          </nav>
        </div>
      </div>

      <main className="container">
        <header className="hero soon-hero">
          <span className="kicker">the date-night directory</span>
          <h1>Make it a night to remember.</h1>
          <p className="dek">
            Chicago&apos;s most decorated tables — every Michelin star and Bib
            Gourmand, the city&apos;s world-ranked bars, and the New York
            Times&apos; Chicago favorites — for when the occasion calls for it.
          </p>
        </header>

        {!places && (
          <p className="empty">
            We&apos;re setting the table — the database connection needs
            configuring. Check back shortly.
          </p>
        )}

        {places && places.length === 0 && (
          <p className="empty">
            The reservation book is still being written — check back soon.
          </p>
        )}

        {places && places.length > 0 && <DateNightDirectory places={places} />}

        <footer className="site">
          <span>Menus, prices, and stars change — always confirm with the venue.</span>
          <Link href="/beginning" className="fm">
            Chicago is just the beginning…
          </Link>
        </footer>
      </main>
    </>
  );
}
