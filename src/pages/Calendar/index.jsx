import React, { useState, useCallback } from "react";
import { addDays, addWeeks, addMonths, addYears } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import DayView from "@/components/calendar/DayView";
import WeekView from "@/components/calendar/WeekView";
import MonthView from "@/components/calendar/MonthView";
import YearView from "@/components/calendar/YearView";
import StatusBar from "@/components/calendar/StatusBar";
import DailyBanner from "@/components/calendar/DailyBanner";
import BottomNav from "@/components/calendar/BottomNav";
import { useKeyboardNavigation } from "@/lib/useKeyboardNavigation";

const VIEWS = ["day", "week", "month", "year"];

function Calendar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  const view = location.pathname.slice(1) || "month";
  const isValidView = VIEWS.includes(view);
  const activeView = isValidView ? view : "month";

  const handleNavigate = useCallback(
    (direction) => {
      setCurrentDate((prev) => {
        switch (activeView) {
          case "day":
            return addDays(prev, direction);
          case "week":
            return addWeeks(prev, direction);
          case "month":
            return addMonths(prev, direction);
          case "year":
            return addYears(prev, direction);
          default:
            return prev;
        }
      });
    },
    [activeView]
  );

  const handleViewChange = useCallback((newView) => {
    if (VIEWS.includes(newView)) {
      navigate(`/${newView}`);
    }
  }, [navigate]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const handleDateSelect = useCallback((date) => {
    setCurrentDate(date);
    navigate("/day");
  }, [navigate]);

  const handleMonthSelect = useCallback((date) => {
    setCurrentDate(date);
    navigate("/month");
  }, [navigate]);

  const handleWeekSelect = useCallback((date) => {
    setCurrentDate(date);
    navigate("/week");
  }, [navigate]);

  useKeyboardNavigation({
    up: () => handleNavigate(-1),
    down: () => handleNavigate(1),
    left: () => handleNavigate(-1),
    right: () => handleNavigate(1),
    select: () => handleDateSelect(currentDate),
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StatusBar />
      <DailyBanner />

      <main className="flex-1 p-4 md:p-6 pb-20 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <CalendarHeader
            currentDate={currentDate}
            view={activeView}
            onViewChange={handleViewChange}
            onNavigate={handleNavigate}
            onToday={handleToday}
          />

          {activeView === "day" && <DayView date={currentDate} />}
          {activeView === "week" && (
            <WeekView date={currentDate} onDateSelect={handleDateSelect} />
          )}
          {activeView === "month" && (
            <MonthView date={currentDate} onDateSelect={handleDateSelect} onWeekSelect={handleWeekSelect} />
          )}
          {activeView === "year" && (
            <YearView date={currentDate} onDateSelect={handleDateSelect} onMonthSelect={handleMonthSelect} />
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

export default Calendar;