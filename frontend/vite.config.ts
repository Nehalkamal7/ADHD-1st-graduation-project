import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Exposes the server to the network
    port: 80, // Optional: Keeps the default port
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
