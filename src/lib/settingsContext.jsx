import { createContext, useContext, useState } from "react";
import { HOLIDAY_CATEGORIES } from "./holidayUtils";

const DEFAULT_LOCATION = {
  name: "New York, NY",
  lat: 40.7128,
  lng: -74.006,
  tzid: "America/New_York",
};

const DEFAULT_ZMANIM_VISIBLE = {
  alotHaShachar: true,
  zmanTzitzit: true,
  sunrise: true,
  sofShmaGRA: true,
  sofShmaMA: false,
  sofTfila: true,
  midday: true,
  minchaGedolah: true,
  plagHaMincha: true,
  sunset: true,
  candleLighting: true,
  tzeitKochavim: true,
  rabbeinuTam: true,
};

const DEFAULT_HOLIDAY_FILTERS = {
  [HOLIDAY_CATEGORIES.YOM_TOV]: true,
  [HOLIDAY_CATEGORIES.INTERMEDIATE]: true,
  [HOLIDAY_CATEGORIES.FAST]: true,
  [HOLIDAY_CATEGORIES.MINOR]: true,
  [HOLIDAY_CATEGORIES.OBSERVANCE]: true,
};

const SettingsContext = createContext(null);

function loadFromStorage(key, fallback) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return fallback;
    }
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error(`Failed to load ${key} from storage:`, e);
    return fallback;
  }
}

