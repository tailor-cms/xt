import boxen from "boxen";
import concurrently from "concurrently";

console.log(
  boxen("🚀 Teaching Element Kit", {
    titleAlignment: "center",
    padding: 1,
    margin: 1,
    borderColor: "cyan",
  })
);

concurrently([
  "tce-server-runtime",
  "tce-edit-runtime",
  "tce-display-runtime",
].map((packageName, index) => ({
  // Remove tce- prefix
  name: packageName.slice(4, packageName.length),
  prefixColor: ['magenta', 'green', 'blue'][index],
  command: `cd ./node_modules/${packageName} && pnpm dev`
})));
