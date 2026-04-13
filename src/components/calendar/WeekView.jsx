import React, { useState, useEffect } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { getHebrewDate, getJewishHoliday, isShabbat, isFriday } from "@/lib/hebrewDateUtils";
import { useWeekZmanim } from "@/lib/useWeekZmanim";
import { useSettings, HEB_UI } from "@/lib/settingsContext";
import { fetchParasha } from "@/lib/parasha";
import { Star, Flame, Sunrise, Sunset, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import SidePanel from "./SidePanel";

const DAY_LABELS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Shabbat"];
const DAY_LABELS_HEB = [HEB_UI.sun, HEB_UI.mon, HEB_UI.tue, HEB_UI.wed, HEB_UI.thu, HEB_UI.fri, HEB_UI.shabbat];

export default function WeekView({ date, onDateSelect }) {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();
  const zmanimMap = useWeekZmanim(date);
  const { hebrewMode, candleLightingMinutes } = useSettings();
  const [parasha, setParasha] = useState(null);

  const t = (en, heb) => hebrewMode ? heb : en;
  const dayLabels = hebrewMode ? DAY_LABELS_HEB : DAY_LABELS_EN;

  useEffect(() => {
    fetchParasha(date).then(setParasha);
  }, [date.toDateString()]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main calendar area */}
      <div className="lg:col-span-3 space-y-3">
        {/* Parasha banner */}
        {parasha && (
          <div className="flex items-center gap-3 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-lg">
            <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-body text-muted-foreground uppercase tracking-wider">{t("Parashat HaShavua", "פרשת השבוע")}</span>
              <span className="font-heading font-semibold text-foreground">{t(parasha.en, parasha.heb)}</span>
              <span className="text-sm text-muted-foreground font-body" dir="rtl">{parasha.heb}</span>
            </div>
          </div>
        )}

        {/* Day header labels */}
        <div className="grid grid-cols-7 gap-2">
          {dayLabels.map((d, i) => (
            <div key={i} className="text-center text-xs font-body font-medium text-muted-foreground uppercase tracking-wider py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const heb = getHebrewDate(day);
            const holiday = getJewishHoliday(day);
            const shabbat = isShabbat(day);
            const friday = isFriday(day);
            const isToday = isSameDay(day, today);
            const isSelected = isSameDay(day, date);
            const zmanim = zmanimMap[day.toDateString()] || {};

            return (
              <button
                key={day.toISOString()}
                onClick={() => onDateSelect(day)}
                className={cn(
                  "flex flex-col rounded-lg border p-2 md:p-3 min-h-[140px] md:min-h-[180px] transition-all text-left hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary",
                  isSelected ? "border-primary bg-primary/5 shadow-md" : "border-border bg-card hover:border-primary/30",
                  isToday && !isSelected && "border-accent",
                  shabbat && "bg-secondary/50"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn("text-lg font-heading font-bold", isToday ? "text-accent" : "text-foreground")}>
                    {format(day, "d")}
                  </span>
                  <span className="text-sm font-body text-accent font-medium">{heb.dayHeb}</span>
                </div>

                <p className="text-[10px] text-muted-foreground font-body mb-2 truncate">
                  {heb.monthName} {heb.day}
                </p>

                {holiday && (
                  <div className="flex items-center gap-1 mb-1.5">
                    <Star className="h-3 w-3 text-accent flex-shrink-0" />
                    <span className="text-[10px] font-body text-accent font-medium truncate">{holiday}</span>
                  </div>
                )}

                {shabbat && parasha && (
                  <div className="flex items-center gap-1 mb-1.5">
                    <BookOpen className="h-2.5 w-2.5 text-primary flex-shrink-0" />
                    <span className="text-[10px] font-body text-primary font-semibold truncate">
                      {t(parasha.en, parasha.heb)}
                    </span>
                  </div>
                )}

                <div className="mt-auto space-y-0.5">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-body">
                    <Sunrise className="h-2.5 w-2.5 text-amber-500" />
                    <span>{zmanim.sunrise || "..."}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-body">
                    <Sunset className="h-2.5 w-2.5 text-orange-500" />
                    <span>{zmanim.sunset || "..."}</span>
                  </div>
                  {friday && (
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1 text-[10px] text-accent font-body font-medium">
                        <Flame className="h-2.5 w-2.5 flex-shrink-0" />
                        <span>{zmanim.candleLighting || "..."}</span>
                      </div>
                      <span className="text-[9px] text-muted-foreground font-body pl-3.5">
                        {t(`${candleLightingMinutes} min before sunset`, `${candleLightingMinutes} דק' לפני שקיעה`)}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>


      </div>

      {/* Side panel: Zmanim / Weather tabs */}
      <div>
        <SidePanel date={date} />
      </div>
    </div>
  );
}