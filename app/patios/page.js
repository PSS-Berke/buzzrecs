import Link from "next/link";
import { getPlacesWithPatios } from "../../lib/supabase";
import PatioDirectory from "./patio-directory";
import Carousel from "../carousel";
import CityChip from "../city-chip";
import MenuNav from "../menu-nav";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Patio Directory · Buzz's Recs",
  description:
    "Hand-picked Chicago patios, rooftops, and gardens — where to drink outside.",
};

export default async function Patios() {
  const places = await getPlacesWithPatios();
  const slides = (places || []).filter((p) => p.image_url);

  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="wordmark">
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-wordmark.png"
                alt="Buzz's Recs"
                className="wm-chip"
              />
            </Link>
          </div>
          <nav className="topnav">
            <CityChip />
            <MenuNav />
          </nav>
        </div>
      </div>

      <main className="container">
        <header className="hero">
          <span className="kicker">the patio directory</span>
          <h1>Good weather&apos;s wasting. Let&apos;s get you outside.</h1>
          <p className="dek">
            Rooftops, gardens, sidewalks, and riverwalk tables across River
            North, West Loop, Gold Coast, Old Town, Lincoln Park, the Loop, and
            Lakeview — sun, shade, heaters, and dogs welcome, all in one place.
          </p>
        </header>

        <Carousel slides={slides} />

        {!places && (
          <p className="empty">
            We&apos;re between pours — the database connection needs
            configuring. Check back shortly.
          </p>
        )}

        {places && places.length === 0 && (
          <p className="empty">
            No patios open yet — the collection is just being seeded. Pull up a
            chair shortly.
          </p>
        )}

        {places && places.length > 0 && <PatioDirectory places={places} />}

        <footer className="site">
          <span>Patio seasons and hours shift with the weather — always confirm with the venue.</span>
          <Link href="/beginning" className="fm">
            Chicago is just the beginning…
          </Link>
        </footer>
      </main>
    </>
  );
}
