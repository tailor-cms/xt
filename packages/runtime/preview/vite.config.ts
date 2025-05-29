import { defineConfig } from 'vite';
import { pick } from 'lodash-es';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

const config = pick(process.env, [
  'EDIT_RUNTIME_URL',
  'DISPLAY_RUNTIME_URL',
  'SERVER_RUNTIME_URL',
  'PREVIEW_RUNTIME_PORT',
]);

// Expose to Frontend by prefixing with VITE_
Object.entries(config).forEach(([k, v]) => (process.env[`VITE_${k}`] = v));

// https://vitejs.dev/config/
export default defineConfig((): any => {
  return {
    root: './src',
    server: {
      // Accept connections from any host (Docker)
      host: '0.0.0.0',
      port: parseInt(config.PREVIEW_RUNTIME_PORT, 10),
      proxy: {
        '/tce-server': {
          target: config.SERVER_RUNTIME_URL,
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/tce-server/, ''),
        },
      },
    },
    logLevel: 'warn',
    plugins: [vue(), vuetify({ autoImport: true })],
  };
});
