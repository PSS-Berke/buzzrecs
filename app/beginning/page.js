import Link from "next/link";
import WhiskeyGlass from "../whiskey-glass";

export const metadata = {
  title: "the beginning… — BuzzRecs",
  description: "Chicago is just the beginning.",
};

export default function Beginning() {
  return (
    <main className="beginning">
      <Link
        href="/gabbys-corner"
        className="corner-crest"
        aria-label="Open Gabby's Corner"
      >
        <WhiskeyGlass />
      </Link>
    </main>
  );
}
