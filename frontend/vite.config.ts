import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const frontendDirectory = dirname(fileURLToPath(import.meta.url))
const backendDirectory = resolve(frontendDirectory, '../backend')

export default defineConfig(({ mode }) => {
  const frontendEnv = loadEnv(mode, frontendDirectory, '')
  const backendFrontendEnv = loadEnv(mode, backendDirectory, 'FRONTEND_')
  const frontendOriginValue = frontendEnv.FRONTEND_ORIGIN
    ?? backendFrontendEnv.FRONTEND_ORIGIN
    ?? 'http://localhost:5173'
  const frontendOrigin = new URL(frontendOriginValue.split(',')[0].trim())
  const backendOrigin = frontendEnv.BACKEND_ORIGIN ?? 'http://localhost:3000'

  return {
    plugins: [tailwindcss(), react()],
    server: {
      host: frontendOrigin.hostname,
      port: Number(frontendOrigin.port || 5173),
      strictPort: true,
      proxy: {
        '/api': {
          target: backendOrigin,
          changeOrigin: true,
        },
      },
    },
  }
})
