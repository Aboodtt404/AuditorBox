import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import environment from 'vite-plugin-environment';
import * as fs from 'fs';
import { fileURLToPath, URL } from 'url';

let canisterIds: Record<string, any> = {};
try {
  canisterIds = JSON.parse(fs.readFileSync('../.dfx/ic/canister_ids.json', 'utf-8'));
} catch {
  try {
    canisterIds = JSON.parse(fs.readFileSync('../.dfx/local/canister_ids.json', 'utf-8'));
  } catch {
    console.warn('Cannot read canister_ids.json — run dfx deploy first');
  }
}

const backendId = canisterIds.auditorbox_backend?.ic ?? canisterIds.auditorbox_backend?.local ?? '';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    environment('all', { prefix: 'CANISTER_' }),
    environment('all', { prefix: 'DFX_' }),
  ],
  envDir: '../',
  define: {
    'import.meta.env.VITE_CANISTER_ID_auditorbox_backend': JSON.stringify(backendId),
    'process.env.NODE_ENV': JSON.stringify('production'),
    'global': 'globalThis',
  },
  resolve: {
    alias: [
      { find: 'declarations', replacement: fileURLToPath(new URL('../src/declarations', import.meta.url)) },
    ],
  },
  server: {
    proxy: { '/api': { target: 'http://127.0.0.1:4943', changeOrigin: true } },
    host: '0.0.0.0',
    port: 3000,
  },
  build: {
    target: 'esnext',
    outDir: './dist',
    emptyOutDir: true,
    modulePreload: false,
    chunkSizeWarningLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks: {
          'data-forms': ['./src/data/forms.ts'],
          'data-fields': ['./src/data/fields.ts'],
          'data-graph': ['./src/data/graph.ts'],
          'data-phases': ['./src/data/phases.ts'],
          'vendor-xyflow': ['@xyflow/react'],
          'vendor-table': ['@tanstack/react-table'],
          'vendor-xlsx': ['xlsx'],
        },
      },
    },
  },
});
