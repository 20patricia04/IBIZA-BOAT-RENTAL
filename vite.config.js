import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/users': {
        target: 'http://194.102.63.21:8000',
        changeOrigin: true,
        secure: false,
      },
      '/message': {
        target: 'http://194.102.63.21:8000',
        changeOrigin: true,
        secure: false,
      },
      '/conversations': {
        target: 'http://194.102.63.21:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
