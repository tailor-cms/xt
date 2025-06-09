import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

import { fileURLToPath } from 'url';
import path from 'node:path';

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
  const EDIT_RUNTIME_PORT = env.EDIT_RUNTIME_PORT || '8010';
  const SERVER_RUNTIME_URL = env.SERVER_RUNTIME_URL || 'http://localhost:8030';
  return {
    root: './src',
    logLevel: 'error',
    server: {
      host: '0.0.0.0', // Accept connections from any host (Docker)
      port: parseInt(EDIT_RUNTIME_PORT, 10),
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
      'import.meta.env.EDIT_DIR': JSON.stringify(env.TCE_EDIT_DIR),
      'import.meta.env.MANIFEST_DIR': JSON.stringify(env.TCE_MANIFEST_DIR),
      'import.meta.env.AI_UI_ENABLED': JSON.stringify(env.TCE_MANIFEST_DIR),
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
