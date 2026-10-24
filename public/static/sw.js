/* Offline cache for the web version. Cache name changes on every build so updates are picked up. */
const CACHE = 'motqn-__V__';
const FILES = ['./', 'index.html', 'app.js', 'app.css', 'manifest.webmanifest', 'favicon.png', 'icons/icon-192.png', 'icons/icon-512.png', 'privacy.html'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((m) => m || caches.match('index.html'))));
});
