import React from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";
import { getJewishHoliday, isShabbat, getHebrewDate } from "@/lib/hebrewDateUtils";
import { useSettings } from "@/lib/settingsContext";
import { cn } from "@/lib/utils";

function MiniMonth({ monthDate, selectedDate, onDateSelect, onMonthSelect, hebrewMode }) {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const today = new Date();

  const days = [];
  let current = calendarStart;
  while (current <= calendarEnd) {
    days.push(new Date(current));
    current = addDays(current, 1);
  }

  // Get Hebrew month name(s) for this Gregorian month (use 1st and 15th to cover both Hebrew months)
  const heb1 = getHebrewDate(monthStart);
  const hebMid = getHebrewDate(new Date(monthDate.getFullYear(), monthDate.getMonth(), 15));
  const sameMonth = heb1.monthName === hebMid.monthName;
  const hebMonthsEn = sameMonth ? heb1.monthName : `${heb1.monthName} – ${hebMid.monthName}`;
  const hebMonthsHeb = sameMonth ? heb1.monthNameHeb : `${heb1.monthNameHeb} – ${hebMid.monthNameHeb}`;

  const engName = format(monthDate, "MMMM");

  return (
    <div className="bg-card border border-border rounded-lg p-3 hover:shadow-md transition-shadow">
      <button
        onClick={() => onMonthSelect(monthDate)}
        className="w-full text-center mb-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1"
      >
        <h3 className="font-heading font-semibold text-sm text-foreground leading-tight">
          {engName}
        </h3>
        <p className="text-[10px] text-muted-foreground font-body" dir="rtl">
          {hebrewMode ? hebMonthsHeb : hebMonthsEn}
        </p>
      </button>
      <div className="grid grid-cols-7 gap-0">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-center text-[9px] font-body text-muted-foreground py-0.5">
            {d}
          </div>
        ))}
        {days.map((day) => {
          const inMonth = isSameMonth(day, monthDate);
          const isToday = isSameDay(day, today);
          const holiday = getJewishHoliday(day);
          const shabbat = isShabbat(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={cn(
                "text-[10px] font-body py-0.5 rounded transition-colors",
                !inMonth && "opacity-20",
                inMonth && "hover:bg-muted",
                isToday && "bg-accent text-white font-bold",
                holiday && inMonth && !isToday && "text-accent font-semibold",
                shabbat && inMonth && !isToday && !holiday && "text-muted-foreground"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function YearView({ date, onDateSelect }) {
  const year = date.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  const { hebrewMode } = useSettings();

  const handleMonthClick = (monthDate) => {
    onDateSelect(monthDate);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {months.map((monthDate) => (
        <MiniMonth
          key={monthDate.toISOString()}
          monthDate={monthDate}
          selectedDate={date}
          onDateSelect={onDateSelect}
          onMonthSelect={handleMonthClick}
          hebrewMode={hebrewMode}
        />
      ))}
    </div>
  );
}