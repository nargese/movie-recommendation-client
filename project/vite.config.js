import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7174',  // Your ASP.NET port
        changeOrigin: true,  // Helps with host header issues
        secure: false,  // If backend is HTTP
      },
    },
  },
})