export function SettingsProvider({ children }) {
  const [location, setLocationState] = useState(() => loadFromStorage("jcal_location", DEFAULT_LOCATION));
  const [zmanimVisible, setZmanimVisibleState] = useState(() => loadFromStorage("jcal_zmanim_visible", DEFAULT_ZMANIM_VISIBLE));
  const [showZmanim, setShowZmanimState] = useState(() => loadFromStorage("jcal_show_zmanim", true));
  const [showWeather, setShowWeatherState] = useState(() => loadFromStorage("jcal_show_weather", true));
  const [candleLightingMinutes, setCandleLightingMinutesState] = useState(() => loadFromStorage("jcal_candle_minutes", 18));
  const [hebrewMode, setHebrewModeState] = useState(() => loadFromStorage("jcal_hebrew_mode", false));
  const [celsiusMode, setCelsiusModeState] = useState(() => loadFromStorage("jcal_celsius_mode", false));
  const [showZmanimSeconds, setShowZmanimSecondsState] = useState(() => loadFromStorage("jcal_zmanim_seconds", false));
  const [showStatusBar, setShowStatusBarState] = useState(() => loadFromStorage("jcal_status_bar", true));
  const [showDafYomi, setShowDafYomiState] = useState(() => loadFromStorage("jcal_show_daf_yomi", true));
  const [enableNotifications, setEnableNotificationsState] = useState(() => loadFromStorage("jcal_notifications", false));
  const [syncZmanimDays, setSyncZmanimDaysState] = useState(() => loadFromStorage("jcal_sync_zmanim_days", 7));
  const [autoSyncLocation, setAutoSyncLocationState] = useState(() => loadFromStorage("jcal_auto_sync_location", false));
  const [holidayFilters, setHolidayFiltersState] = useState(() => loadFromStorage("jcal_holiday_filters", DEFAULT_HOLIDAY_FILTERS));

  const setLocation = (loc) => {
    setLocationState(loc);
    localStorage.setItem("jcal_location", JSON.stringify(loc));
  };
  const setZmanimVisible = (v) => {
    setZmanimVisibleState(v);
    localStorage.setItem("jcal_zmanim_visible", JSON.stringify(v));
  };
  const setShowZmanim = (v) => {
    setShowZmanimState(v);
    localStorage.setItem("jcal_show_zmanim", JSON.stringify(v));
  };
  const setShowWeather = (v) => {
    setShowWeatherState(v);
    localStorage.setItem("jcal_show_weather", JSON.stringify(v));
  };
  const setCandleLightingMinutes = (v) => {
    setCandleLightingMinutesState(v);
    localStorage.setItem("jcal_candle_minutes", JSON.stringify(v));
  };
  const setHebrewMode = (v) => {
    setHebrewModeState(v);
    localStorage.setItem("jcal_hebrew_mode", JSON.stringify(v));
  };
  const setCelsiusMode = (v) => {
    setCelsiusModeState(v);
    localStorage.setItem("jcal_celsius_mode", JSON.stringify(v));
  };
  const setShowZmanimSeconds = (v) => {
    setShowZmanimSecondsState(v);
    localStorage.setItem("jcal_zmanim_seconds", JSON.stringify(v));
  };
  const setShowStatusBar = (v) => {
    setShowStatusBarState(v);
    localStorage.setItem("jcal_status_bar", JSON.stringify(v));
  };
  const setShowDafYomi = (v) => {
    setShowDafYomiState(v);
    localStorage.setItem("jcal_show_daf_yomi", JSON.stringify(v));
  };
  const setEnableNotifications = (v) => {
    setEnableNotificationsState(v);
    localStorage.setItem("jcal_notifications", JSON.stringify(v));
  };
  const setSyncZmanimDays = (v) => {
    setSyncZmanimDaysState(v);
    localStorage.setItem("jcal_sync_zmanim_days", JSON.stringify(v));
  };
  const setAutoSyncLocation = (v) => {
    setAutoSyncLocationState(v);
    localStorage.setItem("jcal_auto_sync_location", JSON.stringify(v));
  };
  const setHolidayFilters = (v) => {
    setHolidayFiltersState(v);
    localStorage.setItem("jcal_holiday_filters", JSON.stringify(v));
  };

  return (
    <SettingsContext.Provider value={{
      location, setLocation,
      zmanimVisible, setZmanimVisible,
      showZmanim, setShowZmanim,
      showWeather, setShowWeather,
      candleLightingMinutes, setCandleLightingMinutes,
      hebrewMode, setHebrewMode,
      celsiusMode, setCelsiusMode,
      showZmanimSeconds, setShowZmanimSeconds,
      showStatusBar, setShowStatusBar,
      showDafYomi, setShowDafYomi,
      enableNotifications, setEnableNotifications,
      syncZmanimDays, setSyncZmanimDays,
      autoSyncLocation, setAutoSyncLocation,
      holidayFilters, setHolidayFilters,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

export const ALL_ZMANIM = [
  { key: "alotHaShachar", labelEn: "Alot HaShachar", labelHeb: "עלות השחר" },
  { key: "zmanTzitzit", labelEn: "Zman Tzitzit", labelHeb: "זמן ציצית" },
  { key: "sunrise", labelEn: "Sunrise (Hanetz)", labelHeb: "הנץ החמה" },
  { key: "sofShmaGRA", labelEn: "Sof Zman Kriat Shema (GRA)", labelHeb: "סוף זמן ק״ש (גר״א)" },
  { key: "sofShmaMA", labelEn: "Sof Zman Kriat Shema (M\"A)", labelHeb: 'סוף זמן ק״ש (מ"א)' },
  { key: "sofTfila", labelEn: "Sof Zman Tfila (GRA)", labelHeb: "סוף זמן תפילה" },
  { key: "midday", labelEn: "Chatzot HaYom", labelHeb: "חצות היום" },
  { key: "minchaGedolah", labelEn: "Mincha Gedolah", labelHeb: "מנחה גדולה" },
  { key: "plagHaMincha", labelEn: "Plag HaMincha", labelHeb: "פלג המנחה" },
  { key: "sunset", labelEn: "Shkiyah (Sunset)", labelHeb: "שקיעה" },
  { key: "candleLighting", labelEn: "Candle Lighting", labelHeb: "הדלקת נרות" },
  { key: "tzeitKochavim", labelEn: "Tzet HaKochavim", labelHeb: "צאת הכוכבים" },
  { key: "rabbeinuTam", labelEn: "Zman Rabbeinu Tam", labelHeb: "זמן רבינו תם" },
];

// Hebrew translations for UI labels
export const HEB_UI = {
  // Views
  day: "יום",
  week: "שבוע",
  month: "חודש",
  year: "שנה",
  today: "היום",
  // Header
  zmanim_for: "זמנים עבור",
  times_approx: "זמנים משוערים",
  via_hebcal: "מקור: Hebcal · KosherJava",
  // Settings
  settings: "הגדרות",
  location: "מיקום",
  search_city: "חיפוש עיר...",
  show_zmanim: "הצג זמנים",
  show_weather: "הצג מזג אוויר",
  candle_lighting_minutes: "דקות לפני שקיעה לנרות",
  language: "שפה",
  hebrew_language: "עברית",
  // Weather
  weather: "מזג אוויר",
  feels_like: "מורגש",
  wind: "רוח",
  today_date: "היום",
  // Zmanim panel
  zmanim: "זמנים",
  no_zmanim: "אין זמנים מופעלים",
  shabbat_shalom: "שבת שלום!",
  light_candles_at: "הדלק נרות ב-",
  havdalah_after: "הבדלה אחרי",
  // Week view  
  sun: "ראשון",
  mon: "שני",
  tue: "שלישי",
  wed: "רביעי",
  thu: "חמישי",
  fri: "שישי",
  shabbat: "שבת",
  // Month holidays
  min_before_sunset: "דק' לפני שקיעה",
  // Weather views
   daily: "יומי",
   hourly: "שעתי",
   weekly: "שבועי",
   // Daf Yomi
   daf_yomi: "דף היומי",
    show_daf_yomi: "הצג דף היומי",
    notifications: "התראות",
    enable_notifications: "הפעל התראות למזג אוויר והתאריך העברי",
    sync_zmanim: "סנכרן זמנים לליומן",
    sync_zmanim_description: "סנכרן זמני תפילה לליומן הטלפון שלך",
    sync_duration_days: "מספר ימים",
    auto_sync_location: "Auto-sync location",
    auto_sync_location_desc: "Automatically detect and update your location",
   };