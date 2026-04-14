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
  if (!('serviceWorker' in navigator)) return;
  
  const now = new Date();
  const nextNotification = new Date();
  nextNotification.setHours(hour, minute, 0, 0);
  
  if (nextNotification <= now) {
    nextNotification.setDate(nextNotification.getDate() + 1);
  }
  
  const delay = nextNotification.getTime() - now.getTime();
  
  // Schedule notification for tomorrow if already past today's time
  setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/icon-192x192.png' });
    }
    // Reschedule for next day
    scheduleDailyNotification({ title, body, hour, minute });
  }, delay);
}

export async function cancelDailyNotifications() {
  // Notifications are timer-based, so no explicit cleanup needed
  // The app lifecycle handles timer cleanup
}