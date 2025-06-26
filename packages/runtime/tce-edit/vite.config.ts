import { defineConfig, loadEnv } from 'vite';
import { pick } from 'lodash-es';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

import { fileURLToPath } from 'url';
import path from 'node:path';

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
export default defineConfig(({ mode }): any => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  const viteConfigPath = fileURLToPath(import.meta.url);
  const editModulePath = path.relative(viteConfigPath, env.TCE_EDIT_DIR);
  const manifestModulePath = path.relative(
    viteConfigPath,
    env.TCE_MANIFEST_DIR,
  );
  const { EDIT_RUNTIME_PORT } = env;
  return {
    root: './src',
    logLevel: 'error',
    server: {
      host: '0.0.0.0', // Accept connections from any host (Docker)
      port: parseInt(EDIT_RUNTIME_PORT, 10),
    },
    resolve: {
      preserveSymlinks: true,
    },
    define: {
      'import.meta.env.EDIT_DIR': JSON.stringify(env.TCE_EDIT_DIR),
      'import.meta.env.MANIFEST_DIR': JSON.stringify(env.TCE_MANIFEST_DIR),
      'import.meta.env.AI_UI_ENABLED': !!env.AI_UI_ENABLED,
    },
    optimizeDeps: {
      include: [
        editModulePath.replace(/\/dist$/, ''),
        manifestModulePath.replace(/\/dist$/, ''),
      ],
    },
    plugins: [vue(), vuetify({ autoImport: true })],
  };
});
