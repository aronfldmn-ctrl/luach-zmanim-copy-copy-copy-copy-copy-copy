// Offline state management and detection
import * as React from 'react';
const { useState, useEffect } = React;

let isOnline = navigator.onLine;

export function useOnlineStatus() {
  const [online, setOnline] = useState(isOnline);

  useEffect(() => {
    const handleOnline = () => {
      isOnline = true;
      setOnline(true);
    };
    const handleOffline = () => {
      isOnline = false;
      setOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return online;
}

export function isCurrentlyOnline() {
  return isOnline;
}

// Pre-cache essential data on app startup
export async function preloadOfflineData() {
  const cache = await caches.open('jcal-api-v1');
  
  // Pre-cache Hebcal data for current year ± 1 year
  const currentYear = new Date().getFullYear();
  for (let year = currentYear - 1; year <= currentYear + 1; year++) {
    const hebcalUrl = `https://www.hebcal.com/api/v1/holidays?year=${year}&short=true&i=on`;
    try {
      const response = await fetch(hebcalUrl);
      if (response.ok) {
        cache.put(hebcalUrl, response.clone());
      }
    } catch {
      // Ignore errors, will use cache if available
    }
  }
}

// Register Service Worker
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
      // Preload data after registration
      preloadOfflineData();
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}