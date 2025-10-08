const CACHE_NAME = 'film-app-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/scripts/index.js',
  '/styles/styles.css',
  '/favicon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(APP_SHELL)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
});

// network-first untuk data API, cache-first untuk shell
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/v1/stories')) {
    event.respondWith(
      fetch(event.request).then((r) => {
        const clone = r.clone();
        caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
        return r;
      }).catch(() => caches.match(event.request))
    );
    return;
  }
  event.respondWith(caches.match(event.request).then((resp) => resp || fetch(event.request)));
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'Story baru', options: { body: 'Cek cerita terbaru!' } };
  event.waitUntil(self.registration.showNotification(data.title || 'Katalog Film', data.options || { body: 'Update terbaru' }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = '/#/';
  event.waitUntil(clients.matchAll({ type: 'window' }).then((clis) => {
    for (const c of clis) {
      if ('focus' in c) return c.focus();
    }
    if (clients.openWindow) return clients.openWindow(url);
  }));
});


