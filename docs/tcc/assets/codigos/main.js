const { startExpress } = require("./source/express/express");
const { print } = require("./source/scripts/tools");

async function main() {
    console.clear();
    print("[Setup] Main module: Starting core systems: Please, wait...");
    await startExpress(27020);
}
