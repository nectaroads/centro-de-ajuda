const { dotenv } = require('./constants');
const { print, extractLocation, fileToBase64, extractJson } = require('./tools');

const openrouterURL = 'https://openrouter.ai/api/v1/chat/completions';

async function askOpenRouter({ model, system, assistant, user, image, audio }) {
  if (!system) return;
  if (!assistant) return;
  const startedAt = Date.now();
  const content = [];
  if (user) content.push({ type: 'text', text: user });
  if (image) content.push({ type: 'image_url', image_url: { url: `data:image/${image.split('.').pop().toLowerCase()};base64,${fileToBase64(image)}` } });
  if (audio) content.push({ type: 'input_audio', input_audio: { data: fileToBase64(audio), format: 'ogg' } });
  const messages = [];
  messages.push({ role: 'system', content: system });
  messages.push({ role: 'assistant', content: assistant });
  messages.push({ role: 'user', content });
  const body = { model: `${model}:online`, messages: messages, stream: false };
  const res = await fetch(openrouterURL, { method: 'POST', headers: { Authorization: `Bearer ${dotenv.OPENROUTERAPIKEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json();
  const responseTime = Date.now() - startedAt;
  const message = {};
  if (!res.ok) {
    message.content = data.error.message;
    message.code = data.error.code;
    message.cost = 0;
    message.response_time_ms = 0;
    message.prompt_tokens = 0;
    message.completion_tokens = 0;
    message.total_tokens = 0;
    return message ?? null;
    //JSON.stringify(data, null, 2);
    //throw new Error(data);
  }
  message.content = extractJson(data.choices?.[0]?.message?.content);
  if (message.content) {
    message.cost = data.usage?.cost ?? 0;
    message.response_time_ms = responseTime;
    message.prompt_tokens = data.usage?.prompt_tokens ?? 0;
    message.completion_tokens = data.usage?.completion_tokens ?? 0;
    message.total_tokens = data.usage?.total_tokens ?? 0;
  }
  return message ?? null;
}

async function getLocation(lat, lon) {
  const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${dotenv.GOOGLEKEY}`);
  const data = await res.json();
  return extractLocation(data);
}

module.exports = { askOpenRouter, getLocation };
