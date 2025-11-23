import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; // <-- Добавлен импорт PWA

export default defineConfig({
  plugins: [
    react(),
    
    // ⚙️ КОНФИГУРАЦИЯ PWA
    VitePWA({
      registerType: 'autoUpdate', 
      
      // Файлы, которые будут кэшированы
      includeAssets: ['favicon.svg', 'logo-192.png', 'logo-512.png'], 
      
      manifest: {
        name: 'Чип&Гаджет Ремонт',
        short_name: 'Чип&Гаджет',
        description: 'Ремонт электроники: смартфоны, планшеты, ноутбуки',
        theme_color: '#2563EB', // Цвет верхней панели приложения (синий)
        background_color: '#ffffff', // Цвет фона при запуске
        display: 'standalone', // Запуск без адресной строки браузера
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'logo-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'logo-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          // Иконка для адаптивного отображения на Android
          {
            src: 'logo-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      }
    })
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  base: ''
});