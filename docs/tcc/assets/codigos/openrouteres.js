const startedAt = Date.now();

const response = await fetch(openrouterURL, {
    method: "POST",
    headers: {
        Authorization:
            `Bearer ${dotenv.OPENROUTERAPIKEY}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
});

const data = await response.json();
const responseTime = Date.now() - startedAt;

if (!response.ok) {
    return {
        content: null,
        code: data.error?.code,
        error: data.error?.message,
        cost: 0,
        response_time_ms: responseTime,
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
    };
}

const result = {
    content: extractJson(
        data.choices?.[0]?.message?.content
    ),
    cost: data.usage?.cost ?? 0,
    response_time_ms: responseTime,
    prompt_tokens:
        data.usage?.prompt_tokens ?? 0,
    completion_tokens:
        data.usage?.completion_tokens ?? 0,
    total_tokens:
        data.usage?.total_tokens ?? 0
};

