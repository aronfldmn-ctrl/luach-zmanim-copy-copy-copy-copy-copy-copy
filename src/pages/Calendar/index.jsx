import React, { useState, useCallback, useRef, useEffect } from "react";
import { addDays, addWeeks, addMonths, addYears } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import DayView from "@/components/calendar/DayView";
import WeekView from "@/components/calendar/WeekView";
import MonthView from "@/components/calendar/MonthView";
import YearView from "@/components/calendar/YearView";
import StatusBar from "@/components/calendar/StatusBar";
import DailyBanner from "@/components/calendar/DailyBanner";
import BottomNav from "@/components/calendar/BottomNav.jsx";
import { useKeyboardNavigation } from "@/lib/useKeyboardNavigation";
import { useSettings } from "@/lib/settingsContext";
import { scheduleDailyNotification, requestNotificationPermission } from "@/lib/pushNotifications";
import { getHebrewDate } from "@/lib/hebrewDateUtils";

const VIEWS = ["day", "week", "month", "year"];

function Calendar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [pullRefresh, setPullRefresh] = useState(0);
  const scrollContainerRef = useRef(null);
  const touchStartRef = useRef(0);
  const { autoSyncLocation, setLocation, showStatusBar, enableNotifications } = useSettings();

  const view = location.pathname.slice(1) || "month";
  const isValidView = VIEWS.includes(view);
  const activeView = isValidView ? view : "month";

  const handleTouchStart = (e) => {
    if (scrollContainerRef.current?.scrollTop === 0) {
      touchStartRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (scrollContainerRef.current?.scrollTop === 0 && touchStartRef.current) {
      const delta = e.touches[0].clientY - touchStartRef.current;
      if (delta > 0) {
        setPullRefresh(Math.min(delta / 100, 1));
      }
    }
  };

  const handleTouchEnd = () => {
    setPullRefresh(0);
    touchStartRef.current = 0;
  };

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

  useEffect(() => {
    if (autoSyncLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const tzid = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let name = "Current Location";
        
        try {
          const nameRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const nameData = await nameRes.json();
          name = nameData.address?.city || nameData.address?.town || "Current Location";
        } catch (err) {
          // Offline or API unavailable - use default location name
          console.log("Location name lookup unavailable, using default");
        }
        
        setLocation({ name, lat, lng, tzid });
      });
    }
  }, [autoSyncLocation, setLocation]);

  useEffect(() => {
    if (enableNotifications) {
      requestNotificationPermission().then((granted) => {
        if (granted) {
          const heb = getHebrewDate(new Date());
          scheduleDailyNotification({
            title: "Jewish Calendar",
            body: `Today is ${heb.displayHeb}`,
            hour: 8,
            minute: 0,
          });
        }
      });
    }
  }, [enableNotifications]);

  useKeyboardNavigation({
    up: () => handleNavigate(-1),
    down: () => handleNavigate(1),
    left: () => handleNavigate(-1),
    right: () => handleNavigate(1),
    select: () => handleDateSelect(currentDate),
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {showStatusBar && <StatusBar />}
      <DailyBanner />

      <main
        ref={scrollContainerRef}
        className="flex-1 p-4 md:p-6 pb-20 overflow-auto relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {pullRefresh > 0 && (
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: pullRefresh }}
          >
            <div className="w-8 h-8 border-2 border-primary rounded-full"
              style={{
                borderTopColor: "transparent",
                transform: `rotate(${pullRefresh * 360}deg)`
              }}
            />
          </motion.div>
        )}

        <div className="max-w-7xl mx-auto">
          <CalendarHeader
            currentDate={currentDate}
            view={activeView}
            onViewChange={handleViewChange}
            onNavigate={handleNavigate}
            onToday={handleToday}
          />

          <motion.div
            key={activeView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
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
          </motion.div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

export default Calendar;