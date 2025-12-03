import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carga variables .env según el modo (dev / production)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Reemplazá 'cv_interactivo' con el nombre exacto de tu repo si fuera distinto
    base: '/cv_interactivo/',

    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    plugins: [react()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      },
    },

    // Nota: no definimos 'process.env' aquí; usá import.meta.env.VITE_GOOGLE_API_KEY en tu código.
  };
});

