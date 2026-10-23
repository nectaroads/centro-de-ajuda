const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
    maxAge: 86400
}));

async function startExpress(port) {
    setupEvents();
    return new Promise((resolve, reject) => {
        app.listen(port, "0.0.0.0", error => {
            if (error) return reject(error);
            print(`[Setup] Express: Listening on: ${port}`);
            resolve();
        });
    });
}

module.exports = { startExpress };
