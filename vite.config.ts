import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const productionCsp = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'";
const appDocument = /^\/(?:|demo|intake|records|privacy|terms|print\/[^/]+)\/?$/;

export default defineConfig({
  plugins: [{
    name: 'production-policy-preview',
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        response.setHeader('Content-Security-Policy', productionCsp);
        response.setHeader('X-Content-Type-Options', 'nosniff');
        response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        const path = new URL(request.url ?? '/', 'http://preview.local').pathname;
        if (path === '/license') {
          response.statusCode = 301;
          response.setHeader('Location', '/intake');
          response.end();
          return;
        }
        if (request.headers.accept?.includes('text/html') && !appDocument.test(path) && path !== '/404.html') {
          response.statusCode = 404;
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.end(readFileSync(resolve(process.cwd(), 'dist/index.html')));
          return;
        }
        next();
      });
    }
  }],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app-v10.js',
        chunkFileNames: 'assets/[name]-v10.js',
        manualChunks(id) {
          if (id.includes('@zxing')) return 'scanner';
          if (id.includes('jsbarcode')) return 'barcode';
        },
        assetFileNames: (assetInfo) => assetInfo.names.some((name) => name.endsWith('.css')) ? 'assets/app-v10.css' : 'assets/[name]-[hash][extname]'
      }
    }
  }
});
