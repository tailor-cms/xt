import path from "node:path";
import { fileURLToPath } from "node:url";
import boxen from "boxen";
import concurrently from "concurrently";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detect if run within t-xt or tce-template
const codeDir = __dirname.includes("t-xt")
  ? __dirname.replace("/tce-boot/src", "/tce-template/packages")
  : path.resolve(__dirname, "../../../packages");

console.log(
  boxen("🚀 Teaching Element Kit", {
    titleAlignment: "center",
    padding: 1,
    margin: 1,
    borderColor: "cyan",
  })
);

const tceBootEnv = {
  TCE_DISPLAY_DIR: `${codeDir}/display/dist/index.js`,
  TCE_EDIT_DIR: `${codeDir}/edit/dist/index.js`,
  TCE_SERVER_DIR: `${codeDir}/server/dist/index.js`
}
Object.keys(tceBootEnv).forEach((key) => (process.env[key] = tceBootEnv[key]))

concurrently(
  ["tce-server-runtime", "tce-edit-runtime", "tce-display-runtime"].map(
    (packageName, index) => ({
      // Remove tce- prefix
      name: packageName.slice(4, packageName.length),
      prefixColor: ["magenta", "green", "blue"][index],
      command: `cd ./node_modules/${packageName} && pnpm dev`,
    })
  )
);
