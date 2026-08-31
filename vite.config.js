import { defineConfig } from 'vite';

export default defineConfig({
  base: '/design_sample_selector/',
  server: {
    port: 5173,
    open: false
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    manifest: true
  }
});
