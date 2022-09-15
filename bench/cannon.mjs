import autocannon from "autocannon";

let nodeResult;
let bunResult;

const node = {
  url: "http://localhost:3000",
  name: "node",
};

const bun = {
  url: "http://localhost:3001",
  name: "bun",
};

function handleNodeResults(results) {
  nodeResult = results;
  console.log("----------- BUN + Melonpan BENCHMARK -----------");
  ac(bun);
}

function handleBunResults(results) {
  bunResult = results;
  console.log("Node + Express Requests: ", nodeResult.statusCodeStats);
  console.log("Bun + Melonpan Requests: ", bunResult.statusCodeStats);
  if (
    bunResult.statusCodeStats["200"].count &&
    nodeResult.statusCodeStats["200"].count
  ) {
    const percentage =
      (bunResult.statusCodeStats["200"].count /
        nodeResult.statusCodeStats["200"].count) *
      100;
    console.log(
      "\x1b[36m%s\x1b[0m",
      `Bun + Melonpan performs ${percentage} % compared to Node + ExpressJS`
    );
  }
}

async function ac(config) {
  const instance = autocannon({
    title: `Benchmark for ${config.name}`,
    url: config.url,
    connections: 100,
    pipelining: 10,
    duration: 40,
  });
  autocannon.track(instance);
  process.once("SIGINT", () => {
    instance.stop();
  });

  instance.on("done", (results) => {
    if (config.name === "node") {
      handleNodeResults(results);
    } else {
      handleBunResults(results);
    }
  });
}

async function startBench() {
  console.log("----------- NODE + Express BENCHMARK -----------");
  ac(node);
}

startBench();
