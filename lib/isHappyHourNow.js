const DAY_ALIASES = {
  mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 0,
};

function parseDays(daysStr) {
  if (!daysStr) return [];
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

export function isHappyHourNow(hh, now = new Date()) {
  try {
    const chicago = new Date(
      now.toLocaleString("en-US", { timeZone: "America/Chicago" })
    );
    const day = chicago.getDay();
    if (!parseDays(hh.days).includes(day)) return false;
    if (!hh.start_time || !hh.end_time) return false;
    const mins = chicago.getHours() * 60 + chicago.getMinutes();
    const [sh, sm] = hh.start_time.split(":").map(Number);
    const [eh, em] = hh.end_time.split(":").map(Number);
    return mins >= sh * 60 + sm && mins <= eh * 60 + em;
  } catch {
    return false;
  }
}

export function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m ? `${h12}:${String(m).padStart(2, "0")} ${ampm}` : `${h12} ${ampm}`;
}
