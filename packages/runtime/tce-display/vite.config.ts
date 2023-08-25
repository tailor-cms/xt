import { defineConfig, loadEnv } from "vite";
import Components from "unplugin-vue-components/vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ mode }): any => {
  const env = loadEnv(mode, process.cwd(), "");
  console.log("Loading  display components from", env.TCE_DISPLAY_DIR);
  return {
    root: "./src",
    server: {
      port: 8020,
    },
    plugins: [
      vue(),
      Components({
        dirs: [env.TCE_DISPLAY_DIR],
        resolvers: [
          (componentName) => {
            if (["Display"].includes(componentName)) {
              console.log("Loaded:", componentName);
              return {
                name: "Display",
                as: "TceDisplay",
                from: env.TCE_DISPLAY_DIR,
              };
            }
          },
        ],
      }),
    ],
  };
});
