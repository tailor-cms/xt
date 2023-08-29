import { defineConfig, loadEnv } from 'vite';
import Components from 'unplugin-vue-components/vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import { VuetifyResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig(({ mode }): any => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    root: './src',
    server: {
      port: 8010,
    },
    plugins: [
      createVuePlugin(),
      Components({
        dirs: [env.TCE_EDIT_DIR],
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
