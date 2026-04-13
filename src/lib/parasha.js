// Weekly Torah Portion (Parashat HaShavua) - fetched from Hebcal API
// Uses the hebcal endpoint with s=on to get parasha for any specific Shabbat date

const parashaCache = {};

/**
 * Fetches the parasha for the week containing the given date.
 * Returns { en: string, heb: string } or null.
 * @param {Date} date
 */
export async function fetchParasha(date) {
  const d = new Date(date);
  // Find the Saturday (Shabbat) of this week
  const diff = (6 - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + diff);

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  if (parashaCache[dateStr] !== undefined) return parashaCache[dateStr];

  try {
    // Fetch the full month's parashiyot and find the one matching our Shabbat
    const url = `https://www.hebcal.com/hebcal?v=1&cfg=json&s=on&year=${year}&month=${month}&lg=s&maj=off&min=off&nx=off&mf=off&ss=off&mod=off`;
    const res = await fetch(url);
    const data = await res.json();

    const item = (data.items || []).find(
      (i) => i.category === "parashat" && i.date === dateStr
    );

    if (item) {
      const en = item.title.replace(/^Parashat\s+/i, "").trim();
      const heb = item.hebrew ? item.hebrew.replace(/^פרשת\s+/, "").trim() : en;
      const result = { en, heb };
      parashaCache[dateStr] = result;
      return result;
    }

    // If not found in that month (e.g. Shabbat is end of month, straddling), try next month too
    const d2 = new Date(d);
    d2.setDate(d2.getDate() + 7);
    if (d2.getMonth() !== d.getMonth()) {
      const url2 = `https://www.hebcal.com/hebcal?v=1&cfg=json&s=on&year=${d2.getFullYear()}&month=${d2.getMonth() + 1}&lg=s&maj=off&min=off&nx=off&mf=off&ss=off&mod=off`;
      const res2 = await fetch(url2);
      const data2 = await res2.json();
      const item2 = (data2.items || []).find(
        (i) => i.category === "parashat" && i.date === dateStr
      );
      if (item2) {
        const en = item2.title.replace(/^Parashat\s+/i, "").trim();
        const heb = item2.hebrew ? item2.hebrew.replace(/^פרשת\s+/, "").trim() : en;
        const result = { en, heb };
        parashaCache[dateStr] = result;
        return result;
      }
    }

    parashaCache[dateStr] = null;
    return null;
  } catch {
    parashaCache[dateStr] = null;
    return null;
  }
}

/**
 * Returns true if the given date is a Shabbat (Saturday)
 */
export function isThisWeeksShabbat(date) {
  return date.getDay() === 6;
}