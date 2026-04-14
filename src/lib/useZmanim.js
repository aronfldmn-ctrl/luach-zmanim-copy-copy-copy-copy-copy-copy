import { useState, useEffect } from "react";
import { fetchZmanim } from "./hebrewDateUtils";
import { useSettings } from "./settingsContext";
import { getFromCache, setInCache } from "./cacheUtils";

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
    const cacheKey = `zmanim_${date.getFullYear()}_${date.getMonth()}_${date.getDate()}_${location.lat}_${location.lng}`;
    
    // Try cache first
    const cached = getFromCache(cacheKey);
    if (cached) {
      setZmanim(cached);
      setLoading(false);
      return;
    }
    
    fetchZmanim(date, location.lat, location.lng, location.tzid, candleLightingMinutes)
      .then((z) => {
        setZmanim(z);
        setInCache(cacheKey, z); // Cache for 24 hours (default)
        setLoading(false);
      })
      .catch(() => {
        // Fallback to cache if fetch fails
        const fallback = getFromCache(cacheKey);
        if (fallback) setZmanim(fallback);
        setLoading(false);
      });
  }, [
    date.getFullYear(), date.getMonth(), date.getDate(),
    location.lat, location.lng, candleLightingMinutes
  ]);

  return { zmanim, loading };
}