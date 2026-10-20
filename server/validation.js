class InputError extends Error {}
function media(value, kind) {
  if (value == null) return null;
  if (typeof value !== 'string') throw new InputError(`${kind}: informe uma data URL`);
  const match = /^data:([^;,]+);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  const allowed = kind === 'image' ? ['image/jpeg', 'image/png', 'image/webp'] : ['audio/ogg', 'audio/wav', 'audio/mpeg', 'audio/webm'];
  if (!match || !allowed.includes(match[1]) || match[2].length % 4 !== 0)
    throw new InputError(`${kind}: formato inválido`);
  if (Buffer.byteLength(match[2], 'base64') > 5 * 1024 * 1024) throw new InputError(`${kind}: limite de 5 MiB`);
  return value;
}
function validate(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new InputError('Corpo JSON inválido');
  const { lat, lon } = body;
  if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lon) || lon < -180 || lon > 180)
    throw new InputError('Latitude e longitude numéricas são obrigatórias');
  if (body.text != null && typeof body.text !== 'string') throw new InputError('Texto inválido');
  const text = body.text?.trim() || null;
  if (text?.length > 2000) throw new InputError('Limite de 2000 caracteres');
  const image = media(body.image, 'image'), audio = media(body.audio, 'audio');
  if (!text && !image && !audio) throw new InputError('Forneça texto, áudio ou imagem');
  const time = body.time ?? new Date().toISOString();
  if (typeof time !== 'string' || !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(time) || !Number.isFinite(Date.parse(time)))
    throw new InputError('Horário ISO 8601 com fuso obrigatório');
  return { text, image, audio, lat, lon, time };
}
function parseRecommendation(text) {
  if (typeof text !== 'string') throw new Error('Resposta sem conteúdo textual');
  const clean = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const value = JSON.parse(clean);
  if (!value || Array.isArray(value) || !['service_name', 'phone_number', 'emergency_context'].every(k => typeof value[k] === 'string'))
    throw new Error('Estrutura de resposta inválida');
  if (!value.service_name.trim() || !value.emergency_context.trim()) throw new Error('Resposta vazia');
  if (value.phone_number && !/^[+()\d\s.-]{2,40}$/.test(value.phone_number)) throw new Error('Formato de telefone inválido');
  return Object.fromEntries(['service_name', 'phone_number', 'emergency_context'].map(k => [k, value[k].trim()]));
}
module.exports = { validate, parseRecommendation, InputError };
