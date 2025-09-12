import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: { port: 5173 },
  build: {
    rollupOptions: {
      external: ["jsonwebtoken"] // tells Vite not to bundle it
    }
  }
})

