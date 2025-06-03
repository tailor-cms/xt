import { defineConfig } from 'vite';
import pick from 'lodash/pick';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

const env = process.env;
const config = pick(env, [
  'EDIT_RUNTIME_URL',
  'DISPLAY_RUNTIME_URL',
  'SERVER_RUNTIME_URL',
  'PREVIEW_RUNTIME_URL',
  'PREVIEW_RUNTIME_PORT',
]);

// Expose to Frontend by prefixing with VITE_
Object.entries(config).forEach(
  ([k, v]) => (process.env[`VITE_${k}`] = v as string),
);

// https://vitejs.dev/config/
export default defineConfig((): any => {
  return {
    root: './src',
    server: {
      // Accept connections from any host (Docker)
      host: '0.0.0.0',
      port: parseInt(config.PREVIEW_RUNTIME_PORT, 10),
    },
    logLevel: 'warn',
    plugins: [vue(), vuetify({ autoImport: true })],
  };
});
