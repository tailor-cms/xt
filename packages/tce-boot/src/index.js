import { createRequire } from "node:module";
import path from "node:path";

import boxen from "boxen";
import concurrently from "concurrently";

const require = createRequire(import.meta.url);

const runtimes = await Promise.all(
  ["server", "edit", "display"].map(async (name) => {
    const pkgRef = `@tailor-cms/tce-${name}-runtime/package.json`;
    const pkgPath = await require.resolve(pkgRef);
    return {
      name,
      path: path.dirname(pkgPath),
    };
  })
);

console.log(
  boxen("🚀 Teaching Element Kit", {
    titleAlignment: "center",
    padding: 1,
    margin: 1,
    borderColor: "cyan",
  })
);

const { INIT_CWD } = process.env;
const tceBootEnv = {
  TCE_DISPLAY_DIR: `${INIT_CWD}/packages/display/dist/index.js`,
  TCE_EDIT_DIR: `${INIT_CWD}/packages/edit/dist/index.js`,
  TCE_SERVER_DIR: `${INIT_CWD}/packages/server/dist/index.js`,
};
Object.keys(tceBootEnv).forEach((key) => (process.env[key] = tceBootEnv[key]));

concurrently(
  runtimes.map((runtime, index) => ({
    name: `${runtime.name}-runtime`,
    prefixColor: ["magenta", "green", "blue"][index],
    command: `cd ${runtime.path} && pnpm dev`,
  }))
);
