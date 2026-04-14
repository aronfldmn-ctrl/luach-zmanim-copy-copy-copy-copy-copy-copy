import React from "react";
import { useSettings } from "@/lib/settingsContext";
import ZmanimPanel from "./ZmanimPanel";
import WeatherWidget from "./WeatherWidget";
import DafYomiPanel from "./DafYomiPanel";

export default function SidePanel({ date }) {
  const { showWeather, showZmanim, showDafYomi } = useSettings();

  if (!showZmanim && !showWeather && !showDafYomi) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Zmanim always on top */}
      {showZmanim && <ZmanimPanel date={date} />}

      {/* Daf Yomi */}
      {showDafYomi && <DafYomiPanel date={date} />}

      {/* Weather: combined daily + hourly in one panel */}
      {showWeather && <WeatherWidget view="combined" date={date} />}
    </div>
  );
}