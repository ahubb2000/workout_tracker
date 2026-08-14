import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/workout_tracker/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.svg', 'icon-512.svg'],
      manifest: {
        name: 'Workout Tracker',
        short_name: 'Workout',
        description: 'A personal iPhone-friendly workout tracker.',
        start_url: '/workout_tracker/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#22c55e',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/workout_tracker/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/workout_tracker/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}']
      }
    })
  ]
});
