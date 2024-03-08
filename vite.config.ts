import { defineConfig } from 'vite'
import compression from 'vite-plugin-compression'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  switch (mode) {
    case 'development': {
      return {
        plugins: [react()],
      }
    }

    case 'production': {
      return {
        plugins: [react(), compression()],
      }
    }
  }
})
