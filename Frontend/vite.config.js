import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import scrollbar from 'tailwind-scrollbar'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),scrollbar],
  server:{
    proxy:{
      '/api':{
        target:'http://localhost:9000',
        changeOrigin:true,
        secure:false,
      }
    }
  }
})
