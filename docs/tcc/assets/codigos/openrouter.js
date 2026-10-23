require("dotenv").config();
const dotenv = process.env;
const openrouterURL = "https://openrouter.ai/api/v1/chat/completions";
const messages = [
  { role: "system", content: system },
  { role: "assistant", content: assistant },
  { role: "user", content }
];
const body = { model: `${model}:online`, messages, stream: false };
const response = await fetch(openrouterURL, {
  method: "POST",
  headers: { Authorization: `Bearer ${dotenv.OPENROUTERAPIKEY}`, "Content-Type": "application/json" },
  body: JSON.stringify(body)
});
