import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom", // Use jsdom for React components
    globals: true, // Enable global `expect` and other Jest-like functions
    setupFiles: "./vitest.setup.js", // Optional: Add setup file if needed
  },
  server: {
    proxy: {
      '/met': {
        target: 'https://www.met.ie',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/met/, ''),
      },
      '/api/geocode':{
        target: "https://geocoding-api.open-meteo.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/geocode/, "/v1/search"),
      }
    },
  },
})