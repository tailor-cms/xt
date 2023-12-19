import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

// https://vitejs.dev/config/
export default defineConfig((): any => {
  return {
    root: './src',
    server: {
      host: '0.0.0.0', // Accept connections from any host (Docker)
      port: 8080,
    },
    logLevel: 'warn',
    optimizeDeps: { entries: ['./src/main.js'] },
    plugins: [vue(), vuetify({ autoImport: true })],
  };
});
