import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

const { TCE_DISPLAY_DIR } = process.env;
const TCE_ROOT_DIR = TCE_DISPLAY_DIR.replace('/packages/display/dist', '');

dotenv.config({ path: `${TCE_ROOT_DIR}/.env` });

const env = process.env;
const DISPLAY_RUNTIME_PORT = env.DISPLAY_RUNTIME_PORT || '8020';
const SERVER_RUNTIME_URL = env.SERVER_RUNTIME_URL || 'http://localhost:8030';

// https://vitejs.dev/config/
export default defineConfig((): any => {
  return {
    root: './src',
    logLevel: 'warn',
    server: {
      // Accept connections from any host (Docker)
      host: '0.0.0.0',
      port: parseInt(DISPLAY_RUNTIME_PORT, 10),
      proxy: {
        '/tce-server': {
          target: SERVER_RUNTIME_URL,
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/tce-server/, ''),
        },
      },
    },
    resolve: {
      preserveSymlinks: true,
    },
    define: {
      'import.meta.env.DISPLAY_DIR': JSON.stringify(env.TCE_DISPLAY_DIR),
    },
    plugins: [vue(), vuetify({ autoImport: true })],
  };
});
