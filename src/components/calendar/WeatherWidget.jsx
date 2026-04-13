import React, { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer, Loader2, CloudLightning, CloudDrizzle, Droplets } from "lucide-react";
import { useSettings, HEB_UI } from "@/lib/settingsContext";
import { format } from "date-fns";

const WMO_CODES = {
  0: { label: "Clear sky", labelHeb: "שמיים בהירים", icon: Sun, color: "text-yellow-500" },
  1: { label: "Mainly clear", labelHeb: "בהיר ברובו", icon: Sun, color: "text-yellow-400" },
  2: { label: "Partly cloudy", labelHeb: "מעונן חלקית", icon: Cloud, color: "text-slate-400" },
  3: { label: "Overcast", labelHeb: "מעונן", icon: Cloud, color: "text-slate-500" },
  45: { label: "Foggy", labelHeb: "ערפל", icon: Cloud, color: "text-slate-400" },
  48: { label: "Icy fog", labelHeb: "ערפל קרח", icon: Cloud, color: "text-slate-400" },
  51: { label: "Light drizzle", labelHeb: "טפטוף קל", icon: CloudDrizzle, color: "text-blue-400" },
  53: { label: "Drizzle", labelHeb: "טפטוף", icon: CloudDrizzle, color: "text-blue-500" },
  55: { label: "Heavy drizzle", labelHeb: "טפטוף כבד", icon: CloudDrizzle, color: "text-blue-600" },
  61: { label: "Light rain", labelHeb: "גשם קל", icon: CloudRain, color: "text-blue-400" },
  63: { label: "Rain", labelHeb: "גשם", icon: CloudRain, color: "text-blue-500" },
  65: { label: "Heavy rain", labelHeb: "גשם כבד", icon: CloudRain, color: "text-blue-600" },
  71: { label: "Light snow", labelHeb: "שלג קל", icon: CloudSnow, color: "text-sky-300" },
  73: { label: "Snow", labelHeb: "שלג", icon: CloudSnow, color: "text-sky-400" },
  75: { label: "Heavy snow", labelHeb: "שלג כבד", icon: CloudSnow, color: "text-sky-500" },
  80: { label: "Rain showers", labelHeb: "מקלחות גשם", icon: CloudRain, color: "text-blue-400" },
  81: { label: "Rain showers", labelHeb: "מקלחות גשם", icon: CloudRain, color: "text-blue-500" },
  82: { label: "Heavy showers", labelHeb: "מקלחות כבדות", icon: CloudRain, color: "text-blue-600" },
  85: { label: "Snow showers", labelHeb: "מקלחות שלג", icon: CloudSnow, color: "text-sky-400" },
  95: { label: "Thunderstorm", labelHeb: "סופת רעמים", icon: CloudLightning, color: "text-purple-500" },
  96: { label: "Thunderstorm", labelHeb: "סופת רעמים", icon: CloudLightning, color: "text-purple-600" },
  99: { label: "Thunderstorm", labelHeb: "סופת רעמים", icon: CloudLightning, color: "text-purple-700" },
};

function getWeatherInfo(code) {
  return WMO_CODES[code] || { label: "Unknown", labelHeb: "לא ידוע", icon: Cloud, color: "text-slate-400" };
}

