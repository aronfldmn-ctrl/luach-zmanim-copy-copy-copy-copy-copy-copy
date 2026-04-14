// Offline Zmanim calculation using suncalc
import SunCalc from 'suncalc';

// Convert milliseconds to time string "h:mm:ss AM/PM"
function msToTimeString(ms, tz) {
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

// Calculate Jewish day length (sunrise to sunset)
function calculateZmanimOffline(date, lat, lng, tzid, candleMinutes = 18) {
  const tz = tzid || Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";

  // Get sun times from suncalc
  const sunTimes = SunCalc.getTimes(date, lat, lng);
  
  // Basic sun times
  const sunrise = sunTimes.sunrise ? sunrise.getTime() : null;
  const sunset = sunTimes.sunset ? sunTimes.sunset.getTime() : null;
  const solarNoon = sunTimes.solarNoon ? sunTimes.solarNoon.getTime() : null;

  // Calculate approximate Zmanim based on sunrise/sunset
  let alotHaShachar = "—";
  let zmanTzitzit = "—";
  let sofShmaGRA = "—";
  let sofShmaMA = "—";
  let sofTfila = "—";
  let midday = "—";
  let minchaGedolah = "—";
  let plagHaMincha = "—";
  let candleLighting = "—";
  let tzeitKochavim = "—";
  let rabbeinuTam = "—";

  if (sunrise && sunset) {
    // Approximate calculations based on relative positions
    const dayLength = sunset - sunrise;

    // Alot HaShachar: ~72 minutes before sunrise
    const alotMs = sunrise - (72 * 60 * 1000);
    alotHaShachar = msToTimeString(alotMs, tz);

    // Zman Tzitzit: ~45 minutes before sunrise (Misheyakir)
    const tzitzitMs = sunrise - (45 * 60 * 1000);
    zmanTzitzit = msToTimeString(tzitzitMs, tz);

    // Sof Shma GRA: 3 hours after sunrise
    sofShmaGRA = msToTimeString(sunrise + (3 * 60 * 60 * 1000), tz);

    // Sof Shma MGA: 3.2 hours after sunrise
    sofShmaMA = msToTimeString(sunrise + (3.2 * 60 * 60 * 1000), tz);

    // Sof Tfila (Tefilla): 4 hours after sunrise
    sofTfila = msToTimeString(sunrise + (4 * 60 * 60 * 1000), tz);

    // Midday (Chatzos): Solar noon
    if (solarNoon) {
      midday = msToTimeString(solarNoon, tz);
    }

    // Mincha Gedolah: 30 minutes after midday
    if (solarNoon) {
      minchaGedolah = msToTimeString(solarNoon + (30 * 60 * 1000), tz);
    }

    // Plag HaMincha: 1.25 hours before sunset
    plagHaMincha = msToTimeString(sunset - (1.25 * 60 * 60 * 1000), tz);

    // Candle Lighting: candleMinutes before sunset
    candleLighting = msToTimeString(sunset - (candleMinutes * 60 * 1000), tz);

    // Tzait Hakochavim: ~45 minutes after sunset
    tzeitKochavim = msToTimeString(sunset + (45 * 60 * 1000), tz);

    // Rabbenu Tam: ~72 minutes after sunset
    rabbeinuTam = msToTimeString(sunset + (72 * 60 * 1000), tz);
  }

  return {
    alotHaShachar,
    zmanTzitzit,
    sunrise: sunrise ? msToTimeString(sunrise, tz) : "—",
    sofShmaGRA,
    sofShmaMA,
    sofTfila,
    midday,
    minchaGedolah,
    plagHaMincha,
    sunset: sunset ? msToTimeString(sunset, tz) : "—",
    candleLighting,
    tzeitKochavim,
    rabbeinuTam,
  };
}

export { calculateZmanimOffline };