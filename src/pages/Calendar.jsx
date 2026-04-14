import React, { useState, useEffect, useCallback } from "react";
import { addDays, addWeeks, addMonths, addYears } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SettingsProvider, useSettings } from "@/lib/settingsContext";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import DayView from "@/components/calendar/DayView";
import WeekView from "@/components/calendar/WeekView";
import MonthView from "@/components/calendar/MonthView";
import YearView from "@/components/calendar/YearView";
import StatusBar from "@/components/calendar/StatusBar.jsx";
import DailyBanner from "@/components/calendar/DailyBanner.jsx";
import BottomNav from "@/components/calendar/BottomNav.jsx";
import { initPushNotifications, scheduleDailyNotification } from "@/lib/pushNotifications";

const VIEWS = ["day", "week", "month", "year"];
const VIEW_VARIANTS = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export default function Calendar() {
  return (
    <SettingsProvider>
      <CalendarAppContent />
    </SettingsProvider>
  );
}

function CalendarAppContent() {
  const navigate = useNavigate();
  const { view = "month" } = useParams();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [direction, setDirection] = useState(0);

  const handleNavigate = useCallback((dir) => {
    setDirection(dir);
    setCurrentDate((prev) => {
      if (view === "day") return addDays(prev, dir);
      if (view === "week") return addWeeks(prev, dir);
      if (view === "month") return addMonths(prev, dir);
      if (view === "year") return addYears(prev, dir);
      return prev;
    });
  }, [view]);

  const handleToday = useCallback(() => setCurrentDate(new Date()), []);

  const handleDateSelect = (date) => {
    setCurrentDate(date);
    if (view === "year") navigate("/month");
    else if (view === "month") navigate("/day");
    else if (view === "week") navigate("/day");
  };

  const cycleView = useCallback((dir) => {
    const idx = VIEWS.indexOf(view);
    const next = (idx + dir + VIEWS.length) % VIEWS.length;
    setDirection(dir);
    navigate(`/${VIEWS[next]}`);
  }, [view, navigate]);

  // Initialize push notifications and request permissions on startup
  useEffect(() => {
    const initPermissions = async () => {
      await initPushNotifications();
      // Request location permission for weather/zmanim
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => console.log('Location permission granted'),
          () => console.log('Location permission denied')
        );
      }
    };
    
    initPermissions();
    
    scheduleDailyNotification({
      title: "Jewish Calendar",
      body: "Tap to see today's Hebrew date, Zmanim & weather",
      hour: 8,
      minute: 0,
    });
  }, []);

  // Handle hardware back button (mobile)
  useEffect(() => {
    const handleBackButton = () => {
      const idx = VIEWS.indexOf(view);
      if (idx > 0) {
        navigate(`/${VIEWS[idx - 1]}`);
      }
    };

    document.addEventListener("backbutton", handleBackButton);
    return () => document.removeEventListener("backbutton", handleBackButton);
  }, [view, navigate]);

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
          navigate("/day");
          break;
        case "2":
          navigate("/week");
          break;
        case "3":
          navigate("/month");
          break;
        case "9":
          navigate("/year");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNavigate, handleToday, cycleView, navigate]);

  return (
    <>
      <DailyBanner />
      <div className="min-h-screen bg-background safe-area-inset-top pb-16 md:pb-0">
        <StatusBar />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <CalendarHeader
            currentDate={currentDate}
            view={view}
            onViewChange={(v) => navigate(`/${v}`)}
            onNavigate={handleNavigate}
            onToday={handleToday}
          />

          <div className="mt-2">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={view}
                custom={direction}
                variants={VIEW_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {view === "day" && <DayView date={currentDate} />}
                {view === "week" && <WeekView date={currentDate} onDateSelect={handleDateSelect} />}
                {view === "month" && <MonthView date={currentDate} onDateSelect={handleDateSelect} />}
                {view === "year" && <YearView date={currentDate} onDateSelect={handleDateSelect} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Keyboard shortcut hint */}
          <div className="mt-6 text-center text-[10px] text-muted-foreground font-body opacity-40 hidden md:block">
            ← → Navigate · ↑ ↓ Change view · Enter = Today · 1=Day 3=Month 9=Year
          </div>
        </div>

        <BottomNav />
      </div>
    </>
  );
}