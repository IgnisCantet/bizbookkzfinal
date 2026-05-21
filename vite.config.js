import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// © 2026 ТОО «NOVA Comp». Все права защищены.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'BizBook KZ',
        short_name: 'BizBook KZ',
        description: 'Умная бухгалтерия для бизнеса РК · © 2026 ТОО «NOVA Comp»',
        theme_color: '#7c6fff',
        background_color: '#0d0d1a',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true, passes: 2 },
      mangle: { toplevel: true },
      format: {
        comments: false,
        preamble: '/* © 2026 ТОО «NOVA Comp». Все права защищены. Закон РК «Об авторском праве» №6-I */'
      }
    },
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[hash].js',
        chunkFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash].[ext]'
      }
    },
    sourcemap: false
  }
})
