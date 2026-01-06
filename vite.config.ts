import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  server: {
    proxy: {
      '/form.php': {
        target: 'https://hybridraces.fit',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
