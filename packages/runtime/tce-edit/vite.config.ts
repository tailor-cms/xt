import { defineConfig, loadEnv } from 'vite';
import Components from 'unplugin-vue-components/vite';
import uniq from 'lodash/uniq';
import vue from '@vitejs/plugin-vue2';
import { VuetifyResolver } from 'unplugin-vue-components/resolvers';

import { fileURLToPath } from 'node:url';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }): any => {
  // Default API URL
  if (!process.env.VITE_API_URL) {
    process.env.VITE_API_URL = 'http://localhost:8030';
  }
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
  return {
    root: './src',
    logLevel: 'error',
    server: {
      port: 8010,
    },
    resolve: {
      preserveSymlinks: true,
    },
    optimizeDeps: {
      include: [editModulePath.replace(/\/dist$/, '')],
    },
    plugins: [
      vue(),
      Components({
        dirs,
        extensions: ['js'],
        // Need to be set to avoid excluding /node_modules/ paths
        exclude: [],
        // Uncomment for debugging import path
        // importPathTransform: (path) => {
        //   if (path === 'vuetify/lib') return path;
        //   console.log('🗃️  processing import path:', path);
        //   return path;
        // },
        resolvers: [
          // Vuetify
          VuetifyResolver(),
          (componentName) => {
            if (['TopToolbar', 'SideToolbar', 'Edit'].includes(componentName)) {
              console.log('Loaded:', componentName);
              return {
                name: componentName,
                from: env.TCE_EDIT_DIR,
              };
            }
          },
        ],
      }),
    ],
  };
});
