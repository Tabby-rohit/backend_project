import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  root: '..',
  publicDir: 'frontend/public',
  plugins: [react()],
  build: {
    outDir: 'frontend/dist',
    emptyOutDir: true,
  },
})
