import React, { useState } from "react";
import { addDays, addWeeks, addMonths, addYears } from "date-fns";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import DayView from "@/components/calendar/DayView";
import WeekView from "@/components/calendar/WeekView";
import MonthView from "@/components/calendar/MonthView";
import YearView from "@/components/calendar/YearView";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");

  const handleNavigate = (direction) => {
    setCurrentDate((prev) => {
      if (view === "day") return addDays(prev, direction);
      if (view === "week") return addWeeks(prev, direction);
      if (view === "month") return addMonths(prev, direction);
      if (view === "year") return addYears(prev, direction);
      return prev;
    });
  };

  const handleToday = () => setCurrentDate(new Date());

  const handleDateSelect = (date) => {
    setCurrentDate(date);
    if (view === "year") setView("month");
    else if (view === "month") setView("day");
    else if (view === "week") setView("day");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onViewChange={setView}
          onNavigate={handleNavigate}
          onToday={handleToday}
        />

        <div className="mt-2">
          {view === "day" && <DayView date={currentDate} onDateSelect={setCurrentDate} />}
          {view === "week" && <WeekView date={currentDate} onDateSelect={handleDateSelect} />}
          {view === "month" && <MonthView date={currentDate} onDateSelect={handleDateSelect} />}
          {view === "year" && <YearView date={currentDate} onDateSelect={handleDateSelect} />}
        </div>

        <footer className="mt-8 text-center text-xs text-muted-foreground font-body opacity-60">
          Zmanim calculated for New York, NY · Times are approximate
        </footer>
      </div>
    </div>
  );
}