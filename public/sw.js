const VERSION = 'barcode-intake-v7';
const SHELL = ['/', '/offline.html', '/static.css', '/manifest.webmanifest', '/favicon.svg', '/icons/icon-192.png', '/icons/icon-512.png', '/assets/receiving-desk.webp', '/assets/receiving-desk-600.webp', '/assets/app-v7.js', '/assets/app-v7.css', '/assets/scanner-v7.js', '/assets/barcode-v7.js'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await cache.addAll(SHELL.map((url) => new Request(url, { cache: 'reload' })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(VERSION).then((cache) => cache.put('/', copy));
      }
      return response;
    }).catch(async () => (await caches.match('/')) || (await caches.match('/offline.html'))));
    return;
  }
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) caches.open(VERSION).then((cache) => cache.put(request, response.clone()));
    return response;
  })));
});
