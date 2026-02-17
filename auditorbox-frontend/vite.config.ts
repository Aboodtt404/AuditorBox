import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import environment from 'vite-plugin-environment';
import * as fs from 'fs';
import { fileURLToPath, URL } from 'url';

const network = process.env.DFX_NETWORK || 'ic';

let canisterIds: Record<string, any> = {};

const loadCanisterIds = (path: string) => {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf-8'));
  } catch {
    return null;
  }
};

if (network === 'playground') {
  canisterIds = loadCanisterIds('../auditorbox_backend/.dfx/playground/canister_ids.json') ||
    loadCanisterIds('../.dfx/playground/canister_ids.json') ||
    {};
} else if (network === 'local') {
  canisterIds = loadCanisterIds('../.dfx/local/canister_ids.json') || {};
} else {
  canisterIds = loadCanisterIds('../auditorbox_backend/canister_ids.json') ||
    loadCanisterIds('../.dfx/ic/canister_ids.json') ||
    {};
}

if (Object.keys(canisterIds).length === 0) {
  // Fallback to try all if specific network failed
  canisterIds = loadCanisterIds('../.dfx/ic/canister_ids.json') ||
    loadCanisterIds('../.dfx/playground/canister_ids.json') ||
    loadCanisterIds('../.dfx/local/canister_ids.json') ||
    loadCanisterIds('../auditorbox_backend/.dfx/playground/canister_ids.json') ||
    {};
}

if (Object.keys(canisterIds).length === 0) {
  console.warn('Cannot read canister_ids.json — run dfx deploy first');
}

console.log(`DFX_NETWORK: ${network}`);

const backendId = canisterIds.auditorbox_backend?.ic ?? canisterIds.auditorbox_backend?.playground ?? canisterIds.auditorbox_backend?.local ?? '';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    environment('all', { prefix: 'CANISTER_' }),
    environment('all', { prefix: 'DFX_' }),
  ],
  envDir: '../',
  define: {
    'process.env.CANISTER_ID_AUDITORBOX_BACKEND': JSON.stringify(backendId),
    'process.env.DFX_NETWORK': JSON.stringify(process.env.DFX_NETWORK || 'ic'),
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
