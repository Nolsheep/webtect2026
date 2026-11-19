import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// During development, /api requests are forwarded to the Express server.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { '/api': 'http://localhost:3001' },
  },
})
