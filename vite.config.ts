import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  envPrefix: ['VITE_', 'REACT_APP_'],
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  server: {
    proxy: {
      '/auth': 'http://127.0.0.1:8888',
      '/playlists': 'http://127.0.0.1:8888',
      '/api': 'http://127.0.0.1:8888',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
});
