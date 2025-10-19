import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/film-catalog-app/',
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'src', 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'images/logo.png'],
      manifest: {
        name: 'Katalog Story',
        short_name: 'Story',
        description: 'Katalog story dengan peta, favorit, push notification, dan mode offline.',
        theme_color: '#667eea',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/film-catalog-app/',
        scope: '/film-catalog-app/',
        icons: [
          {
            src: '/film-catalog-app/images/logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/film-catalog-app/images/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/film-catalog-app/favicon.png',
            sizes: '64x64',
            type: 'image/png',
            purpose: 'any'
          }
        ],
        shortcuts: [
          {
            name: 'Beranda',
            url: '/film-catalog-app/#/',
            icons: [{ src: '/film-catalog-app/favicon.png', sizes: '192x192', type: 'image/png' }]
          },
          {
            name: 'Peta',
            url: '/film-catalog-app/#/map',
            icons: [{ src: '/film-catalog-app/favicon.png', sizes: '192x192', type: 'image/png' }]
          },
          {
            name: 'Tambah Story',
            url: '/film-catalog-app/#/add',
            icons: [{ src: '/film-catalog-app/favicon.png', sizes: '192x192', type: 'image/png' }]
          }
        ]
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}'],
        globIgnores: ['**/node_modules/**/*'],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
});
