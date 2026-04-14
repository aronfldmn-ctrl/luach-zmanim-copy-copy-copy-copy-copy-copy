import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";
import { getHebrewDate, getJewishHoliday, getJewishHolidays, isShabbat, isFriday, fetchZmanim } from "@/lib/hebrewDateUtils";
import { useSettings, HEB_UI } from "@/lib/settingsContext";
import { fetchParasha } from "@/lib/parasha";
import { getHolidayCategoryDynamic } from "@/lib/holidayUtils";
import HolidayBadge from "./HolidayBadge";
import { Flame, BookOpen, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getImportedEventsForDate } from "./ZmanimSync";
import SidePanel from "./SidePanel";

const DAY_LABELS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Shabbat"];
const DAY_LABELS_HEB = [HEB_UI.sun, HEB_UI.mon, HEB_UI.tue, HEB_UI.wed, HEB_UI.thu, HEB_UI.fri, HEB_UI.shabbat];

export default function MonthView({ date, onDateSelect, onWeekSelect }) {
  const { location, hebrewMode, candleLightingMinutes, holidayFilters } = useSettings();
  const [zmanimMap, setZmanimMap] = useState({});
  const [parashaMap, setParashaMap] = useState({});

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

  useEffect(() => {
    const fridays = days.filter((d) => isFriday(d));
    const tz = location.tzid || Intl.DateTimeFormat().resolvedOptions().timeZone;
    Promise.all(
      fridays.map((d) => fetchZmanim(d, location.lat, location.lng, tz, candleLightingMinutes).then((z) => ({ d, z })))
    ).then((results) => {
      const map = {};
      results.forEach(({ d, z }) => { map[d.toDateString()] = z; });
      setZmanimMap(map);
    });
  }, [date.getFullYear(), date.getMonth(), location.lat, location.lng, candleLightingMinutes]);

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Fetch parasha for each Shabbat in the visible weeks
  useEffect(() => {
    const shabbatDays = weeks.map(week => week.find(d => d.getDay() === 6)).filter(Boolean);
    Promise.all(
      shabbatDays.map(d => fetchParasha(d).then(p => ({ key: d.toDateString(), p })))
    ).then(results => {
      const map = {};
      results.forEach(({ key, p }) => { if (p) map[key] = p; });
      setParashaMap(map);
    });
  }, [date.getFullYear(), date.getMonth()]);

  const dayLabels = hebrewMode ? DAY_LABELS_HEB : DAY_LABELS_EN;
  const t = (en, heb) => hebrewMode ? heb : en;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <div className="grid grid-cols-7 mb-2">
          {dayLabels.map((d, i) => (
            <div key={i} className="text-center text-xs font-body font-medium text-muted-foreground uppercase tracking-wider py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          {weeks.map((week, wi) => {
            const shabbatDay = week.find(d => d.getDay() === 6);
            const weekParasha = shabbatDay ? parashaMap[shabbatDay.toDateString()] : null;
            return (
            <div key={wi} className="border-b border-border last:border-0">
              {/* Parasha label row */}
              {weekParasha && (
                <button
                  onClick={() => onWeekSelect && onWeekSelect(shabbatDay)}
                  className="w-full flex items-center gap-1.5 px-2 py-1 bg-primary/5 border-b border-primary/10 hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                >
                  <BookOpen className="h-3 w-3 text-primary flex-shrink-0" />
                  <span className="text-[10px] font-body text-primary font-semibold">
                    {t(weekParasha.en, weekParasha.heb)}
                  </span>
                  {!hebrewMode && <span className="text-[10px] text-muted-foreground font-body" dir="rtl">{weekParasha.heb}</span>}
                </button>
              )}
              <div className="grid grid-cols-7">
              {week.map((day) => {
                const inMonth = isSameMonth(day, date);
                const isToday = isSameDay(day, today);
                const isSelected = isSameDay(day, date);
                const heb = getHebrewDate(day);
                const holidays = getJewishHolidays(day);
                const shabbat = isShabbat(day);
                const friday = isFriday(day);
                const zmanim = zmanimMap[day.toDateString()];

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => onDateSelect(day)}
                    className={cn(
                      "min-h-[80px] md:min-h-[100px] p-1.5 md:p-2 text-left border-r border-border last:border-0 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset",
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

                    {holidays.length > 0 && (
                       <div className="mt-1 space-y-1">
                         {holidays.map((holiday, idx) => 
                           holiday && holidayFilters[getHolidayCategoryDynamic(holiday)] && (
                             <div key={idx} className="inline-block">
                               <HolidayBadge holiday={holiday} compact={true} />
                             </div>
                           )
                         )}
                       </div>
                     )}

                    {friday && inMonth && (
                      <div className="flex flex-col gap-0.5 mt-0.5">
                        <div className="flex items-center gap-0.5">
                          <Flame className="h-2.5 w-2.5 text-accent flex-shrink-0" />
                          <span className="text-[9px] font-body text-accent">
                            {zmanim ? zmanim.candleLighting : "..."}
                          </span>
                        </div>
                        <span className="text-[8px] text-muted-foreground font-body pl-3">
                          {t(`${candleLightingMinutes}m before`, `${candleLightingMinutes} דק'`)}
                        </span>
                      </div>
                    )}

                    {getImportedEventsForDate(day).length > 0 && inMonth && (
                      <div className="mt-1 flex items-center gap-1">
                        <CalendarIcon className="h-2.5 w-2.5 text-primary flex-shrink-0" />
                        <span className="text-[8px] font-body text-primary">{t("Event", "אירוע")}</span>
                      </div>
                    )}
                  </button>
                );
              })}
              </div>
            </div>
          );})}
        </div>
      </div>

      <div>
        <SidePanel date={date} />
      </div>
    </div>
  );
}