import React from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";
import { getHebrewDate, getJewishHoliday, isShabbat, isFriday, getZmanim } from "@/lib/hebrewDateUtils";
import { useSettings } from "@/lib/settingsContext";
import { Star, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import ZmanimPanel from "./ZmanimPanel";
import WeatherWidget from "./WeatherWidget";

export default function MonthView({ date, onDateSelect }) {
  const { location, showWeather } = useSettings();
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const today = new Date();

  const days = [];
  let current = calendarStart;
  while (current <= calendarEnd) {
    days.push(new Date(current));
    current = addDays(current, 1);
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Shabbat"].map((d) => (
            <div key={d} className="text-center text-xs font-body font-medium text-muted-foreground uppercase tracking-wider py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="border border-border rounded-lg overflow-hidden">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 border-b border-border last:border-0">
              {week.map((day) => {
                const inMonth = isSameMonth(day, date);
                const isToday = isSameDay(day, today);
                const isSelected = isSameDay(day, date);
                const heb = getHebrewDate(day);
                const holiday = getJewishHoliday(day);
                const shabbat = isShabbat(day);
                const friday = isFriday(day);
                const zmanim = getZmanim(day, location.lat, location.lng);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => onDateSelect(day)}
                    className={cn(
                      "min-h-[80px] md:min-h-[100px] p-1.5 md:p-2 text-left border-r border-border last:border-0 transition-colors",
                      !inMonth && "opacity-30",
                      isSelected && "bg-primary/5",
                      isToday && !isSelected && "bg-accent/5",
                      shabbat && inMonth && "bg-secondary/30",
                      "hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <span className={cn(
                        "text-sm font-body font-medium",
                        isToday && "bg-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-xs",
                        !isToday && !inMonth && "text-muted-foreground"
                      )}>
                        {format(day, "d")}
                      </span>
                      <span className="text-[10px] font-body text-accent">{heb.dayHeb}</span>
                    </div>

                    {holiday && (
                      <div className="flex items-center gap-0.5 mt-1">
                        <Star className="h-2.5 w-2.5 text-accent flex-shrink-0" />
                        <span className="text-[9px] font-body text-accent truncate">{holiday}</span>
                      </div>
                    )}

                    {friday && inMonth && (
                      <div className="flex items-center gap-0.5 mt-0.5">
                        <Flame className="h-2.5 w-2.5 text-accent flex-shrink-0" />
                        <span className="text-[9px] font-body text-accent">{zmanim.candleLighting}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Side panel */}
      <div className="space-y-4">
        {showWeather && <WeatherWidget />}
        <ZmanimPanel date={date} />
      </div>
    </div>
  );
}