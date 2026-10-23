const startedAt = Date.now();
const data = await response.json();
const responseTime = Date.now() - startedAt;
const result = {
  content: extractJson(data.choices?.[0]?.message?.content),
  cost: data.usage?.cost ?? 0,
  response_time_ms: responseTime,
  prompt_tokens: data.usage?.prompt_tokens ?? 0,
  completion_tokens: data.usage?.completion_tokens ?? 0,
  total_tokens: data.usage?.total_tokens ?? 0
};
const rec = result?.content;
const valid = typeof rec?.service_name === "string" && typeof rec?.phone_number === "string" && typeof rec?.emergency_context === "string";
if (!valid) return res.status(500).json({ success: false, reason: "Invalid model response" });
return res.status(200).json({ success: true, service_name: rec.service_name, phone_number: rec.phone_number, emergency_context: rec.emergency_context });
