// XTS Party — Service Worker for offline support
const CACHE = 'xts-v1';
const OFFLINE_PAGES = [
  '/',
  '/manifesto',
  '/about',
  '/policy',
  '/faq',
  '/voter-guide',
  '/contact',
  '/join',
  '/branches',
  '/unity',
  '/niec',
  '/logo.png',
];

// Install: cache key offline pages
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(OFFLINE_PAGES)).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: network first, fallback to cache
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('/api/')) return; // never cache API calls
  if (e.request.url.includes('/admin/')) return; // never cache admin

  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
