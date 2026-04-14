// Simple cache utility with TTL (time-to-live)
const CACHE_PREFIX = 'jcal_cache_';
const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

export function getFromCache(key) {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    if (!cached) return null;
    
    const { data, expiry } = JSON.parse(cached);
    if (Date.now() > expiry) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function setInCache(key, data, ttl = DEFAULT_TTL) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
      data,
      expiry: Date.now() + ttl
    }));
  } catch (e) {
    console.warn('Cache write failed:', e);
  }
}

export function clearCache(key) {
  localStorage.removeItem(CACHE_PREFIX + key);
}