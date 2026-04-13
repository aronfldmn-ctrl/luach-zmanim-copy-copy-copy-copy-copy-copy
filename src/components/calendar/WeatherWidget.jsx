import React, { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer, Loader2, CloudLightning, CloudDrizzle } from "lucide-react";
import { useSettings } from "@/lib/settingsContext";

const WMO_CODES = {
  0: { label: "Clear sky", icon: Sun, color: "text-yellow-500" },
  1: { label: "Mainly clear", icon: Sun, color: "text-yellow-400" },
  2: { label: "Partly cloudy", icon: Cloud, color: "text-slate-400" },
  3: { label: "Overcast", icon: Cloud, color: "text-slate-500" },
  45: { label: "Foggy", icon: Cloud, color: "text-slate-400" },
  48: { label: "Icy fog", icon: Cloud, color: "text-slate-400" },
  51: { label: "Light drizzle", icon: CloudDrizzle, color: "text-blue-400" },
  53: { label: "Drizzle", icon: CloudDrizzle, color: "text-blue-500" },
  55: { label: "Heavy drizzle", icon: CloudDrizzle, color: "text-blue-600" },
  61: { label: "Light rain", icon: CloudRain, color: "text-blue-400" },
  63: { label: "Rain", icon: CloudRain, color: "text-blue-500" },
  65: { label: "Heavy rain", icon: CloudRain, color: "text-blue-600" },
  71: { label: "Light snow", icon: CloudSnow, color: "text-sky-300" },
  73: { label: "Snow", icon: CloudSnow, color: "text-sky-400" },
  75: { label: "Heavy snow", icon: CloudSnow, color: "text-sky-500" },
  80: { label: "Rain showers", icon: CloudRain, color: "text-blue-400" },
  81: { label: "Rain showers", icon: CloudRain, color: "text-blue-500" },
  82: { label: "Heavy showers", icon: CloudRain, color: "text-blue-600" },
  85: { label: "Snow showers", icon: CloudSnow, color: "text-sky-400" },
  95: { label: "Thunderstorm", icon: CloudLightning, color: "text-purple-500" },
  96: { label: "Thunderstorm", icon: CloudLightning, color: "text-purple-600" },
  99: { label: "Thunderstorm", icon: CloudLightning, color: "text-purple-700" },
};

function getWeatherInfo(code) {
  return WMO_CODES[code] || { label: "Unknown", icon: Cloud, color: "text-slate-400" };
}

export default function WeatherWidget({ compact = false }) {
  const { location } = useSettings();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&current=temperature_2m,weathercode,windspeed_10m,apparent_temperature&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=auto`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          feelsLike: Math.round(data.current.apparent_temperature),
          code: data.current.weathercode,
          wind: Math.round(data.current.windspeed_10m),
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load weather");
        setLoading(false);
      });
  }, [location.lat, location.lng]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="font-body text-xs">Loading weather...</span>
      </div>
    );
  }

  if (error || !weather) {
    return null;
  }

  const info = getWeatherInfo(weather.code);
  const WeatherIcon = info.icon;

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm font-body">
        <WeatherIcon className={`h-4 w-4 ${info.color}`} />
        <span className="font-semibold">{weather.temp}°F</span>
        <span className="text-muted-foreground text-xs hidden sm:inline">{info.label}</span>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="font-heading font-semibold text-foreground mb-3">Weather</h3>
      <p className="text-xs text-muted-foreground font-body mb-4">{location.name}</p>

      <div className="flex items-center gap-4 mb-4">
        <WeatherIcon className={`h-12 w-12 ${info.color}`} />
        <div>
          <p className="text-4xl font-heading font-bold text-foreground">{weather.temp}°F</p>
          <p className="text-sm text-muted-foreground font-body">{info.label}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 p-2.5 bg-muted rounded-md">
          <Thermometer className="h-4 w-4 text-orange-400" />
          <div>
            <p className="text-xs text-muted-foreground font-body">Feels like</p>
            <p className="text-sm font-semibold font-body">{weather.feelsLike}°F</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 bg-muted rounded-md">
          <Wind className="h-4 w-4 text-blue-400" />
          <div>
            <p className="text-xs text-muted-foreground font-body">Wind</p>
            <p className="text-sm font-semibold font-body">{weather.wind} mph</p>
          </div>
        </div>
      </div>
    </div>
  );
}