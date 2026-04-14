// Push notification stubs — real implementation runs only in native Capacitor builds.
// In the web/browser environment these are safe no-ops.

export async function initPushNotifications({ onToken, onNotification } = {}) {
  // No-op in web environment. Wire up real Capacitor calls after `npx cap add android`.
}

export async function scheduleDailyNotification({ title, body, hour = 8, minute = 0 } = {}) {
  // No-op in web environment. Wire up real Capacitor calls after `npx cap add android`.
}