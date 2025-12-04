import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
      '/egresados': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
      '/empresas': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
      '/certificaciones': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
      '/reportes': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
      '/encuestas': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'build',
    sourcemap: false, // Deshabilitado en producción para optimizar
    emptyOutDir: true // Limpia el directorio antes de construir
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
