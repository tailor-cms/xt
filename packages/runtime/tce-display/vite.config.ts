import { defineConfig, loadEnv } from "vite";
import Components from "unplugin-vue-components/vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    root: "./src",
    server: {
      port: 8020,
    },
    plugins: [
      vue(),
      Components({
        dirs: [env.TCE_DISPLAY_DIR],
      }),
    ],
  };
});
