import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    https: true,
    host: '0.0.0.0', // Expone el servidor en todas las interfaces de red (IPv4)
    port: 5173,
    strictPort: true,
  },
})
