import { defineConfig } from 'vite'
import compression from 'vite-plugin-compression'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  switch (mode) {
    case 'development': {
      return {
        plugins: [react(), tailwindcss()],
      }
    }

    case 'production': {
      return {
        plugins: [
          react(),
          tailwindcss(),
          /* @ts-expect-error */
          compression(),
        ],
      }
    }
  }
})
