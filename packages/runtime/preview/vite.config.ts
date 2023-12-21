import { defineConfig } from 'vite';
import defaults from 'lodash/defaults';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

const applyDefaultEnv = () => {
  const env = process.env;
  const ENV_DEFAULTS = {
    VITE_PREVIEW_RUNTIME_PORT: '8080',
    VITE_EDIT_RUNTIME_URL: 'http://localhost:8010',
    VITE_DISPLAY_RUNTIME_URL: 'http://localhost:8020',
    VITE_SERVER_RUNTIME_URL: 'http://localhost:8030',
  };
  defaults(env, ENV_DEFAULTS);
};

// https://vitejs.dev/config/
export default defineConfig((): any => {
  applyDefaultEnv();
  return {
    root: './src',
    server: {
      // Accept connections from any host (Docker)
      host: '0.0.0.0',
      port: parseInt(process.env.VITE_PREVIEW_RUNTIME_PORT, 10),
    },
    logLevel: 'warn',
    optimizeDeps: { entries: ['./src/main.js'] },
    plugins: [vue(), vuetify({ autoImport: true })],
  };
});
