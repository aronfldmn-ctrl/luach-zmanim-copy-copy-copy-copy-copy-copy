import React, { useState, useEffect, useCallback } from "react";
import { addDays, addWeeks, addMonths, addYears } from "date-fns";
import { SettingsProvider } from "@/lib/settingsContext";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import DayView from "@/components/calendar/DayView";
import WeekView from "@/components/calendar/WeekView";
import MonthView from "@/components/calendar/MonthView";
import YearView from "@/components/calendar/YearView";

const VIEWS = ["day", "week", "month", "year"];

function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");

  const handleNavigate = useCallback((direction) => {
    setCurrentDate((prev) => {
      if (view === "day") return addDays(prev, direction);
      if (view === "week") return addWeeks(prev, direction);
      if (view === "month") return addMonths(prev, direction);
      if (view === "year") return addYears(prev, direction);
      return prev;
    });
  }, [view]);

  const handleToday = useCallback(() => setCurrentDate(new Date()), []);

  const handleDateSelect = (date) => {
    setCurrentDate(date);
    if (view === "year") setView("month");
    else if (view === "month") setView("day");
    else if (view === "week") setView("day");
  };

  const cycleView = useCallback((direction) => {
    setView((prev) => {
      const idx = VIEWS.indexOf(prev);
      const next = (idx + direction + VIEWS.length) % VIEWS.length;
      return VIEWS[next];
    });
  }, []);

  // D-pad / keyboard navigation for non-touch phones
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept when typing in inputs
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      switch (e.key) {
        case "ArrowLeft":
        case "4": // Phone keypad left
          e.preventDefault();
          handleNavigate(-1);
          break;
        case "ArrowRight":
        case "6": // Phone keypad right
          e.preventDefault();
          handleNavigate(1);
          break;
        case "ArrowUp":
        case "2": // Phone keypad up
          e.preventDefault();
          cycleView(-1);
          break;
        case "ArrowDown":
        case "8": // Phone keypad down
          e.preventDefault();
          cycleView(1);
          break;
        case "Enter":
        case "5": // Phone keypad center
          e.preventDefault();
          handleToday();
          break;
        case "0":
          e.preventDefault();
          handleToday();
          break;
        case "1":
          setView("day");
          break;
        case "2":
          setView("week");
          break;
        case "3":
          setView("month");
          break;
        case "9":
          setView("year");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNavigate, handleToday, cycleView]);

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
          {view === "day" && <DayView date={currentDate} />}
          {view === "week" && <WeekView date={currentDate} onDateSelect={handleDateSelect} />}
          {view === "month" && <MonthView date={currentDate} onDateSelect={handleDateSelect} />}
          {view === "year" && <YearView date={currentDate} onDateSelect={handleDateSelect} />}
        </div>

        {/* Keyboard shortcut hint */}
        <div className="mt-6 text-center text-[10px] text-muted-foreground font-body opacity-40">
          ← → Navigate · ↑ ↓ Change view · Enter = Today · 1=Day 3=Month 9=Year
        </div>
      </div>
    </div>
  );
}

export default function Calendar() {
  return (
    <SettingsProvider>
      <CalendarApp />
    </SettingsProvider>
  );
}