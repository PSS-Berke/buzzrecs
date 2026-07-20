// Patio "Open now" logic — the seasonal cousin of isHappyHourNow.
// A patio counts as OPEN if it's (a) in season for the current Chicago month
// and (b) within its daily hours (when hours are set). If no hours are set,
// being in season is enough to show the green "Open now" state.
//
// Day-string grammar is intentionally identical to happy_hours.days so the
// same 'Daily' / 'Mon-Fri' / 'Thu' / 'Mon, Wed' conventions carry over.

const DAY_ALIASES = {
  mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 0,
};

function parseDays(daysStr) {
  if (!daysStr) return [0, 1, 2, 3, 4, 5, 6]; // default: every day
  const s = daysStr.toLowerCase().trim();
  if (s === "daily") return [0, 1, 2, 3, 4, 5, 6];
  const range = s.match(/^([a-z]{3})[a-z]*\s*[-–]\s*([a-z]{3})/);
  if (range && range[1] in DAY_ALIASES && range[2] in DAY_ALIASES) {
    const start = DAY_ALIASES[range[1]];
    const end = DAY_ALIASES[range[2]];
    const days = [];
    let d = start;
    while (true) {
      days.push(d);
      if (d === end) break;
      d = (d + 1) % 7;
      if (days.length > 7) break;
    }
    return days;
  }
  return s
    .split(/[,&]/)
    .map((part) => DAY_ALIASES[part.trim().slice(0, 3)])
    .filter((d) => d !== undefined);
}

// Month window is inclusive and wraps across the new year (e.g. a heated patio
// open Nov–Mar would be season_start=11, season_end=3).
export function isInSeason(patio, now = new Date()) {
  const start = Number(patio?.season_start ?? 4);
  const end = Number(patio?.season_end ?? 10);
  let month;
  try {
    const chicago = new Date(
      now.toLocaleString("en-US", { timeZone: "America/Chicago" })
    );
    month = chicago.getMonth() + 1; // 1-12
  } catch {
    month = now.getMonth() + 1;
  }
  if (start <= end) return month >= start && month <= end;
  return month >= start || month <= end; // wraps the year
}

export function isPatioOpenNow(patio, now = new Date()) {
  if (!patio) return false;
  if (!isInSeason(patio, now)) return false;
  // No daily hours on file → in-season is enough.
  if (!patio.open_time || !patio.close_time) return true;
  try {
    const chicago = new Date(
      now.toLocaleString("en-US", { timeZone: "America/Chicago" })
    );
    if (!parseDays(patio.days).includes(chicago.getDay())) return false;
    const mins = chicago.getHours() * 60 + chicago.getMinutes();
    const [sh, sm] = patio.open_time.split(":").map(Number);
    const [eh, em] = patio.close_time.split(":").map(Number);
    const startMin = sh * 60 + sm;
    let endMin = eh * 60 + em;
    if (endMin <= startMin) endMin += 24 * 60; // past-midnight close
    const m = mins < startMin ? mins + 24 * 60 : mins;
    return m >= startMin && m <= endMin;
  } catch {
    return true;
  }
}

const MONTHS = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// "Apr–Oct" style label for the card.
export function seasonLabel(patio) {
  const start = Number(patio?.season_start ?? 4);
  const end = Number(patio?.season_end ?? 10);
  const abbr = (m) => MONTHS[m].slice(0, 3);
  return `${abbr(start)}–${abbr(end)}`;
}
