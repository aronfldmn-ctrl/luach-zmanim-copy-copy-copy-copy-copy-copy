import React from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { getHebrewDate, getJewishHoliday, isShabbat, isFriday } from "@/lib/hebrewDateUtils";
import { useWeekZmanim } from "@/lib/useWeekZmanim";
import { Star, Flame, Sunrise, Sunset } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WeekView({ date, onDateSelect }) {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();
  const zmanimMap = useWeekZmanim(date);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Shabbat"].map((d) => (
          <div key={d} className="text-center text-xs font-body font-medium text-muted-foreground uppercase tracking-wider py-2">
            {d}
          </div>
        ))}
      </div>

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
                "flex flex-col rounded-lg border p-2 md:p-3 min-h-[140px] md:min-h-[180px] transition-all text-left hover:shadow-md",
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
                  <div className="flex items-center gap-1 text-[10px] text-accent font-body font-medium">
                    <Flame className="h-2.5 w-2.5" />
                    <span>{zmanim.candleLighting || "..."}</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}