// Hebrew date conversion and full halachic zmanim calculations

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

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date - start) / (1000 * 60 * 60 * 24));
}

function minutesToTime(minutes) {
  const totalMin = Math.round(minutes);
  let hours = Math.floor(totalMin / 60);
  let mins = totalMin % 60;
  if (hours < 0) hours += 24;
  if (mins < 0) { mins += 60; hours -= 1; }
  if (hours >= 24) hours -= 24;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${ampm}`;
}

// Full halachic zmanim
export function getZmanim(date, lat = 40.7128, lng = -74.006) {
  const dayOfYear = getDayOfYear(date);
  const declination = 23.45 * Math.sin((2 * Math.PI / 365) * (dayOfYear - 81));
  const decRad = declination * Math.PI / 180;
  const latRad = lat * Math.PI / 180;

  // Standard sunrise/sunset (0.833° depression for refraction)
  const cosHA = -Math.tan(latRad) * Math.tan(decRad);
  const clampedCosHA = Math.max(-1, Math.min(1, cosHA));
  const HA = Math.acos(clampedCosHA) * 180 / Math.PI;

  // Equation of time
  const B = (2 * Math.PI / 365) * (dayOfYear - 81);
  const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);

  const solarNoon = 720 - 4 * lng - EoT; // UTC minutes
  const timezone = -date.getTimezoneOffset(); // local offset in minutes

  const sunriseMin = solarNoon - HA * 4 + timezone;
  const sunsetMin = solarNoon + HA * 4 + timezone;
  const middayMin = solarNoon + timezone;

  // Shaah zmanit (halachic hour) = 1/12 of daylight time
  const shaahZmanit = (sunsetMin - sunriseMin) / 12; // in minutes

  // Alot HaShachar (dawn) = 72 minutes (Gra/Baal HaTanya: 16.1° before sunrise)
  const alotMin = sunriseMin - 72;

  // Misheyakir / Zman Tzitzit = 3 halachic hours before midday, but practically ~50 min after alot
  const tzitzitMin = alotMin + 50;

  // Sof Zman Kriat Shema (Magen Avraham) = alot + 3 sha'ot zmaniyot
  const sofShmaMAMin = alotMin + 3 * ((middayMin * 2 - alotMin - (sunsetMin + 72)) / 12);
  // Sof Zman Kriat Shema (GRA) = sunrise + 3 sha'ot zmaniyot
  const sofShmaGRAMin = sunriseMin + 3 * shaahZmanit;

  // Sof Zman Tfila (GRA) = sunrise + 4 sha'ot zmaniyot
  const sofTfilaGRAMin = sunriseMin + 4 * shaahZmanit;

  // Mincha Gedolah = midday + 0.5 sha'ah zmanit (30 min if day is standard)
  const minchaGedolahMin = middayMin + 0.5 * shaahZmanit;

  // Plag HaMincha = sunset - 1.25 sha'ot zmaniyot
  const plagHaMinchaMin = sunsetMin - 1.25 * shaahZmanit;

  // Tzet HaKochavim (nightfall) = 42 min after sunset (3 stars visible)
  const tzeitMin = sunsetMin + 42;

  // Rabbeinu Tam = 72 min after sunset (or 16.1° depression — using 72 min)
  const rabbeinuTamMin = sunsetMin + 72;

  return {
    alotHaShachar: minutesToTime(alotMin),
    zmanTzitzit: minutesToTime(tzitzitMin),
    sunrise: minutesToTime(sunriseMin),
    sofShmaGRA: minutesToTime(sofShmaGRAMin),
    sofShmaMA: minutesToTime(sofShmaMAMin),
    sofTfila: minutesToTime(sofTfilaGRAMin),
    midday: minutesToTime(middayMin),
    minchaGedolah: minutesToTime(minchaGedolahMin),
    plagHaMincha: minutesToTime(plagHaMinchaMin),
    sunset: minutesToTime(sunsetMin),
    candleLighting: minutesToTime(sunsetMin - 18),
    tzeitKochavim: minutesToTime(tzeitMin),
    rabbeinuTam: minutesToTime(rabbeinuTamMin),
    // raw minutes for internal use
    _sunriseMin: sunriseMin,
    _sunsetMin: sunsetMin,
  };
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