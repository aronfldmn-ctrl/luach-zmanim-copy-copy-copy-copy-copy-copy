import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext(null);

export const HEB_UI = {
  sync_zmanim: "סנכרון זמנים",
  sync_zmanim_description: "סנכרן זמני תפילה לליומן הטלפון שלך",
  sync_duration_days: "משך (ימים)",
  settings: "הגדרות",
  language: "שפה",
  location: "מיקום",
  search_city: "חיפוש עיר",
  candle_lighting_minutes: "הדלקת נרות",
  show_zmanim: "הצג זמנים",
  show_weather: "הצג מזג אוויר",
  daf_yomi: "דף יומי",
  notifications: "הודעות",
  enable_notifications: "הודעות מזג אוויר וגיליון עברי",
  auto_sync_location: "סנכרון אוטומטי של מיקום",
  auto_sync_location_desc: "גלה ועדכן אוטומטית את המיקום שלך",
};

export const ALL_ZMANIM = [
  { key: 'sunrise', labelEn: 'Sunrise', labelHeb: 'עלות השחר' },
  { key: 'sunset', labelEn: 'Sunset', labelHeb: 'שקיעה' },
];

export function SettingsProvider({ children }) {
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.0060, name: 'New York', tzid: 'America/New_York' });
  const [hebrewMode, setHebrewMode] = useState(false);
  const [celsiusMode, setCelsiusMode] = useState(false);
  const [showWeather, setShowWeather] = useState(true);
  const [zmanimVisible, setZmanimVisible] = useState({ sunrise: true, sunset: true });
  const [showZmanimSeconds, setShowZmanimSeconds] = useState(false);
  const [showZmanim, setShowZmanim] = useState(true);
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [showDafYomi, setShowDafYomi] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(false);
  const [autoSyncLocation, setAutoSyncLocation] = useState(false);
  const [holidayFilters, setHolidayFilters] = useState({ yom_tov: true, fast: true, minor: true });
  const [candleLightingMinutes, setCandleLightingMinutes] = useState(18);
  const [syncZmanimDays, setSyncZmanimDays] = useState(30);

  const value = {
    location, setLocation,
    hebrewMode, setHebrewMode,
    celsiusMode, setCelsiusMode,
    showWeather, setShowWeather,
    zmanimVisible, setZmanimVisible,
    showZmanimSeconds, setShowZmanimSeconds,
    showZmanim, setShowZmanim,
    showStatusBar, setShowStatusBar,
    showDafYomi, setShowDafYomi,
    enableNotifications, setEnableNotifications,
    autoSyncLocation, setAutoSyncLocation,
    holidayFilters, setHolidayFilters,
    candleLightingMinutes, setCandleLightingMinutes,
    syncZmanimDays, setSyncZmanimDays,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}