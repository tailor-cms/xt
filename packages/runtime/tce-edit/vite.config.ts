import { defineConfig, loadEnv } from 'vite';
import Components from 'unplugin-vue-components/vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import uniq from 'lodash/uniq';
import { VuetifyResolver } from 'unplugin-vue-components/resolvers';

import { fileURLToPath } from 'url';
import path from 'path';

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
  return {
    root: './src',
    server: {
      port: 8010,
    },
    plugins: [
      createVuePlugin(),
      Components({
        dirs,
        extensions: ['js'],
        // Need to be set to avoid excluding /node_modules/ paths
        exclude: [],
        importPathTransform: (path) => {
          console.log('🗃️  processing import path:', path);
          return path;
        },
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
