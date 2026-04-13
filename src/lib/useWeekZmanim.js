import { useState, useEffect } from "react";
import { fetchZmanim } from "./hebrewDateUtils";
import { useSettings } from "./settingsContext";
import { startOfWeek, addDays } from "date-fns";

export function useWeekZmanim(date) {
  const { location, candleLightingMinutes } = useSettings();
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const [zmanimMap, setZmanimMap] = useState({});

  useEffect(() => {
    const tz = location.tzid || Intl.DateTimeFormat().resolvedOptions().timeZone;
    Promise.all(
      days.map((d) => fetchZmanim(d, location.lat, location.lng, tz, candleLightingMinutes).then((z) => ({ d, z })))
    ).then((results) => {
      const map = {};
      results.forEach(({ d, z }) => { map[d.toDateString()] = z; });
      setZmanimMap(map);
    });
  }, [weekStart.toDateString(), location.lat, location.lng, candleLightingMinutes]);

  return zmanimMap;
}