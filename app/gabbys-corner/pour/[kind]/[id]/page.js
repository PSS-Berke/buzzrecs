import Link from "next/link";
import { notFound } from "next/navigation";
import { getSingleReview } from "../../../../../lib/supabase";
import SocialFeed from "../../../../social-feed";
import CityChip from "../../../../city-chip";
import MenuNav from "../../../../menu-nav";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const item = await getSingleReview(params.kind, params.id);
  if (!item) return { title: "Gabby's Corner — BuzzRecs" };
  const what = item.whiskey || item.venue || "a pour";
  const where = item.venue ? ` at ${item.venue}` : "";
  return {
    title: `${what}${where} — Gabby's Corner`,
    description: `${item.byline}'s call: ${item.rating}/${item.ratingOutOf}.`,
  };
}

export default async function PourPermalink({ params }) {
  const item = await getSingleReview(params.kind, params.id);
  if (!item) notFound();

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
            <MenuNav />
          </nav>
        </div>
      </div>

      <main className="container upload-wrap">
        <span className="script-sub">one for the record</span>
        <SocialFeed items={[item]} expandComments />
        <p style={{ marginTop: "1.6rem" }}>
          <Link href="/gabbys-corner" className="back-link">
            ← the whole corner
          </Link>
        </p>
      </main>
    </>
  );
}