// view: "daily" | "weekly" | "hourly" | "compact"
export default function WeatherWidget({ compact = false, weekly = false, view = "daily", embedded = false }) {
  const { location, hebrewMode, celsiusMode } = useSettings();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const t = (en, heb) => hebrewMode ? heb : en;
  const unit = celsiusMode ? "°C" : "°F";

  // Resolve effective view
  const effectiveView = compact ? "compact" : weekly ? "weekly" : view;

  useEffect(() => {
    setLoading(true);
    setError(null);
    const tempUnit = celsiusMode ? "celsius" : "fahrenheit";
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&current=temperature_2m,weathercode,windspeed_10m,apparent_temperature&daily=weathercode,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weathercode,precipitation_probability,windspeed_10m&temperature_unit=${tempUnit}&windspeed_unit=mph&timezone=auto&forecast_days=7`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const current = {
          temp: Math.round(data.current.temperature_2m),
          feelsLike: Math.round(data.current.apparent_temperature),
          code: data.current.weathercode,
          wind: Math.round(data.current.windspeed_10m),
          time: data.current.time,
        };
        const daily = (data.daily?.time || []).map((dateStr, i) => ({
          date: new Date(dateStr + "T12:00:00"),
          code: data.daily.weathercode[i],
          high: Math.round(data.daily.temperature_2m_max[i]),
          low: Math.round(data.daily.temperature_2m_min[i]),
        }));
        // Get today's hourly data (next 24 hours)
        const nowHour = new Date().getHours();
        const hourly = (data.hourly?.time || [])
          .map((timeStr, i) => ({
            time: new Date(timeStr),
            temp: Math.round(data.hourly.temperature_2m[i]),
            code: data.hourly.weathercode[i],
            precip: data.hourly.precipitation_probability[i],
            wind: Math.round(data.hourly.windspeed_10m[i]),
          }))
          .filter((h) => {
            const isToday = h.time.toDateString() === new Date().toDateString();
            return isToday && h.time.getHours() >= nowHour;
          })
          .slice(0, 24);
        setWeather({ current, daily, hourly });
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load weather");
        setLoading(false);
      });
  }, [location.lat, location.lng, celsiusMode]);

  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-muted-foreground text-sm ${embedded ? "p-4" : ""}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="font-body text-xs">{t("Loading weather...", "טוען מזג אוויר...")}</span>
      </div>
    );
  }

  if (error || !weather) return null;

  const info = getWeatherInfo(weather.current.code);
  const WeatherIcon = info.icon;
  const todayDate = new Date();

  // Compact: just icon + temp for header bar
  if (effectiveView === "compact") {
    return (
      <div className="flex items-center gap-2 text-sm font-body">
        <WeatherIcon className={`h-4 w-4 ${info.color}`} />
        <span className="font-semibold">{weather.current.temp}{unit}</span>
        <span className="text-muted-foreground text-xs hidden sm:inline">{t(info.label, info.labelHeb)}</span>
      </div>
    );
  }

  // Weekly panel: 7-day forecast grid
  if (effectiveView === "weekly") {
    const DAY_LABELS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const DAY_LABELS_HEB = [HEB_UI.sun, HEB_UI.mon, HEB_UI.tue, HEB_UI.wed, HEB_UI.thu, HEB_UI.fri, HEB_UI.shabbat];
    return (
      <div className={embedded ? "p-4" : "bg-card border border-border rounded-lg p-4"}>
        {!embedded && (
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-semibold text-foreground">{t("Weekly Weather", "תחזית שבועית")}</h3>
            <p className="text-xs text-muted-foreground font-body">{location.name}</p>
          </div>
        )}
        <div className="grid grid-cols-7 gap-1">
          {weather.daily.slice(0, 7).map((day, i) => {
            const DayIcon = getWeatherInfo(day.code).icon;
            const dayColor = getWeatherInfo(day.code).color;
            const isToday = day.date.toDateString() === todayDate.toDateString();
            const dayLabel = hebrewMode
              ? DAY_LABELS_HEB[day.date.getDay()]
              : DAY_LABELS_EN[day.date.getDay()];
            return (
              <div key={i} className={`flex flex-col items-center gap-1 p-1.5 rounded-lg ${isToday ? "bg-accent/10 border border-accent/20" : "hover:bg-muted/50"}`}>
                <span className={`text-[10px] font-body font-medium ${isToday ? "text-accent" : "text-muted-foreground"}`}>{dayLabel}</span>
                <span className="text-[10px] font-body text-muted-foreground">{format(day.date, "M/d")}</span>
                <DayIcon className={`h-4 w-4 ${dayColor}`} />
                <span className="text-[10px] font-body font-semibold text-foreground">{day.high}°</span>
                <span className="text-[10px] font-body text-muted-foreground">{day.low}°</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Hourly view: hour-by-hour for today
  if (effectiveView === "hourly") {
    return (
      <div className={embedded ? "p-3" : "bg-card border border-border rounded-lg p-4"}>
        {!embedded && (
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-semibold text-foreground">{t("Hourly Forecast", "תחזית שעתית")}</h3>
            <p className="text-xs text-muted-foreground font-body">{location.name}</p>
          </div>
        )}
        {weather.hourly.length === 0 ? (
          <p className="text-xs text-muted-foreground font-body text-center py-3">{t("No hourly data", "אין נתונים שעתיים")}</p>
        ) : (
          <div className="space-y-1 max-h-[340px] overflow-y-auto pr-1">
            {weather.hourly.map((h, i) => {
              const HourIcon = getWeatherInfo(h.code).icon;
              const hourColor = getWeatherInfo(h.code).color;
              const isNow = i === 0;
              return (
                <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-body ${isNow ? "bg-accent/10 border border-accent/20" : "hover:bg-muted/30"}`}>
                  <span className={`w-14 flex-shrink-0 tabular-nums ${isNow ? "font-semibold text-accent" : "text-muted-foreground"}`}>
                    {isNow ? t("Now", "עכשיו") : format(h.time, "h:mm a")}
                  </span>
                  <HourIcon className={`h-3.5 w-3.5 flex-shrink-0 ${hourColor}`} />
                  <span className="font-semibold text-foreground w-10 flex-shrink-0">{h.temp}{unit}</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Droplets className="h-3 w-3 text-blue-400" />
                    <span>{h.precip}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground ml-auto">
                    <Wind className="h-3 w-3 text-slate-400" />
                    <span>{h.wind}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Combined: current conditions + hourly breakdown
  if (effectiveView === "combined") {
    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-border/60">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-semibold text-foreground">{t("Weather", HEB_UI.weather)}</h3>
            <span className="text-xs text-muted-foreground font-body">{location.name}</span>
          </div>
          {/* Current conditions */}
          <div className="flex items-center gap-4">
            <WeatherIcon className={`h-12 w-12 ${info.color}`} />
            <div>
              <p className="text-4xl font-heading font-bold text-foreground">{weather.current.temp}{unit}</p>
              <p className="text-sm text-muted-foreground font-body">{t(info.label, info.labelHeb)}</p>
              </div>
              <div className="ml-auto flex flex-col gap-1.5 text-right">
              <div className="flex items-center gap-1.5 justify-end text-xs font-body text-muted-foreground">
                <Thermometer className="h-3.5 w-3.5 text-orange-400" />
                <span>{t("Feels", "מורגש")} {weather.current.feelsLike}{unit}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end text-xs font-body text-muted-foreground">
                <Wind className="h-3.5 w-3.5 text-blue-400" />
                <span>{weather.current.wind} mph</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hourly breakdown */}
        <div className="px-4 py-3 border-b border-border/60">
          <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider mb-2">{t("Today · Hour by Hour", "היום · שעה אחר שעה")}</p>
          <div className="space-y-0.5 max-h-[280px] overflow-y-auto pr-1">
            {weather.hourly.length === 0 ? (
              <p className="text-xs text-muted-foreground font-body text-center py-3">{t("No data", "אין נתונים")}</p>
            ) : weather.hourly.map((h, i) => {
              const HourIcon = getWeatherInfo(h.code).icon;
              const hourColor = getWeatherInfo(h.code).color;
              const isNow = i === 0;
              return (
                <div key={i} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-body ${isNow ? "bg-accent/10 border border-accent/20" : "hover:bg-muted/30"}`}>
                  <span className={`w-12 flex-shrink-0 tabular-nums ${isNow ? "font-semibold text-accent" : "text-muted-foreground"}`}>
                    {isNow ? t("Now", "עכשיו") : format(h.time, "h a")}
                  </span>
                  <HourIcon className={`h-3.5 w-3.5 flex-shrink-0 ${hourColor}`} />
                  <span className={`font-semibold w-10 flex-shrink-0 ${isNow ? "text-accent" : "text-foreground"}`}>{h.temp}°</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Droplets className="h-3 w-3 text-blue-400" />
                    <span>{h.precip}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground ml-auto">
                    <Wind className="h-3 w-3 text-slate-400" />
                    <span>{h.wind}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly forecast */}
        <div className="px-4 py-3">
          <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider mb-2">{t("7-Day Forecast", "תחזית 7 ימים")}</p>
          <div className="grid grid-cols-7 gap-1">
            {weather.daily.slice(0, 7).map((day, i) => {
              const DAY_LABELS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
              const DAY_LABELS_HEB = [HEB_UI.sun, HEB_UI.mon, HEB_UI.tue, HEB_UI.wed, HEB_UI.thu, HEB_UI.fri, HEB_UI.shabbat];
              const DayIcon = getWeatherInfo(day.code).icon;
              const dayColor = getWeatherInfo(day.code).color;
              const isToday = day.date.toDateString() === todayDate.toDateString();
              const dayLabel = hebrewMode ? DAY_LABELS_HEB[day.date.getDay()] : DAY_LABELS_EN[day.date.getDay()];
              return (
                <div key={i} className={`flex flex-col items-center gap-1 p-1.5 rounded-lg ${isToday ? "bg-accent/10 border border-accent/20" : "hover:bg-muted/50"}`}>
                  <span className={`text-[10px] font-body font-medium ${isToday ? "text-accent" : "text-muted-foreground"}`}>{dayLabel}</span>
                  <span className="text-[9px] font-body text-muted-foreground">{format(day.date, "M/d")}</span>
                  <DayIcon className={`h-4 w-4 ${dayColor}`} />
                  <span className="text-[10px] font-body font-semibold text-foreground">{day.high}°</span>
                  <span className="text-[10px] font-body text-muted-foreground">{day.low}°</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Daily (default full card): current + 7-day
  return (
    <div className={embedded ? "p-4" : "bg-card border border-border rounded-lg p-5"}>
      {!embedded && (
        <>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-heading font-semibold text-foreground">{t("Weather", HEB_UI.weather)}</h3>
            <span className="text-xs text-muted-foreground font-body">{format(todayDate, "EEEE, MMM d")}</span>
          </div>
          <p className="text-xs text-muted-foreground font-body mb-4">{location.name}</p>
        </>
      )}

      <div className="flex items-center gap-4 mb-4">
        <WeatherIcon className={`h-12 w-12 ${info.color}`} />
        <div>
          <p className="text-4xl font-heading font-bold text-foreground">{weather.current.temp}{unit}</p>
          <p className="text-sm text-muted-foreground font-body">{t(info.label, info.labelHeb)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 p-2.5 bg-muted rounded-md">
          <Thermometer className="h-4 w-4 text-orange-400" />
          <div>
            <p className="text-xs text-muted-foreground font-body">{t("Feels like", HEB_UI.feels_like)}</p>
            <p className="text-sm font-semibold font-body">{weather.current.feelsLike}{unit}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 bg-muted rounded-md">
          <Wind className="h-4 w-4 text-blue-400" />
          <div>
            <p className="text-xs text-muted-foreground font-body">{t("Wind", HEB_UI.wind)}</p>
            <p className="text-sm font-semibold font-body">{weather.current.wind} mph</p>
          </div>
        </div>
      </div>

      {weather.daily.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground font-body mb-2 uppercase tracking-wide">{t("7-Day Forecast", "תחזית 7 ימים")}</p>
          <div className="space-y-1">
            {weather.daily.slice(0, 7).map((day, i) => {
              const DayIcon = getWeatherInfo(day.code).icon;
              const dayColor = getWeatherInfo(day.code).color;
              const isToday = day.date.toDateString() === todayDate.toDateString();
              return (
                <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded-md ${isToday ? "bg-accent/10" : "hover:bg-muted/30"}`}>
                  <span className={`text-xs font-body w-20 ${isToday ? "font-semibold text-accent" : "text-muted-foreground"}`}>
                    {isToday ? t("Today", HEB_UI.today_date) : format(day.date, hebrewMode ? "EEEE" : "EEE, MMM d")}
                  </span>
                  <DayIcon className={`h-3.5 w-3.5 ${dayColor} flex-shrink-0`} />
                  <span className="text-xs text-muted-foreground font-body flex-1 truncate">{t(getWeatherInfo(day.code).label, getWeatherInfo(day.code).labelHeb)}</span>
                  <span className="text-xs font-body font-semibold">{day.high}°</span>
                  <span className="text-xs font-body text-muted-foreground">{day.low}°</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}