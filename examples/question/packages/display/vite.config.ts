import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

import { resolve } from 'node:path';

export default defineConfig({
  plugins: [vue(), libInjectCss()],
  build: {
    emptyOutDir: false,
    minify: false,

    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'TceDisplay',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rolldownOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
      },
    },
  },
});
