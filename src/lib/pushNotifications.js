// Request browser notification permission
export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  
  const result = await Notification.requestPermission();
  return result === 'granted';
}

// Request geolocation permission
export async function requestLocationPermission() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      () => resolve(true),
      () => resolve(false)
    );
  });
}

export async function initPushNotifications({ onToken, onNotification } = {}) {
  await requestNotificationPermission();
}

export async function scheduleDailyNotification({ title, body, hour = 8, minute = 0 } = {}) {
  // No-op in web environment. Wire up real Capacitor calls after `npx cap add android`.
}