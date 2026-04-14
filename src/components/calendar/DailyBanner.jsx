import React, { useState, useEffect } from "react";
import { X, Cloud, Sun, CloudRain, CloudSnow } from "lucide-react";
import { useSettings } from "@/lib/settingsContext";
import { getHebrewDate, getJewishHoliday } from "@/lib/hebrewDateUtils";

const WMO_LABELS = {
  0: { en: "Clear sky", heb: "שמיים בהירים" },
  1: { en: "Mainly clear", heb: "בהיר ברובו" },
  2: { en: "Partly cloudy", heb: "מעונן חלקית" },
  3: { en: "Overcast", heb: "מעונן" },
};

function getWeatherDesc(code, hebrewMode) {
  if (code <= 3) return hebrewMode ? (WMO_LABELS[code]?.heb || "") : (WMO_LABELS[code]?.en || "");
  if (code >= 61 && code <= 67) return hebrewMode ? "גשם" : "Rain";
  if (code >= 71 && code <= 77) return hebrewMode ? "שלג" : "Snow";
  if (code >= 80 && code <= 82) return hebrewMode ? "מקלחות גשם" : "Rain showers";
  if (code >= 95) return hebrewMode ? "סופת רעמים" : "Thunderstorm";
  return hebrewMode ? "מעונן" : "Cloudy";
}

function WeatherIcon({ code }) {
  if (code <= 1) return <Sun className="h-5 w-5 text-yellow-400" />;
  if (code <= 3) return <Cloud className="h-5 w-5 text-slate-400" />;
  if (code >= 61 && code <= 82) return <CloudRain className="h-5 w-5 text-blue-400" />;
  if (code >= 71 && code <= 77) return <CloudSnow className="h-5 w-5 text-sky-400" />;
  return <Cloud className="h-5 w-5 text-slate-400" />;
}

export default function DailyBanner() {
  const { location, hebrewMode, celsiusMode, showWeather } = useSettings();
  const [visible, setVisible] = useState(false);
  const [weather, setWeather] = useState(null);

  const today = new Date();
  const todayKey = today.toDateString();
  const hebrewDate = getHebrewDate(today);
  const holiday = getJewishHoliday(today);
  const isShabbat = today.getDay() === 6;

  useEffect(() => {
    const seen = localStorage.getItem("jcal_banner_seen");
    if (seen !== todayKey) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!visible || !showWeather) return;
    const tempUnit = celsiusMode ? "celsius" : "fahrenheit";
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&current=temperature_2m,weathercode&temperature_unit=${tempUnit}&timezone=auto`)
      .then(r => r.json())
      .then(data => setWeather({ temp: Math.round(data.current.temperature_2m), code: data.current.weathercode }))
      .catch(() => {});
  }, [visible, location.lat, location.lng, celsiusMode, showWeather]);

  const dismiss = () => {
    localStorage.setItem("jcal_banner_seen", todayKey);
    setVisible(false);
  };

  if (!visible) return null;

  const t = (en, heb) => hebrewMode ? heb : en;
  const unit = celsiusMode ? "°C" : "°F";
  const hebrewLabel = `${hebrewDate.dayHeb} ${hebrewDate.monthNameHeb} ${hebrewDate.year}`;
  const greeting = isShabbat ? t("Shabbat Shalom! 🕯️", "שבת שלום! 🕯️") : t("Good morning! ☀️", "בוקר טוב! ☀️");

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4" onClick={dismiss}>
      <div
        className="bg-card border border-border rounded-xl shadow-2xl p-5 w-full max-w-sm relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={dismiss} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>

        <p className="font-heading text-lg font-semibold text-foreground mb-1">{greeting}</p>

        {/* Hebrew Date */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-heading font-bold text-accent">{hebrewLabel}</span>
        </div>

        {/* Gregorian date */}
        <p className="text-sm text-muted-foreground font-body mb-3">
          {today.toLocaleDateString(hebrewMode ? "he-IL" : "en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>

        {/* Holiday */}
        {(holiday || isShabbat) && (
          <div className="mb-3 px-3 py-2 bg-accent/10 rounded-lg">
            <p className="text-sm font-medium text-accent font-body">
              ✡️ {holiday || t("Shabbat Kodesh", "שבת קודש")}
            </p>
          </div>
        )}

        {/* Weather */}
        {showWeather && weather && (
          <div className="flex items-center gap-3 px-3 py-2 bg-muted rounded-lg">
            <WeatherIcon code={weather.code} />
            <div>
              <p className="text-sm font-semibold font-body">{weather.temp}{unit}</p>
              <p className="text-xs text-muted-foreground font-body">{getWeatherDesc(weather.code, hebrewMode)}</p>
            </div>
            <p className="text-xs text-muted-foreground font-body ml-auto">{location.name}</p>
          </div>
        )}

        <button
          onClick={dismiss}
          className="mt-4 w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-body font-medium hover:opacity-90 transition-opacity"
        >
          {t("Let's go →", "בואו נתחיל ←")}
        </button>
      </div>
    </div>
  );
}