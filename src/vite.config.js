import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      css: {
        // Prevent Tailwind from processing node_modules like leaflet.css
        additionalData: (content, filename) =>
          filename.includes('node_modules') ? '' : content,
      },
    },
  },
});
