import React, { useState } from "react";
import { useSettings, HEB_UI } from "@/lib/settingsContext";
import ZmanimPanel from "./ZmanimPanel";
import WeatherWidget from "./WeatherWidget";
import { cn } from "@/lib/utils";

export default function SidePanel({ date }) {
  const { showWeather, showZmanim, hebrewMode } = useSettings();
  const [weatherView, setWeatherView] = useState("daily");

  const t = (en, heb) => hebrewMode ? heb : en;

  if (!showZmanim && !showWeather) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Zmanim always on top */}
      {showZmanim && <ZmanimPanel date={date} />}

      {/* Weather below, with its own daily/weekly toggle */}
      {showWeather && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {/* Weather view toggle */}
          <div className="flex border-b border-border bg-muted/30">
            {[
              { key: "daily", label: t("Daily", HEB_UI.daily) },
              { key: "weekly", label: t("Weekly", HEB_UI.weekly) },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setWeatherView(opt.key)}
                className={cn(
                  "flex-1 px-3 py-2 text-xs font-body font-medium transition-colors",
                  weatherView === opt.key
                    ? "bg-card text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <WeatherWidget weekly={weatherView === "weekly"} embedded />
        </div>
      )}
    </div>
  );
}