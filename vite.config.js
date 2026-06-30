import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5161,
    strictPort: true,
    open: true,
  },
  preview: {
    port: 5161,
    strictPort: true,
  },
})
