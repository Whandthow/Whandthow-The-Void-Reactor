import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
export default defineConfig({
    plugins: [preact()],
    server: {
        port: 5173,
        host: true,
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'preact-vendor': ['preact', 'preact/compat', 'preact/hooks'],
                    'styled-vendor': ['styled-components'],
                },
            },
        },
    },
});
