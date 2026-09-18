import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  optimizeDeps: { include: ['@iconify/react'] },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    host: '127.0.0.1',
    proxy: {
      '/api': {
        target: 'https://trip.elmobil.ru',
        changeOrigin: true,
        cookieDomainRewrite: '',
      }
    }
  }
});

