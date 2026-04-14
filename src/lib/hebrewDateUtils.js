// Hebrew date conversion utilities (zmanim via kosher-zmanim — local KosherJava JS port)
import { getZmanimJson } from "kosher-zmanim";

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

// Strip seconds from a time string like "6:32:18 PM" → "6:32 PM"
export function stripSeconds(timeStr) {
  if (!timeStr || timeStr === "..." || timeStr === "—") return timeStr;
  return timeStr.replace(/:\d{2}(\s[AP]M)$/, '$1');
}

// Format a zman time based on showSeconds preference
export function formatZmanTime(timeStr, showSeconds) {
  return showSeconds ? timeStr : stripSeconds(timeStr);
}

// Calculate zmanim locally using kosher-zmanim (KosherJava JS port) — full second precision

const zmanimCache = {};

// Convert a Luxon DateTime (or ISO string or JS Date) to "h:mm:ss AM/PM" in the given tz
function dtToTime(val, tz) {
  if (!val) return "—";
  let ms;
  // Luxon DateTime objects have a .toMillis() method
  if (typeof val === 'object' && typeof val.toMillis === 'function') {
    ms = val.toMillis();
  } else if (typeof val === 'object' && val instanceof Date) {
    ms = val.getTime();
  } else {
    // ISO string or number
    ms = new Date(val).getTime();
  }
  if (!ms || isNaN(ms)) return "—";
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  return formatter.format(new Date(ms));
}

export async function fetchZmanim(date, lat, lng, tzid, candleMinutes = 18) {
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const tz = tzid || Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
  const cacheKey = `kj4_${dateStr}_${lat}_${lng}_${tz}_${candleMinutes}`;
  if (zmanimCache[cacheKey]) return zmanimCache[cacheKey];

  // getZmanimJson returns a flat object: keys are method names minus "get", values are ISO strings
  const zRaw = getZmanimJson({
    date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    timeZoneId: tz,
    latitude: lat,
    longitude: lng,
    elevation: 0,
    complexZmanim: true,
  });

  // The library returns { metadata: {...}, Zmanim: { Sunrise: DateTime, ... } }
  const z = zRaw.Zmanim || zRaw.BasicZmanim || zRaw.ComplexZmanim || zRaw;

  const t = (iso) => dtToTime(iso, tz);

  // Compute candle lighting from sunset
  let candleLightingStr = "—";
  if (z.Sunset) {
    const sunsetMs = (typeof z.Sunset.toMillis === 'function') ? z.Sunset.toMillis() : new Date(z.Sunset).getTime();
    const candleMs = sunsetMs - candleMinutes * 60000;
    candleLightingStr = dtToTime(candleMs, tz);
  }

  const result = {
    alotHaShachar: t(z.Alos72),
    zmanTzitzit: t(z.Misheyakir10Point2Degrees),
    sunrise: t(z.Sunrise),
    sofShmaGRA: t(z.SofZmanShmaGRA),
    sofShmaMA: t(z.SofZmanShmaMGA),
    sofTfila: t(z.SofZmanTfilaGRA || z.SofZmanTfillaGRA),
    midday: t(z.Chatzos || z.SunTransit),
    minchaGedolah: t(z.MinchaGedola),
    plagHaMincha: t(z.PlagHamincha),
    sunset: t(z.Sunset),
    candleLighting: candleLightingStr,
    tzeitKochavim: t(z.TzaisGeonim8Point5Degrees || z.Tzais72),
    rabbeinuTam: t(z.Tzais72 || z.TzaisRabbeinuTam),
  };

  zmanimCache[cacheKey] = result;
  return result;
}

export function getJewishHolidays(date) {
  const holidays = [];
  const heb = gregorianToHebrew(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const m = heb.month;
  const d = heb.day;
  
  // Rosh Chodesh: 1st of every month, or 30th if the month has 30 days (but not Tishrei 1st which is Rosh Hashanah)
  if (d === 1 && m !== 7) holidays.push("Rosh Chodesh");
  if (d === 30 && hebrewMonthDays(heb.year, m) === 30) holidays.push("Rosh Chodesh");
  
  if (m === 6 && d === 29) holidays.push("Erev Rosh Hashanah");
  if (m === 7 && (d === 1 || d === 2)) holidays.push("Rosh Hashanah");
  if (m === 7 && d === 3) holidays.push("Tzom Gedaliah");
  if (m === 7 && d === 9) holidays.push("Erev Yom Kippur");
  if (m === 7 && d === 10) holidays.push("Yom Kippur");
  if (m === 7 && d === 14) holidays.push("Erev Sukkot");
  if (m === 7 && (d === 15 || d === 16)) holidays.push("Sukkot");
  if (m === 7 && d === 21) holidays.push("Hoshana Rabah");
  if (m === 7 && d >= 17 && d <= 20) holidays.push("Chol HaMoed Sukkot");
  if (m === 7 && d === 22) holidays.push("Shemini Atzeret");
  if (m === 7 && d === 23) holidays.push("Simchat Torah");
  if (m === 9 && d >= 25) holidays.push("Chanukah");
  if (m === 10 && d <= 2) holidays.push("Chanukah");
  if (m === 10 && d === 10) holidays.push("Asara B'Tevet");
  if (m === 11 && d === 15) holidays.push("Tu B'Shevat");
  if (m === 12 && d === 13) holidays.push("Ta'anit Esther");
  if (m === 12 && d === 14) holidays.push("Purim");
  if (m === 12 && d === 15) holidays.push("Shushan Purim");
  if (m === 1 && d === 14) holidays.push("Erev Pesach");
  if (m === 1 && d === 15) holidays.push("Pesach");
  if (m === 1 && d === 16) holidays.push("Pesach");
  if (m === 1 && d >= 17 && d <= 20) holidays.push("Chol HaMoed Pesach");
  if (m === 1 && d === 21) holidays.push("שביעי של פסח");
  if (m === 1 && d === 22) holidays.push("אחרון של פסח");
  if (m === 2 && d === 18) holidays.push("Lag B'Omer");
  if ((m === 1 && d >= 16) || (m === 2) || (m === 3 && d <= 6)) {
    let dayOfOmer;
    if (m === 1) dayOfOmer = d - 15;
    else if (m === 2) dayOfOmer = 15 + d;
    else dayOfOmer = 15 + hebrewMonthDays(heb.year, 2) + d;
    if (dayOfOmer <= 49) holidays.push(`Sefirat HaOmer - Day ${dayOfOmer}`);
  }
  if (m === 3 && d === 5) holidays.push("Erev Shavuot");
  if (m === 3 && d === 6) holidays.push("Shavuot");
  if (m === 3 && d === 7) holidays.push("Shavuot (2nd day)");
  if (m === 5 && d === 9) holidays.push("Tisha B'Av");
  if (m === 5 && d === 15) holidays.push("Tu B'Av");
  
  return holidays;
}

export function getJewishHoliday(date) {
  const holidays = getJewishHolidays(date);
  return holidays.length > 0 ? holidays[0] : null;
}

export function isShabbat(date) { return date.getDay() === 6; }
export function isFriday(date) { return date.getDay() === 5; }