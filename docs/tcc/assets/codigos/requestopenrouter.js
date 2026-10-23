const openrouterURL =
    "https://openrouter.ai/api/v1/chat/completions";

const response = await fetch(openrouterURL, {
    method: "POST",
    headers: {
        Authorization:
            `Bearer ${dotenv.OPENROUTERAPIKEY}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
});
