const CACHE_NAME = 'story-app-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/scripts/index.js',
  '/styles/styles.css',
  '/favicon.png'
];

self.addEventListener('install', (event) => {
  // cache app shell
  event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(APP_SHELL)));
});

self.addEventListener('activate', (event) => {
  // hapus cache lama
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
});

// handle fetch request
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // network-first buat api stories
  if (url.origin === 'https://story-api.dicoding.dev' && url.pathname.includes('/stories')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // simpan ke cache
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // fallback ke cache
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // cache-first buat app shell
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    })
  );
});

self.addEventListener('push', (event) => {
  console.log('push notification masuk');
  
  async function chainPromise() {
    const data = await event.data.json();
    await self.registration.showNotification(data.title, {
      body: data.options.body,
      icon: '/favicon.png',
      badge: '/favicon.png'
    });
  }
  
  event.waitUntil(chainPromise());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = '/#/';
  // buka app
  event.waitUntil(clients.matchAll({ type: 'window' }).then((clis) => {
    for (const c of clis) {
      if ('focus' in c) return c.focus();
    }
    if (clients.openWindow) return clients.openWindow(url);
  }));
});


