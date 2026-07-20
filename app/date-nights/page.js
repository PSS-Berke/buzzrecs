import Link from "next/link";
import AuthChip from "../auth-chip";
import CityChip from "../city-chip";
import MenuNav from "../menu-nav";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Date Nights · Buzz's Recs",
  description: "Chicago's most date-worthy tables — coming soon to Buzz's Recs.",
};

export default function DateNights() {
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
            <AuthChip />
          </nav>
        </div>
      </div>

      <main className="container">
        <header className="hero soon-hero">
          <span className="kicker">the date-night directory</span>
          <h1>Table for two, coming soon.</h1>
          <p className="dek">
            The most date-worthy rooms in Chicago — low light, a good bottle,
            and a table you&apos;ll want to linger at. We&apos;re still tasting
            our way through the candidates. Check back soon.
          </p>
          <div className="soon-actions">
            <Link href="/" className="back-link">← happy hours</Link>
            <Link href="/patios" className="back-link">patios →</Link>
          </div>
        </header>
      </main>
    </>
  );
}
