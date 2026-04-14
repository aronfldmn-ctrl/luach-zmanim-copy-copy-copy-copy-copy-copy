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
  { key: 'alotHaShachar', labelEn: 'Alot HaShachar', labelHeb: 'עלות השחר' },
  { key: 'zmanTzitzit', labelEn: 'Zman Tzitzit', labelHeb: 'זמן ציצית' },
  { key: 'sunrise', labelEn: 'Sunrise', labelHeb: 'הנץ החמה' },
  { key: 'sofShmaGRA', labelEn: 'Sof Shma (GRA)', labelHeb: 'סוף שמע (גר"א)' },
  { key: 'sofShmaMA', labelEn: 'Sof Shma (MGA)', labelHeb: 'סוף שמע (מ"א)' },
  { key: 'sofTfila', labelEn: 'Sof Tfila', labelHeb: 'סוף תפילה' },
  { key: 'midday', labelEn: 'Midday', labelHeb: 'חצות' },
  { key: 'minchaGedolah', labelEn: 'Mincha Gedola', labelHeb: 'מנחה גדולה' },
  { key: 'plagHaMincha', labelEn: 'Plag HaMincha', labelHeb: 'פלג המנחה' },
  { key: 'sunset', labelEn: 'Sunset', labelHeb: 'שקיעה' },
  { key: 'candleLighting', labelEn: 'Candle Lighting', labelHeb: 'הדלקת נרות' },
  { key: 'tzeitKochavim', labelEn: 'Tzeit Kochavim', labelHeb: 'צאת הכוכבים' },
  { key: 'rabbeinuTam', labelEn: 'Rabbenu Tam', labelHeb: 'רבינו תם' },
];

export function SettingsProvider({ children }) {
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.0060, name: 'New York', tzid: 'America/New_York' });
  const [hebrewMode, setHebrewMode] = useState(false);
  const [celsiusMode, setCelsiusMode] = useState(false);
  const [showWeather, setShowWeather] = useState(true);
  const [zmanimVisible, setZmanimVisible] = useState({ 
    alotHaShachar: true, 
    zmanTzitzit: true, 
    sunrise: true, 
    sofShmaGRA: true, 
    sofShmaMA: true, 
    sofTfila: true, 
    midday: true, 
    minchaGedolah: true, 
    plagHaMincha: true, 
    sunset: true, 
    candleLighting: true,
    tzeitKochavim: true, 
    rabbeinuTam: true 
  });
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