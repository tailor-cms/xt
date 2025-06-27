import { defineConfig, UserConfig } from 'vite';
import dotenv from 'dotenv';
import { pick } from 'lodash-es';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

import { fileURLToPath } from 'url';
import path from 'node:path';

const { TCE_DISPLAY_DIR } = process.env;
const TCE_ROOT_DIR = TCE_DISPLAY_DIR.replace('/packages/display/dist', '');

dotenv.config({ path: `${TCE_ROOT_DIR}/.env` });

const env = process.env;

// Expose to Frontend by prefixing with VITE_
const runtimeUrls = pick(env, [
  'EDIT_RUNTIME_URL',
  'DISPLAY_RUNTIME_URL',
  'SERVER_RUNTIME_URL',
  'PREVIEW_RUNTIME_PORT',
]);
Object.entries(runtimeUrls).forEach(([k, v]) => (process.env[`VITE_${k}`] = v));

// https://vitejs.dev/config/
export default defineConfig((): UserConfig => {
  const viteConfigPath = fileURLToPath(import.meta.url);
  const { DISPLAY_RUNTIME_PORT } = env;
  const displayModulePath = path.relative(viteConfigPath, TCE_DISPLAY_DIR);
  return {
    root: './src',
    logLevel: 'warn',
    server: {
      // Accept connections from any host (Docker)
      host: '0.0.0.0',
      port: parseInt(DISPLAY_RUNTIME_PORT, 10),
    },
    resolve: {
      preserveSymlinks: true,
    },
    define: {
      'import.meta.env.DISPLAY_DIR': JSON.stringify(env.TCE_DISPLAY_DIR),
    },
    optimizeDeps: {
      include: [displayModulePath.replace(/\/dist$/, '')],
    },
    plugins: [vue(), vuetify({ autoImport: true })],
  };
});
