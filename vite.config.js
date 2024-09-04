import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import vue from '@vitejs/plugin-vue';
import path from 'path';

dotenv.config({ path: './backend/.env' });

export default defineConfig({
    root: 'frontend',  // this sets the root directory for the frontend
    plugins: [vue()],
    css: {
        postcss: {
            plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
            ],
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "frontend/src"),
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'https://127.0.0.1:8000',
                changeOrigin: true,
                secure: false,  // This will accept self-signed certificates
                // remove the rewrite function if you do not want to modify the path
                // rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/static': {
                target: 'https://127.0.0.1:8000',
                changeOrigin: true,
                secure: false,  // This will accept self-signed certificates
            },
        },
    },
    build: {
        outDir: '../dist',  // if you want build files to be outside of frontend directory
    },
    define: {
        'process.env.VUE_APP_BACKEND_URL': JSON.stringify(process.env.VUE_APP_BACKEND_URL),
    },
});
