import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const apiUrl = process.env.API_URL || 'http://localhost:3000';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    watch: { usePolling: true },
    proxy: {
      '/api': apiUrl,
      '/socket.io': { target: apiUrl, ws: true },
    },
  },
});
