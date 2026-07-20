"use client";

// The "Chicago" chip in the topnav — click it to smooth-scroll down to the
// footer, on any page that renders it. A button (not a Link) since this
// scrolls within the current page rather than navigating anywhere.
export default function CityChip() {
  function flyToFooter() {
    const footer = document.querySelector("footer.site");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth", block: "end" });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  }

  return (
    <button type="button" className="city" onClick={flyToFooter}>
      Chicago
    </button>
  );
}
