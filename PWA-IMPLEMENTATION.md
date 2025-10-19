# Implementasi PWA - Katalog Story

## Fitur PWA yang Diimplementasikan

### 1. **Installable App**
- Menggunakan `vite-plugin-pwa` untuk generate manifest dan service worker
- Banner install prompt yang muncul otomatis (dapat di-dismiss)
- Support untuk iOS (apple-touch-icon, meta tags)
- App shortcuts untuk navigasi cepat

### 2. **Offline Support**
- **Workbox Caching Strategies**:
  - `NetworkFirst` untuk API stories (timeout 10s)
  - `CacheFirst` untuk CDN resources (Leaflet, unpkg)
  - `CacheFirst` untuk map tiles dari OpenStreetMap
  - `StaleWhileRevalidate` untuk images
- **Precaching**: Semua asset static (JS, CSS, HTML, images)
- **Offline Indicator**: Banner yang muncul saat device offline

### 3. **Push Notifications**
- Tetap menggunakan custom implementation untuk push events
- Service worker mendukung `push` dan `notificationclick` events
- Auto-subscribe notification dengan izin user

### 4. **Auto Update**
- Service worker akan otomatis update saat ada versi baru
- Update prompt untuk memberitahu user ada update tersedia
- `skipWaiting` dan `clientsClaim` untuk update seamless

## File-file yang Ditambahkan/Dimodifikasi

### Modified Files:
1. `vite.config.js` - Tambah vite-plugin-pwa configuration
2. `src/public/sw.js` - Update ke Workbox-based service worker
3. `src/scripts/index.js` - Integrasi PWA utilities
4. `src/index.html` - Tambah PWA meta tags
5. `src/scripts/pages/about/about-page.js` - Dokumentasi PWA

### New Files:
1. `src/scripts/utils/offline-indicator.js` - Indicator status offline
2. `src/scripts/utils/sw-update-prompt.js` - Prompt untuk update app
3. `PWA-IMPLEMENTATION.md` - Dokumentasi ini

## Dependencies Baru

```json
{
  "devDependencies": {
    "vite-plugin-pwa": "^0.x.x",
    "workbox-core": "^7.x.x",
    "workbox-precaching": "^7.x.x",
    "workbox-routing": "^7.x.x",
    "workbox-strategies": "^7.x.x",
    "workbox-expiration": "^7.x.x",
    "workbox-cacheable-response": "^7.x.x"
  }
}
```

## Cara Testing PWA

### Development Mode:
```bash
npm run dev
```
- PWA akan aktif di dev mode (devOptions.enabled: true)
- Buka Chrome DevTools > Application > Service Workers
- Cek manifest di Application > Manifest

### Production Mode:
```bash
npm run build
npm run preview
```

### Test Offline Mode:
1. Buka aplikasi di browser
2. Buka Chrome DevTools > Network
3. Pilih "Offline" dari dropdown throttling
4. Reload page - konten yang sudah di-cache akan tetap bisa diakses
5. Banner "Mode Offline" akan muncul

### Test Install:
1. Buka aplikasi di browser (Chrome/Edge)
2. Banner install akan muncul di bottom center
3. Klik "Install" untuk install ke device
4. Aplikasi akan muncul di Start Menu/Desktop/App Drawer

### Test Push Notification:
1. Login ke aplikasi
2. Izinkan notifikasi saat diminta
3. Notifikasi akan muncul sesuai dengan data dari server

## Manifest Configuration

```json
{
  "name": "Katalog Story",
  "short_name": "Story",
  "display": "standalone",
  "theme_color": "#667eea",
  "background_color": "#ffffff",
  "icons": [192x192, 512x512],
  "shortcuts": ["Beranda", "Peta", "Tambah Story"]
}
```

## Cache Strategy

| Resource Type | Strategy | Cache Name | Max Age |
|--------------|----------|------------|---------|
| App Shell | Precache | workbox-precache | Permanent |
| API Stories | NetworkFirst | api-stories | 5 minutes |
| CDN Resources | CacheFirst | cdn-cache | 30 days |
| Map Tiles | CacheFirst | map-tiles | 30 days |
| Images | StaleWhileRevalidate | images | 30 days |

## Browser Support

- ✅ Chrome/Edge (Full support)
- ✅ Firefox (Full support)
- ✅ Safari (Partial - no install prompt)
- ✅ Mobile browsers (Full support)

## Lighthouse Score Target

- Performance: >90
- PWA: 100
- Accessibility: >90
- Best Practices: >90
- SEO: >90

## Troubleshooting

### Service Worker tidak register:
- Cek console untuk error
- Pastikan running di HTTPS atau localhost
- Clear cache dan reload

### Install prompt tidak muncul:
- Cek manifest.webmanifest accessible
- Cek icons tersedia
- Service worker harus aktif
- Sudah pernah dismiss prompt? Clear localStorage

### Offline tidak bekerja:
- Pastikan sudah buka page saat online
- Cek cache di DevTools > Application > Cache Storage
- Pastikan service worker dalam state "activated"

## Next Steps

Untuk meningkatkan PWA lebih lanjut:
1. Tambahkan background sync untuk offline form submission
2. Implementasi Web Share API
3. Tambahkan badging API untuk notification count
4. Implementasi periodic background sync
5. Tambahkan install analytics tracking

