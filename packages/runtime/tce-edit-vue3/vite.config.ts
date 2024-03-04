import { defineConfig, loadEnv } from 'vite';
import Components from 'unplugin-vue-components/vite';
import uniq from 'lodash/uniq';
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
  const dirs = uniq([
    editModulePath,
    // Defaults
    '../../../../../../../packages/edit/dist',
    '../../../tce-template/packages/edit/dist',
  ]);
  console.log('📦 Loading edit components from:');
  console.log(dirs.join('\n'));
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
    optimizeDeps: {
      include: [editModulePath.replace(/\/dist$/, '')],
    },
    plugins: [
      vue(),
      vuetify({ autoImport: true }),
      Components({
        version: 3,
        dirs,
        extensions: ['js'],
        // Need to be set to avoid excluding /node_modules/ paths
        exclude: [],
        // Uncomment for import path debugging
        // importPathTransform: (path) => {
        //   console.log('🗃️  processing import path:', path);
        //   return path;
        // },
        resolvers: [
          (componentName) => {
            if (['Edit', 'TopToolbar', 'SideToolbar'].includes(componentName)) {
              console.log('Loaded:', componentName);
              return {
                name: componentName,
                from: editModulePath,
              };
            }
          },
        ],
      }),
    ],
  };
});
