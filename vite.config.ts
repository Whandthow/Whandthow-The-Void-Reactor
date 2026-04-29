import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    /* Split heavyweight third-party libs into a stable `vendor` chunk so the
       browser can keep them in cache across portfolio code updates. The app
       chunk shrinks proportionally and re-downloads only when our source
       actually changes. */
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'styled-vendor': ['styled-components'],
        },
      },
    },
  },
});
