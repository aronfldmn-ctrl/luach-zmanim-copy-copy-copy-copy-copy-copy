import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { getHebrewDate } from "@/lib/hebrewDateUtils";
import { useSettings, HEB_UI } from "@/lib/settingsContext";
import SettingsPanel from "@/components/calendar/SettingsPanel";
import WeatherWidget from "./WeatherWidget";

const VIEW_OPTIONS = [
  { key: "day", labelEn: "Day", labelHeb: HEB_UI.day },
  { key: "week", labelEn: "Week", labelHeb: HEB_UI.week },
  { key: "month", labelEn: "Month", labelHeb: HEB_UI.month },
  { key: "year", labelEn: "Year", labelHeb: HEB_UI.year },
];

export default function CalendarHeader({ currentDate, view, onViewChange, onNavigate, onToday }) {
  const hebrewDate = getHebrewDate(currentDate);
  const { location, showWeather, hebrewMode } = useSettings();

  const t = (en, heb) => hebrewMode ? heb : en;

  const getTitle = () => {
    if (view === "day") return format(currentDate, "EEEE, MMMM d, yyyy");
    if (view === "week") return format(currentDate, "MMMM yyyy");
    if (view === "month") return format(currentDate, "MMMM yyyy");
    if (view === "year") return format(currentDate, "yyyy");
    return "";
  };

  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <CalendarDays className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-heading font-bold text-foreground tracking-tight leading-tight">
              {getTitle()}
            </h1>
            <p className="text-sm font-body text-accent font-medium mt-0.5">
              {hebrewDate.displayHeb}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showWeather && (
            <div className="hidden md:flex items-center">
              <WeatherWidget compact />
            </div>
          )}
          <div className="hidden md:flex items-center gap-1 ml-2">
            {VIEW_OPTIONS.map((opt) => (
              <Button
                key={opt.key}
                variant={view === opt.key ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange(opt.key)}
                className="font-body text-sm focus:ring-2 focus:ring-primary"
                tabIndex={0}
              >
                {t(opt.labelEn, opt.labelHeb)}
              </Button>
            ))}
          </div>
          <SettingsPanel />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigate(-1)}
            className="h-8 w-8 focus:ring-2 focus:ring-primary"
            tabIndex={0}
            aria-label={t("Previous", "הקודם")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onToday}
            className="font-body text-xs h-8 px-3 focus:ring-2 focus:ring-primary"
            tabIndex={0}
          >
            {t("Today", HEB_UI.today)}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigate(1)}
            className="h-8 w-8 focus:ring-2 focus:ring-primary"
            tabIndex={0}
            aria-label={t("Next", "הבא")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          {showWeather && (
            <div className="flex md:hidden">
              <WeatherWidget compact />
            </div>
          )}
        </div>

        <div className="flex md:hidden items-center gap-1">
          {VIEW_OPTIONS.map((opt) => (
            <Button
              key={opt.key}
              variant={view === opt.key ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange(opt.key)}
              className="font-body text-xs px-2 h-8 focus:ring-2 focus:ring-primary"
              tabIndex={0}
            >
              {t(opt.labelEn, opt.labelHeb)}
            </Button>
          ))}
        </div>
      </div>

      <div className="text-xs text-muted-foreground font-body opacity-60">
        {t("Zmanim for", HEB_UI.zmanim_for)} {location.name} · {t("Times are approximate", HEB_UI.times_approx)}
      </div>
    </div>
  );
}