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
  const { EDIT_RUNTIME_PORT, SERVER_RUNTIME_URL } = env;
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
    },
    optimizeDeps: {
      include: [
        editModulePath.replace(/\/dist$/, ''),
        'lodash/cloneDeep.js',
        'lodash/invoke.js',
        'lodash/sortBy.js',
      ],
    },
    plugins: [vue(), vuetify({ autoImport: true })],
  };
});
