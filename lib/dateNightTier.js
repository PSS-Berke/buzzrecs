// Accolade tiers for the Date Night directory. A place is grouped into its
// single highest tier (stars first), but shows all its accolades as badges.

export const TIER_ORDER = [
  { key: "three", label: "Three Michelin Stars" },
  { key: "two", label: "Two Michelin Stars" },
  { key: "one", label: "One Michelin Star" },
  { key: "bib", label: "Bib Gourmand" },
  { key: "fifty", label: "World's 50 Best Bars" },
  { key: "nyt", label: "New York Times — Best of Chicago" },
];

export function tierKey(dn) {
  const s = Number(dn?.michelin_stars || 0);
  if (s === 3) return "three";
  if (s === 2) return "two";
  if (s === 1) return "one";
  if (dn?.bib_gourmand) return "bib";
  if (dn?.fifty_best) return "fifty";
  if (dn?.nyt) return "nyt";
  return "nyt";
}

export function accolades(dn) {
  const out = [];
  const s = Number(dn?.michelin_stars || 0);
  if (s > 0) out.push({ kind: "michelin", text: `${"★".repeat(s)} Michelin` });
  if (dn?.bib_gourmand) out.push({ kind: "bib", text: "Bib Gourmand" });
  if (dn?.fifty_best) out.push({ kind: "fifty", text: dn.fifty_best });
  if (dn?.nyt) out.push({ kind: "nyt", text: "NYT Best of Chicago" });
  return out;
}
