import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

import { resolve } from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), libInjectCss()],
  build: {
    // In order to avoid display runtime issues
    // due to package missing (if dist is deleted for short time)
    emptyOutDir: false,
    minify: false,
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'TceDisplay',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rolldownOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        exports: 'named',
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
