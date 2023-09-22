import { defineConfig, loadEnv } from 'vite';
import Components from 'unplugin-vue-components/vite';
import uniq from 'lodash/uniq';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

import { fileURLToPath } from 'url';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }): any => {
  const env = loadEnv(mode, process.cwd(), '');
  const viteConfigPath = fileURLToPath(import.meta.url);
  const displayModulePath = path.relative(viteConfigPath, env.TCE_DISPLAY_DIR);

  const dirs = uniq([
    displayModulePath,
    // Defaults
    '../../../../../../../packages/display/dist',
    '../../../tce-template/packages/display/dist',
  ]);
  console.log('📦 Loading display components from:');
  console.log(dirs.join('\n'));
  return {
    root: './src',
    logLevel: 'warn',
    server: {
      port: 8020,
    },
    optimizeDeps: {
      include: [displayModulePath.replace(/\/dist$/, '')],
    },
    resolve: {
      preserveSymlinks: true,
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
            if (['Display'].includes(componentName)) {
              console.log('Loaded:', componentName);
              return {
                name: componentName,
                from: displayModulePath,
              };
            }
          },
        ],
      }),
    ],
  };
});
