import { defineConfig, loadEnv } from 'vite';
import Components from 'unplugin-vue-components/vite';
import defaults from 'lodash/defaults';
import uniq from 'lodash/uniq';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

import { fileURLToPath } from 'url';
import path from 'node:path';

const applyDefaultEnv = () => {
  const env = process.env;
  const ENV_DEFAULTS = {
    VITE_DISPLAY_RUNTIME_PORT: '8020',
    VITE_SERVER_RUNTIME_URL: 'http://localhost:8030',
  };
  defaults(env, ENV_DEFAULTS);
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }): any => {
  applyDefaultEnv();
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
  const {
    VITE_DISPLAY_RUNTIME_PORT,
    VITE_SERVER_RUNTIME_URL
  } = env;
  return {
    root: './src',
    logLevel: 'warn',
    server: {
      // Accept connections from any host (Docker)
      host: '0.0.0.0',
      port: parseInt(VITE_DISPLAY_RUNTIME_PORT, 10),
      proxy: {
        '/tce-server': {
          target: VITE_SERVER_RUNTIME_URL,
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/tce-server/, ''),
        },
      },
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
