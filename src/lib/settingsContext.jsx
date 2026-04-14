import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext(null);

export const HEB_UI = {
  sync_zmanim: "סנכרון זמנים",
  sync_zmanim_description: "סנכרן זמני תפילה לליומן הטלפון שלך",
  sync_duration_days: "משך (ימים)",
};

export const ALL_ZMANIM = [
  { key: 'sunrise', labelEn: 'Sunrise', labelHeb: 'עלות השחר' },
  { key: 'sunset', labelEn: 'Sunset', labelHeb: 'שקיעה' },
];

export function SettingsProvider({ children }) {
  const [syncZmanimDays, setSyncZmanimDays] = useState(30);
  const [settings, setSettings] = useState({
    location: { lat: 40.7128, lng: -74.0060, name: 'New York', tzid: 'America/New_York' },
    hebrewMode: false,
    celsiusMode: false,
    showWeather: true,
    syncZmanimDays,
    setSyncZmanimDays,
    zmanimVisible: { sunrise: true, sunset: true },
    showZmanimSeconds: false,
  });

  return (
    <SettingsContext.Provider value={{ ...settings, syncZmanimDays, setSyncZmanimDays }}>
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