import { defineConfig } from 'vite';
import { PROJECT_BASE } from './project.config.js';

export default defineConfig({
  base: PROJECT_BASE,
  server: {
    port: 5173,
    open: false
  },
  plugins: [
    {
      name: 'root-redirect',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url?.split('?')[0];
          if (url === '/' || url === '') {
            const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
            res.writeHead(302, { Location: `${PROJECT_BASE}${query}` });
            res.end();
            return;
          }
          next();
        });
      }
    }
  ],
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    manifest: true
  }
});
