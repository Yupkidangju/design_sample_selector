import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Use relative paths for static hosting compatibility
  server: {
    port: 5173,
    open: false
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
