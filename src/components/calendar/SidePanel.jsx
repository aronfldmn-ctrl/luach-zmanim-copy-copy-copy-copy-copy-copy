import React, { useState } from "react";
import { Clock, Cloud } from "lucide-react";
import { useSettings, HEB_UI } from "@/lib/settingsContext";
import ZmanimPanel from "./ZmanimPanel";
import WeatherWidget from "./WeatherWidget";
import { cn } from "@/lib/utils";

export default function SidePanel({ date }) {
  const { showWeather, showZmanim, hebrewMode } = useSettings();
  const [activeTab, setActiveTab] = useState("zmanim");

  const t = (en, heb) => hebrewMode ? heb : en;

  const tabs = [
    showZmanim && { key: "zmanim", label: t("Zmanim", HEB_UI.zmanim), icon: Clock },
    showWeather && { key: "weather", label: t("Weather", HEB_UI.weather), icon: Cloud },
  ].filter(Boolean);

  // If only one is enabled, just render it directly
  if (tabs.length === 0) return null;
  if (tabs.length === 1) {
    return tabs[0].key === "zmanim" ? <ZmanimPanel date={date} /> : <WeatherWidget />;
  }

  return (
    <div className="flex flex-col gap-0">
      {/* Tab switcher */}
      <div className="flex border border-border rounded-t-lg overflow-hidden bg-muted/30">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-body font-medium transition-colors",
                activeTab === tab.key
                  ? "bg-card text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="border border-t-0 border-border rounded-b-lg overflow-hidden">
        {activeTab === "zmanim" && <ZmanimPanel date={date} />}
        {activeTab === "weather" && <WeatherWidget />}
      </div>
    </div>
  );
}