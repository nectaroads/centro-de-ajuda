const path = require("path");
const fs = require("fs");

const endpointHandlers = {};
const endpointHandlersDir = path.join(__dirname, "./endpoints");

fs.readdirSync(endpointHandlersDir).forEach(file => {
    if (!file.endsWith(".js")) return;
    const endpointName = path.basename(file, ".js");
    endpointHandlers[endpointName] = require(path.join(endpointHandlersDir,   
    file));
});

function setupEvents() {
    for (const endpointName in endpointHandlers) {
        print(`[Setup] Express: Event created: ${endpointName}`);
        app.post(`/${endpointName}`, (req, res) => {
            handleRequest(req, res, endpointName);
        });
    }
}

function handleRequest(req, res, endpointName) {
    const address =
        req.headers["x-forwarded-for"] ||
        req.connection?.remoteAddress ||
        "Debug";

    print(`[Request] Express: Web request by: ${address}`);

    if (!req.body) return res.status(400).json({ error: "Missing body" });
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    print(`[Log] Express: Handling request: ${endpointName}`);
    const handler = endpointHandlers[endpointName];
    if (handler) return handler(req, res);
}
