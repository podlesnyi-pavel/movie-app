import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    devSourcemap: true,
    // дублирует все из файла во все файлы scss
    // preprocessorOptions: {
    //   scss: {
    //     additionalData: `
    //       @use "@/styles/variables.scss" as *;
    //     `,
    //   },
    // },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@styles': resolve(__dirname, './src/styles'),
      '@utils': resolve(__dirname, './src/utils'),
      '@api': resolve(__dirname, './src/services/api'),
    },
  },
});
