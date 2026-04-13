import { useState, useEffect } from "react";
import { fetchZmanim } from "./hebrewDateUtils";
import { useSettings } from "./settingsContext";

const EMPTY_ZMANIM = {
  alotHaShachar: "...", zmanTzitzit: "...", sunrise: "...",
  sofShmaGRA: "...", sofShmaMA: "...", sofTfila: "...",
  midday: "...", minchaGedolah: "...", plagHaMincha: "...",
  sunset: "...", candleLighting: "...", tzeitKochavim: "...", rabbeinuTam: "...",
};

export function useZmanim(date) {
  const { location, candleLightingMinutes } = useSettings();
  const [zmanim, setZmanim] = useState(EMPTY_ZMANIM);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchZmanim(date, location.lat, location.lng, location.tzid, candleLightingMinutes)
      .then((z) => { setZmanim(z); setLoading(false); })
      .catch(() => setLoading(false));
  }, [
    date.getFullYear(), date.getMonth(), date.getDate(),
    location.lat, location.lng, candleLightingMinutes
  ]);

  return { zmanim, loading };
}