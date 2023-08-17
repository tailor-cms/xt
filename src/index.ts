import boxen from "boxen";
import runServer from "tce-server-runtime";

console.log(
  boxen("🚀 Teaching Element Kit", {
    titleAlignment: "center",
    padding: 1,
    margin: 1,
    borderColor: "yellow",
  })
);

async function run() {
  await runServer({
    type: "TCE_TEST",
    initState: () => ({ x: 1 }),
    hookMap: new Map(),
  });
}

await run();
