// نور PWA Service Worker
const CACHE_NAME = 'noor-v1';

// Files to cache for offline use
const ASSETS = [
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Amiri:ital,wght@0,400;0,700&family=Scheherazade+New:wght@400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500&display=swap',
];

// Install: cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS.filter(url => !url.startsWith('http')));
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', event => {
  // For API calls (Hijri date), always try network first
  if (event.request.url.includes('aladhan.com')) {
    event.respondWith(
      fetch(event.request).catch(() => new Response('{}', { headers: { 'Content-Type': 'application/json' } }))
    );
    return;
  }

  // For Google Fonts, try network then cache
  if (event.request.url.includes('fonts.google')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        fetch(event.request).then(response => {
          cache.put(event.request, response.clone());
          return response;
        }).catch(() => caches.match(event.request))
      )
    );
    return;
  }

  // For everything else: cache first
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        return response;
      });
    })
  );
});
