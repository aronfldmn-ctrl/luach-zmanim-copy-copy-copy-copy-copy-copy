import React, { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, Loader2 } from "lucide-react";
import { useSettings } from "@/lib/settingsContext";
import { getHebrewDate } from "@/lib/hebrewDateUtils";
import { getFromCache, setInCache } from "@/lib/cacheUtils";

const WMO_ICONS = {
  0: { icon: Sun, color: "text-yellow-500" },
  1: { icon: Sun, color: "text-yellow-400" },
  2: { icon: Cloud, color: "text-slate-400" },
  3: { icon: Cloud, color: "text-slate-500" },
};

function getWeatherIcon(code) {
  if (code <= 1) return WMO_ICONS[code] || WMO_ICONS[0];
  if (code <= 3) return WMO_ICONS[code];
  if (code >= 61 && code <= 67) return { icon: CloudRain, color: "text-blue-500" };
  if (code >= 71 && code <= 77) return { icon: CloudSnow, color: "text-sky-400" };
  if (code >= 80 && code <= 82) return { icon: CloudRain, color: "text-blue-400" };
  return { icon: Cloud, color: "text-slate-400" };
}

export default function StatusBar() {
  const { location, hebrewMode, celsiusMode, showWeather } = useSettings();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const hebrewDate = getHebrewDate(today);

  useEffect(() => {
    if (!showWeather) { setLoading(false); return; }
    const tempUnit = celsiusMode ? "celsius" : "fahrenheit";
    const cacheKey = `weather_${location.lat}_${location.lng}_${tempUnit}`;
    
    // Try cache first
    const cached = getFromCache(cacheKey);
    if (cached) {
      setWeather(cached);
      setLoading(false);
      return;
    }
    
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&current=temperature_2m,weathercode&temperature_unit=${tempUnit}&timezone=auto`)
      .then(r => r.json())
      .then(data => {
        const weatherData = {
          temp: Math.round(data.current.temperature_2m),
          code: data.current.weathercode,
        };
        setWeather(weatherData);
        setInCache(cacheKey, weatherData, 60 * 60 * 1000); // Cache for 1 hour
        setLoading(false);
      })
      .catch(() => {
        // Fallback to cache if fetch fails
        const fallback = getFromCache(cacheKey);
        if (fallback) setWeather(fallback);
        setLoading(false);
      });
  }, [location.lat, location.lng, celsiusMode, showWeather]);

  const unit = celsiusMode ? "°C" : "°F";
  const hebrewLabel = hebrewMode
    ? `${hebrewDate.dayHeb} ${hebrewDate.monthNameHeb} ${hebrewDate.year}`
    : `${hebrewDate.day} ${hebrewDate.monthName} ${hebrewDate.year}`;

  return (
    <div className="w-full bg-primary text-primary-foreground px-4 py-1.5 flex items-center justify-between text-xs font-body pt-[env(safe-area-inset-top)]">
      <span className="opacity-80">{location.name}</span>
      <span className="font-medium">{hebrewLabel}</span>
      {showWeather && (
        <div className="flex items-center gap-1.5">
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin opacity-60" />
          ) : weather ? (
            <>
              {React.createElement(getWeatherIcon(weather.code).icon, {
                className: `h-3.5 w-3.5 ${getWeatherIcon(weather.code).color}`,
              })}
              <span className="font-semibold">{weather.temp}{unit}</span>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}