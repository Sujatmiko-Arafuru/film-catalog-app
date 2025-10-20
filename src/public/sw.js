import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

const BASE_PATH = '/film-catalog-app';

// Precache semua asset yang di-generate oleh build
precacheAndRoute(self.__WB_MANIFEST);

console.log('[SW] Service Worker initialized');

// Network-first strategy untuk API stories
registerRoute(
  ({ url }) => url.origin === 'https://story-api.dicoding.dev' && url.pathname.includes('/stories'),
  new NetworkFirst({
    cacheName: 'api-stories',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
    networkTimeoutSeconds: 10,
  })
);

// Cache-first untuk CDN (Leaflet, unpkg)
registerRoute(
  ({ url }) => url.origin === 'https://unpkg.com',
  new CacheFirst({
    cacheName: 'cdn-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache-first untuk map tiles
registerRoute(
  ({ url }) => url.hostname.includes('tile.openstreetmap.org'),
  new CacheFirst({
    cacheName: 'map-tiles',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Stale-while-revalidate untuk images
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache-first untuk CSS dan JS
registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  new CacheFirst({
    cacheName: 'static-resources',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Network-first untuk dokumen HTML dengan fallback
registerRoute(
  ({ request }) => request.destination === 'document',
  new NetworkFirst({
    cacheName: 'documents',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
    networkTimeoutSeconds: 5,
  })
);

// Fallback handler untuk offline
setCatchHandler(async ({ event }) => {
  // Untuk navigation requests, return cached index.html
  if (event.request.destination === 'document') {
    const cache = await caches.open('documents');
    const cachedResponse = await cache.match(`${BASE_PATH}/index.html`);
    if (cachedResponse) {
      return cachedResponse;
    }
  }
  
  // Untuk API requests, return error response
  if (event.request.url.includes('/stories')) {
    return new Response(
      JSON.stringify({ 
        error: true, 
        message: 'Offline - menggunakan data cache' 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 503
      }
    );
  }
  
  return Response.error();
});

self.addEventListener('push', (event) => {
  console.log('push notification masuk');
  
  async function chainPromise() {
    // Validasi data push notification
    if (!event.data) {
      console.warn('push notification tanpa data');
      return;
    }
    
    let data;
    try {
      // Coba parse sebagai JSON
      data = event.data.json();
    } catch (error) {
      // Jika bukan JSON, gunakan data text sebagai fallback
      console.warn('push notification bukan JSON, gunakan text:', error);
      const text = event.data.text();
      data = {
        title: 'Notifikasi Baru',
        options: {
          body: text
        }
      };
    }
    
    // Tampilkan notifikasi
    await self.registration.showNotification(data.title || 'Notifikasi', {
      body: data.options?.body || data.body || 'Anda memiliki notifikasi baru',
      icon: `${BASE_PATH}/favicon.png`,
      badge: `${BASE_PATH}/favicon.png`
    });
  }
  
  event.waitUntil(chainPromise());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = `${BASE_PATH}/#/`;
  // buka app
  event.waitUntil(clients.matchAll({ type: 'window' }).then((clis) => {
    for (const c of clis) {
      if ('focus' in c) return c.focus();
    }
    if (clients.openWindow) return clients.openWindow(url);
  }));
});

