import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        bookingMf:
          process.env.VITE_BOOKING_REMOTE_URL || 'http://localhost:5175/assets/remoteEntry.js'
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ],
  server: {
    port: 5173,
    cors: true
  },
  preview: {
    port: 5173,
    cors: true
  },
  build: {
    target: 'esnext'
  }
});
