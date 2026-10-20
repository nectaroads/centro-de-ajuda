const { performance } = require('node:perf_hooks');
const { system, assistant } = require('./prompts');
const { parseRecommendation } = require('./validation');
function configuration(env = process.env) {
  if (!env.OPENROUTER_API_KEY || !env.GOOGLE_MAPS_API_KEY || !env.OPENROUTER_MODEL) throw new Error('Configure as chaves e o modelo no .env');
  const timeout = Number(env.REQUEST_TIMEOUT_MS || 60000);
  if (!Number.isFinite(timeout) || timeout < 100 || timeout > 300000) throw new Error('REQUEST_TIMEOUT_MS inválido');
  return { apiKey: env.OPENROUTER_API_KEY, mapsKey: env.GOOGLE_MAPS_API_KEY, model: env.OPENROUTER_MODEL, online: env.OPENROUTER_ONLINE === 'true', timeout };
}
function createProviders(config, fetchImpl = fetch) {
  async function geocode(lat, lon) {
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.search = new URLSearchParams({ latlng: `${lat},${lon}`, key: config.mapsKey }).toString();
    const res = await fetchImpl(url, { signal: AbortSignal.timeout(config.timeout) });
    if (!res.ok) throw new Error('Falha na geocodificação');
    const data = await res.json();
    if (data.status !== 'OK' || !data.results?.[0]) throw new Error('Localização não encontrada');
    const components = data.results[0].address_components || [];
    const field = (...types) => components.find(c => types.some(t => c.types.includes(t)))?.long_name ?? null;
    return { street: field('route'), neighborhood: field('neighborhood', 'sublocality_level_1'), city: field('administrative_area_level_2', 'locality'), state: field('administrative_area_level_1'), country: field('country'), zip: field('postal_code') };
  }
  function requestBody(occurrence, location) {
    const content = [];
    if (occurrence.text) content.push({ type: 'text', text: occurrence.text });
    if (occurrence.image) content.push({ type: 'image_url', image_url: { url: occurrence.image } });
    if (occurrence.audio) {
      const [prefix, data] = occurrence.audio.split(',');
      const subtype = prefix.split('/')[1].split(';')[0];
      content.push({ type: 'input_audio', input_audio: { data, format: subtype === 'mpeg' ? 'mp3' : subtype } });
    }
    const model = config.online && !config.model.endsWith(':online') ? `${config.model}:online` : config.model;
    return { model, stream: false, messages: [{ role: 'system', content: system }, { role: 'assistant', content: assistant(occurrence, location) }, { role: 'user', content }] };
  }
  async function classify(occurrence, location) {
    const request = requestBody(occurrence, location), started = performance.now();
    const res = await fetchImpl('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST', headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(request), signal: AbortSignal.timeout(config.timeout)
    });
    const raw = await res.json(), response_time_ms = Math.round(performance.now() - started);
    if (!res.ok || raw.error) {
      const err = new Error('Falha no provedor de IA');
      err.record = { request, raw, http_status: res.status, response_time_ms };
      throw err;
    }
    let recommendation;
    try { recommendation = parseRecommendation(raw.choices?.[0]?.message?.content); }
    catch (err) { err.record = { request, raw, http_status: res.status, response_time_ms }; throw err; }
    return { recommendation, request, raw, http_status: res.status, response_time_ms, usage: raw.usage ?? null };
  }
  return { geocode, classify, requestBody };
}
module.exports = { configuration, createProviders };
