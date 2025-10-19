# Katalog Story - Progressive Web App

## 🚀 Fitur PWA

Aplikasi ini telah diimplementasikan sebagai Progressive Web App (PWA) dengan fitur-fitur berikut:

### ✅ Installable
- ✨ Banner install otomatis muncul saat aplikasi dibuka
- 📱 Install ke home screen perangkat (Android/iOS/Desktop)
- 🎯 App shortcuts untuk navigasi cepat
- 🪟 Standalone mode (tampil seperti aplikasi native)

### ✅ Offline Support
- 📦 **Precaching**: Semua asset static di-cache otomatis
- 🌐 **Network-First**: API stories (dengan fallback ke cache)
- 💾 **Cache-First**: CDN resources dan map tiles
- 🔄 **Stale-While-Revalidate**: Images
- 🔴 **Offline Indicator**: Banner merah muncul saat device offline
- 🟢 **Online Notification**: Notifikasi hijau saat kembali online

### ✅ Auto Update
- 🔄 Service worker otomatis update ke versi terbaru
- 📢 Update prompt memberitahu user saat ada update
- ⚡ Seamless update dengan skipWaiting & clientsClaim

### ✅ Push Notifications
- 🔔 Push notification untuk update terbaru
- 📬 Auto-subscribe setelah login
- 🎨 Custom notification dengan icon dan badge

## 📦 Installation

```bash
# Install dependencies
npm install

# Development mode (PWA aktif)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy ke GitHub Pages
npm run deploy
```

## 🧪 Testing PWA

### 1. Test di Development Mode

```bash
npm run dev
```

Buka `http://localhost:5173` (atau port lain yang ditampilkan)

### 2. Test di Production Mode

```bash
npm run build
npm run preview
```

Buka `http://localhost:4173`

### 3. Test dengan Chrome DevTools

1. **Service Worker**
   - Buka DevTools (F12)
   - Tab `Application` > `Service Workers`
   - Lihat status service worker (harus "activated")

2. **Manifest**
   - Tab `Application` > `Manifest`
   - Verify semua info manifest benar
   - Klik "Add to homescreen" untuk test install

3. **Cache Storage**
   - Tab `Application` > `Cache Storage`
   - Lihat cache: `workbox-precache`, `api-stories`, `cdn-cache`, `map-tiles`, `images`

4. **Offline Mode**
   - Tab `Network` > Dropdown throttling
   - Pilih "Offline"
   - Reload page - konten yang sudah di-cache tetap muncul
   - Banner "Mode Offline" akan muncul

### 4. Test Install Prompt

1. Buka aplikasi di Chrome/Edge
2. Banner install akan muncul di bottom center setelah beberapa detik
3. Klik "Install" untuk install aplikasi
4. Aplikasi akan muncul di:
   - **Windows**: Start Menu & Desktop
   - **Android**: App Drawer & Home Screen
   - **macOS**: Applications folder
   - **iOS**: Home Screen (via Safari share menu)

### 5. Test Push Notifications

1. Login ke aplikasi
2. Izinkan notification saat diminta
3. Notifikasi akan muncul (jika ada dari server)

## 📊 Lighthouse Score

Untuk mengecek score PWA dengan Lighthouse:

```bash
npm run build
npm run preview
```

1. Buka Chrome DevTools (F12)
2. Tab `Lighthouse`
3. Category: pilih semua
4. Mode: Desktop/Mobile
5. Klik "Analyze page load"

**Target Score:**
- ✅ Performance: >90
- ✅ PWA: 100
- ✅ Accessibility: >90
- ✅ Best Practices: >90
- ✅ SEO: >90

## 🏗️ Struktur Cache

| Cache Name | Strategy | Content | Max Age |
|------------|----------|---------|---------|
| `workbox-precache` | Precache | JS, CSS, HTML, images | Permanent |
| `api-stories` | NetworkFirst (timeout 10s) | API responses | 5 minutes |
| `cdn-cache` | CacheFirst | Leaflet, unpkg CDN | 30 days |
| `map-tiles` | CacheFirst | OpenStreetMap tiles | 30 days |
| `images` | StaleWhileRevalidate | User uploaded images | 30 days |

## 🎨 UI Components

### 1. Install Banner
```
┌─────────────────────────────────────┐
│ Install Aplikasi                    │
│ Install aplikasi ini untuk akses    │
│ yang lebih mudah                    │
│ [Install] [Nanti]                   │
└─────────────────────────────────────┘
```

### 2. Offline Indicator
```
┌──────────────────────────────────────┐
│ 🔴 Mode Offline - Anda sedang melihat│
│    konten yang tersimpan             │
└──────────────────────────────────────┘
```

### 3. Update Prompt
```
┌─────────────────────────────────────┐
│ Update Tersedia!                    │
│ Versi baru aplikasi telah tersedia  │
│ [Muat Ulang] [Nanti]                │
└─────────────────────────────────────┘
```

## 🛠️ Troubleshooting

### Service Worker tidak register
```
- Cek console untuk error messages
- Pastikan HTTPS atau localhost
- Clear cache: DevTools > Application > Clear storage
```

### Install prompt tidak muncul
```
- Pastikan service worker aktif
- Cek manifest accessible
- Clear localStorage jika sudah dismiss
- Reload page
```

### Offline mode tidak bekerja
```
- Buka page minimal sekali saat online
- Cek cache di DevTools > Application > Cache Storage
- Pastikan service worker state = "activated"
```

### Cache tidak update
```
- Force reload: Ctrl+Shift+R (Windows/Linux) atau Cmd+Shift+R (Mac)
- DevTools > Application > Service Workers > "Update"
- DevTools > Application > Clear storage > "Clear site data"
```

## 📱 Browser Support

| Browser | Install | Offline | Push |
|---------|---------|---------|------|
| Chrome (Desktop) | ✅ | ✅ | ✅ |
| Chrome (Android) | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ✅ |
| Safari (macOS) | ⚠️ | ✅ | ⚠️ |
| Safari (iOS) | ⚠️ | ✅ | ❌ |
| Samsung Internet | ✅ | ✅ | ✅ |

✅ Full support | ⚠️ Partial support | ❌ Not supported

## 📚 Dependencies

```json
{
  "devDependencies": {
    "vite": "^6.2.0",
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

## 🔗 Links

- [Vite Plugin PWA](https://vite-pwa-org.netlify.app/)
- [Workbox](https://developers.google.com/web/tools/workbox)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

## 📝 Notes

1. **Development Mode**: PWA aktif di development untuk testing
2. **Production**: Optimized build dengan minified service worker
3. **Updates**: Service worker akan otomatis update saat ada perubahan
4. **Offline**: Hanya konten yang sudah dibuka yang bisa diakses offline
5. **Cache Size**: Total cache size terbatas oleh browser (biasanya 50-100 MB)

## 🎯 Next Steps

Untuk meningkatkan PWA lebih lanjut:

- [ ] Background Sync untuk offline form submission
- [ ] Web Share API untuk berbagi konten
- [ ] Badging API untuk notification count
- [ ] Periodic Background Sync
- [ ] Install analytics tracking
- [ ] Better offline fallback page
- [ ] Screenshot untuk manifest
- [ ] Multiple icon sizes (192, 384, 512)

## 🤝 Contributing

Jika ingin berkontribusi, silakan:
1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Copyright © 2025 Katalog Story

---

**Happy Coding! 🚀**

