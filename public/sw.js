const CACHE_VERSION = 'v1';
const CACHE_NAME = `jcal-${CACHE_VERSION}`;

const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/src/main.jsx',
];

const API_CACHE = `jcal-api-${CACHE_VERSION}`;

// Install: cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CRITICAL_ASSETS).catch(() => {
        // Graceful fail if some assets aren't available
        return Promise.resolve();
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME && name !== API_CACHE) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: network-first for APIs, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API calls: try network, fallback to cache
  if (url.hostname !== self.location.hostname) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return caches.match(request);
          }
          const responseClone = response.clone();
          caches.open(API_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request) || new Response('Offline - data unavailable', { status: 503 });
        })
    );
    return;
  }

  // Local assets: cache-first, fallback to network
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) return response;
      return fetch(request).then((response) => {
        if (!response || response.status !== 200) return response;
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });
        return response;
      });
    })
  );
});
