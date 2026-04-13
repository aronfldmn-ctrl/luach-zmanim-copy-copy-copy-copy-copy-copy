import React, { createContext, useContext, useState, useEffect } from "react";

const DEFAULT_LOCATION = {
  name: "New York, NY",
  lat: 40.7128,
  lng: -74.006,
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

const SettingsContext = createContext(null);

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function SettingsProvider({ children }) {
  const [location, setLocationState] = useState(() => loadFromStorage("jcal_location", DEFAULT_LOCATION));
  const [zmanimVisible, setZmanimVisibleState] = useState(() => loadFromStorage("jcal_zmanim_visible", DEFAULT_ZMANIM_VISIBLE));
  const [showZmanim, setShowZmanimState] = useState(() => loadFromStorage("jcal_show_zmanim", true));
  const [showWeather, setShowWeatherState] = useState(() => loadFromStorage("jcal_show_weather", true));

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

  return (
    <SettingsContext.Provider value={{
      location, setLocation,
      zmanimVisible, setZmanimVisible,
      showZmanim, setShowZmanim,
      showWeather, setShowWeather,
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
  { key: "candleLighting", labelEn: "Candle Lighting (Fri)", labelHeb: "הדלקת נרות" },
  { key: "tzeitKochavim", labelEn: "Tzet HaKochavim", labelHeb: "צאת הכוכבים" },
  { key: "rabbeinuTam", labelEn: "Zman Rabbeinu Tam", labelHeb: "זמן רבינו תם" },
];