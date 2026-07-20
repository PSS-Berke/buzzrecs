// Shared Happy Hour / Patio / Both icons — tavern line-art, transparent,
// stroke = currentColor so they recolor with their button's state.
// Accepts loose kind keys: happy|happy-hours, patio|patios, both.

export function CatIcon({ kind = "both", className = "cat-ico" }) {
  const k = String(kind).startsWith("happy")
    ? "happy"
    : String(kind).startsWith("patio")
    ? "patio"
    : "both";

  const common = {
    className,
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (k === "happy") {
    return (
      <svg {...common}>
        <path d="M11 15 L37 15 L24 30 Z" />
        <path d="M15 19 L33 19" />
        <path d="M24 30 L24 40" />
        <path d="M17 40 L31 40" />
        <path d="M31 15 L35 10" />
        <circle cx="35.5" cy="9.5" r="2.2" fill="currentColor" stroke="none" />
        <path d="M40 15 l0.9 2.6 2.6 0.9 -2.6 0.9 -0.9 2.6 -0.9 -2.6 -2.6 -0.9 2.6 -0.9 z" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (k === "patio") {
    return (
      <svg {...common}>
        {/* canopy */}
        <path d="M9 19 Q24 5 39 19" />
        <path d="M9 19 q3.75 4 7.5 0 q3.75 4 7.5 0 q3.75 4 7.5 0 q3.75 4 7.5 0" />
        {/* pole */}
        <path d="M24 19 L24 33" />
        {/* table */}
        <ellipse cx="24" cy="33" rx="7" ry="2.2" />
        <path d="M24 35 L24 39 M20 39 L28 39" />
        {/* chairs */}
        <path d="M12 33 L17 33 M12 33 L12 29 M12 33 L12 38 M17 33 L17 38" />
        <path d="M31 33 L36 33 M36 33 L36 29 M31 33 L31 38 M36 33 L36 38" />
        {/* sparkle */}
        <path d="M40 9 l0.8 2.4 2.4 0.8 -2.4 0.8 -0.8 2.4 -0.8 -2.4 -2.4 -0.8 2.4 -0.8 z" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  // both — umbrella over a martini
  return (
    <svg {...common}>
      <path d="M13 15 Q24 5 35 15" />
      <path d="M13 15 q2.75 3 5.5 0 q2.75 3 5.5 0 q2.75 3 5.5 0 q2.75 3 5.5 0" />
      <path d="M24 15 L24 21" />
      <path d="M16 22 L32 22 L24 33 Z" />
      <path d="M24 33 L24 41" />
      <path d="M18 41 L30 41" />
      <path d="M40 12 l0.8 2.4 2.4 0.8 -2.4 0.8 -0.8 2.4 -0.8 -2.4 -2.4 -0.8 2.4 -0.8 z" fill="currentColor" stroke="none" />
    </svg>
  );
}
