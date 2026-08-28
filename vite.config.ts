import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name].js',
        manualChunks(id) {
          if (id.includes('@zxing')) return 'scanner';
          if (id.includes('jsbarcode')) return 'barcode';
        },
        assetFileNames: (assetInfo) => assetInfo.names.some((name) => name.endsWith('.css')) ? 'assets/app.css' : 'assets/[name]-[hash][extname]'
      }
    }
  }
});
