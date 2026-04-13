// Weekly Torah Portion (Parashat HaShavua) - fetched from Hebcal API
// This ensures accuracy across all years including combined parashiyot

const parashaCache = {};

/**
 * Fetches the parasha for the week containing the given date from Hebcal API.
 * Returns { en: string, heb: string } or null.
 * @param {Date} date
 * @returns {Promise<{ en: string, heb: string } | null>}
 */
export async function fetchParasha(date) {
  const d = new Date(date);
  // Find the Saturday (Shabbat) of this week
  const day = d.getDay();
  const diff = (6 - day + 7) % 7;
  d.setDate(d.getDate() + diff);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const dayStr = String(d.getDate()).padStart(2, "0");
  const dateStr = `${year}-${month}-${dayStr}`;

  if (parashaCache[dateStr]) return parashaCache[dateStr];

  try {
    const url = `https://www.hebcal.com/shabbat?cfg=json&date=${dateStr}&m=50&lg=s&a=on`;
    const res = await fetch(url);
    const data = await res.json();
    const item = (data.items || []).find((i) => i.category === "parashat");
    if (!item) {
      parashaCache[dateStr] = null;
      return null;
    }
    // item.title is like "Parashat Tazria-Metzora", strip the prefix
    const en = item.title.replace(/^Parashat\s+/i, "").trim();
    const heb = item.hebrew || en;
    const result = { en, heb };
    parashaCache[dateStr] = result;
    return result;
  } catch {
    return null;
  }
}

/**
 * Returns true if the given date is a Shabbat (Saturday)
 */
export function isThisWeeksShabbat(date) {
  return date.getDay() === 6;
}