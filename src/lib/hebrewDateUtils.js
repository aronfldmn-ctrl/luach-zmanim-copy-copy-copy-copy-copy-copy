// Hebrew date conversion utilities (zmanim via Hebcal API)

const HEBREW_MONTHS = [
  "Nisan", "Iyar", "Sivan", "Tammuz", "Av", "Elul",
  "Tishrei", "Cheshvan", "Kislev", "Tevet", "Shevat", "Adar", "Adar II"
];

const HEBREW_MONTHS_HEB = [
  "ניסן", "אייר", "סיון", "תמוז", "אב", "אלול",
  "תשרי", "חשון", "כסלו", "טבת", "שבט", "אדר", "אדר ב׳"
];

const HEBREW_DAYS = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ז׳", "ח׳", "ט׳", "י׳",
  "י״א", "י״ב", "י״ג", "י״ד", "ט״ו", "ט״ז", "י״ז", "י״ח", "י״ט", "כ׳",
  "כ״א", "כ״ב", "כ״ג", "כ״ד", "כ״ה", "כ״ו", "כ״ז", "כ״ח", "כ״ט", "ל׳"];

function gregorianToJD(year, month, day) {
  if (month <= 2) { year -= 1; month += 12; }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

function hebrewEpoch() { return 347995.5; }
function isHebrewLeapYear(year) { return ((7 * year + 1) % 19) < 7; }
function hebrewMonthsInYear(year) { return isHebrewLeapYear(year) ? 13 : 12; }

function hebrewDelay1(year) {
  const months = Math.floor((235 * year - 234) / 19);
  const parts = 12084 + 13753 * months;
  let day = months * 29 + Math.floor(parts / 25920);
  if ((3 * (day + 1)) % 7 < 3) day += 1;
  return day;
}

function hebrewDelay2(year) {
  const last = hebrewDelay1(year - 1);
  const present = hebrewDelay1(year);
  const next = hebrewDelay1(year + 1);
  if (next - present === 356) return 2;
  if (present - last === 382) return 1;
  return 0;
}

function hebrewYearDays(year) {
  return hebrewToJD(year + 1, 7, 1) - hebrewToJD(year, 7, 1);
}

function hebrewMonthDays(year, month) {
  if (month === 2 || month === 4 || month === 6 || month === 10 || month === 13) return 29;
  if (month === 12 && !isHebrewLeapYear(year)) return 29;
  if (month === 8 && hebrewYearDays(year) % 10 !== 5) return 29;
  if (month === 9 && hebrewYearDays(year) % 10 === 3) return 29;
  return 30;
}

function hebrewToJD(year, month, day) {
  const months = hebrewMonthsInYear(year);
  let jd = hebrewEpoch() + hebrewDelay1(year) + hebrewDelay2(year) + day + 1;
  if (month < 7) {
    for (let m = 7; m <= months; m++) jd += hebrewMonthDays(year, m);
    for (let m = 1; m < month; m++) jd += hebrewMonthDays(year, m);
  } else {
    for (let m = 7; m < month; m++) jd += hebrewMonthDays(year, m);
  }
  return jd;
}

function jdToHebrew(jd) {
  jd = Math.floor(jd) + 0.5;
  const count = Math.floor(((jd - hebrewEpoch()) * 98496) / 35975351);
  let year = count - 1;
  for (let i = count; jd >= hebrewToJD(i, 7, 1); i++) year = i;
  let first = (jd < hebrewToJD(year, 1, 1)) ? 7 : 1;
  let month = first;
  for (let m = first; jd > hebrewToJD(year, m, hebrewMonthDays(year, m)); m++) month = m + 1;
  const day = Math.floor(jd - hebrewToJD(year, month, 1)) + 1;
  return { year, month, day };
}

function gregorianToHebrew(year, month, day) {
  const jd = gregorianToJD(year, month, day);
  return jdToHebrew(jd);
}

export function getHebrewDate(date) {
  const result = gregorianToHebrew(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const monthIdx = result.month - 1;
  return {
    day: result.day,
    month: result.month,
    year: result.year,
    dayHeb: HEBREW_DAYS[result.day - 1] || String(result.day),
    monthName: HEBREW_MONTHS[monthIdx] || "",
    monthNameHeb: HEBREW_MONTHS_HEB[monthIdx] || "",
    displayEn: `${result.day} ${HEBREW_MONTHS[monthIdx] || ""} ${result.year}`,
    displayHeb: `${HEBREW_DAYS[result.day - 1] || result.day} ${HEBREW_MONTHS_HEB[monthIdx] || ""} ${result.year}`
  };
}

// Format an ISO datetime string to 12-hour time (always stores seconds)
// Parses the time component directly from the ISO string to avoid timezone shifts
export function isoToTime(isoStr) {
  if (!isoStr) return "—";
  // Match "T HH:MM:SS" from ISO string, ignoring timezone offset
  const match = isoStr.match(/T(\d{2}):(\d{2}):(\d{2})/);
  if (!match) {
    // fallback for strings without seconds
    const match2 = isoStr.match(/T(\d{2}):(\d{2})/);
    if (!match2) return "—";
    let h = parseInt(match2[1]);
    const m = parseInt(match2[2]);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m.toString().padStart(2, '0')}:00 ${ampm}`;
  }
  let h = parseInt(match[1]);
  const m = parseInt(match[2]);
  const s = parseInt(match[3]);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} ${ampm}`;
}

// Strip seconds from a time string like "6:32:18 PM" → "6:32 PM"
export function stripSeconds(timeStr) {
  if (!timeStr || timeStr === "..." || timeStr === "—") return timeStr;
  return timeStr.replace(/:\d{2}(\s[AP]M)$/, '$1');
}

// Format a zman time based on showSeconds preference
export function formatZmanTime(timeStr, showSeconds) {
  return showSeconds ? timeStr : stripSeconds(timeStr);
}

// Compute candle lighting time: X minutes before sunset ISO string
// Preserves the original timezone offset from the sunset ISO string
export function computeCandleLighting(sunsetIso, minutesBefore) {
  if (!sunsetIso) return null;
  const d = new Date(sunsetIso);
  if (isNaN(d)) return null;
  const adjusted = new Date(d.getTime() - minutesBefore * 60000);
  // Reconstruct ISO with original offset so isoToTime parses correctly
  const offsetMatch = sunsetIso.match(/([+-]\d{2}:\d{2})$/);
  if (offsetMatch) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${adjusted.getUTCFullYear()}-${pad(adjusted.getUTCMonth()+1)}-${pad(adjusted.getUTCDate())}T${pad(adjusted.getUTCHours())}:${pad(adjusted.getUTCMinutes())}:${pad(adjusted.getUTCSeconds())}${offsetMatch[1]}`;
  }
  return adjusted.toISOString();
}

// Fetch accurate zmanim from Hebcal API
const zmanimCache = {};

export async function fetchZmanim(date, lat, lng, tzid, candleMinutes = 18) {
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const cacheKey = `v3_${dateStr}_${lat}_${lng}_${candleMinutes}`;
  if (zmanimCache[cacheKey]) return zmanimCache[cacheKey];

  const tz = tzid || Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
  const url = `https://www.hebcal.com/zmanim?cfg=json&latitude=${lat}&longitude=${lng}&tzid=${encodeURIComponent(tz)}&date=${dateStr}`;

  const res = await fetch(url);
  const data = await res.json();
  const t = data.times;

  const result = {
    alotHaShachar: isoToTime(t.alotHaShachar),
    zmanTzitzit: isoToTime(t.misheyakir),
    sunrise: isoToTime(t.sunrise),
    sofShmaGRA: isoToTime(t.sofZmanShma),
    sofShmaMA: isoToTime(t.sofZmanShmaMGA),
    sofTfila: isoToTime(t.sofZmanTfilla),
    midday: isoToTime(t.chatzot),
    minchaGedolah: isoToTime(t.minchaGedola),
    plagHaMincha: isoToTime(t.plagHaMincha),
    sunset: isoToTime(t.sunset),
    candleLighting: isoToTime(computeCandleLighting(t.sunset, candleMinutes)),
    tzeitKochavim: isoToTime(t.tzeit42min || t.dusk),
    rabbeinuTam: isoToTime(t.tzeit72min),
    _raw: t,
  };

  zmanimCache[cacheKey] = result;
  return result;
}

export function getJewishHoliday(date) {
  const heb = gregorianToHebrew(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const m = heb.month;
  const d = heb.day;
  if (m === 7 && (d === 1 || d === 2)) return "Rosh Hashanah";
  if (m === 7 && d === 3) return "Tzom Gedaliah";
  if (m === 7 && d === 10) return "Yom Kippur";
  if (m === 7 && d >= 15 && d <= 21) return "Sukkot";
  if (m === 7 && d === 22) return "Shemini Atzeret";
  if (m === 7 && d === 23) return "Simchat Torah";
  if (m === 9 && d >= 25) return "Chanukah";
  if (m === 10 && d <= 2) return "Chanukah";
  if (m === 10 && d === 10) return "Asara B'Tevet";
  if (m === 11 && d === 15) return "Tu B'Shevat";
  if (m === 12 && d === 13) return "Ta'anit Esther";
  if (m === 12 && d === 14) return "Purim";
  if (m === 12 && d === 15) return "Shushan Purim";
  if (m === 1 && d >= 15 && d <= 21) return "Pesach";
  if (m === 1 && d === 22) return "Pesach (8th day)";
  if (m === 2 && d === 18) return "Lag B'Omer";
  if (m === 3 && d === 6) return "Shavuot";
  if (m === 3 && d === 7) return "Shavuot (2nd day)";
  if (m === 5 && d === 9) return "Tisha B'Av";
  if (m === 5 && d === 15) return "Tu B'Av";
  return null;
}

export function isShabbat(date) { return date.getDay() === 6; }
export function isFriday(date) { return date.getDay() === 5; }