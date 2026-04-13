import React from "react";
import { useSettings } from "@/lib/settingsContext";
import ZmanimPanel from "./ZmanimPanel";
import WeatherWidget from "./WeatherWidget";

export default function SidePanel({ date }) {
  const { showWeather, showZmanim } = useSettings();

  if (!showZmanim && !showWeather) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Zmanim always on top */}
      {showZmanim && <ZmanimPanel date={date} />}

      {/* Weather: combined daily + hourly in one panel */}
      {showWeather && <WeatherWidget view="combined" />}
    </div>
  );
}