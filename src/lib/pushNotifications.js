// Capacitor Push Notifications integration
// All imports are dynamic — safe to include in web builds, only activates on native Android/iOS

export async function isNativeApp() {
  try {
    const cap = await import(/* @vite-ignore */ '@capacitor/core');
    return cap.Capacitor?.isNativePlatform?.() ?? false;
  } catch {
    return false;
  }
}

export async function initPushNotifications({ onToken, onNotification } = {}) {
  const native = await isNativeApp();
  if (!native) return;

  try {
    const { PushNotifications } = await import(/* @vite-ignore */ '@capacitor/push-notifications');

    const permResult = await PushNotifications.requestPermissions();
    if (permResult.receive !== 'granted') return;

    await PushNotifications.register();

    PushNotifications.addListener('registration', (token) => {
      console.log('Push token:', token.value);
      if (onToken) onToken(token.value);
    });

    PushNotifications.addListener('registrationError', (err) => {
      console.error('Push registration error:', err);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      if (onNotification) onNotification(notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      if (onNotification) onNotification(action.notification);
    });
  } catch {
    // Capacitor not available
  }
}

export async function scheduleDailyNotification({ title, body, hour = 8, minute = 0 }) {
  const native = await isNativeApp();
  if (!native) return;

  try {
    const { LocalNotifications } = await import(/* @vite-ignore */ '@capacitor/local-notifications');

    const permResult = await LocalNotifications.requestPermissions();
    if (permResult.display !== 'granted') return;

    const now = new Date();
    const scheduled = new Date();
    scheduled.setHours(hour, minute, 0, 0);
    if (scheduled <= now) scheduled.setDate(scheduled.getDate() + 1);

    await LocalNotifications.schedule({
      notifications: [{
        id: 1001,
        title,
        body,
        schedule: { at: scheduled, repeats: true, every: 'day' },
        iconColor: '#3B4F8A',
      }],
    });
  } catch {
    // LocalNotifications not available
  }
}