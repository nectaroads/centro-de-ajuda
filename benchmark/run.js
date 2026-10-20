const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { validate } = require('../server/validation');
const { createProviders, configuration } = require('../server/providers');
const scenarios = require('./scenarios.json');
async function run() {
  const config = configuration(), providers = createProviders(config);
  const started = new Date().toISOString();
  const dir = path.join(__dirname, 'runs', started.replace(/[:.]/g, '-'));
  fs.mkdirSync(dir, { recursive: true });
  const records = path.join(dir, 'records.jsonl');
  const sha = value => crypto.createHash('sha256').update(value).digest('hex');
  const repetitions = Number(process.env.BENCHMARK_REPETITIONS || 1);
  if (!Number.isInteger(repetitions) || repetitions < 1 || repetitions > 100) throw new Error('Repetições: inteiro entre 1 e 100');
  const models = process.env.BENCHMARK_MODELS?.split(',').map(s => s.trim()).filter(Boolean) || [config.model];
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify({ started_at: started, node: process.version, platform: process.platform, models, online: config.online, timeout_ms: config.timeout, repetitions, scenario_sha256: sha(fs.readFileSync(path.join(__dirname, 'scenarios.json'))), prompts_sha256: sha(fs.readFileSync(path.join(__dirname, '../server/prompts.js'))), generation_parameters: 'temperature, top_p, seed e max_tokens não enviados; padrões do provedor', evaluation: 'manual; ver protocol.md' }, null, 2));
  function load(relative, kind) {
    if (!relative) return null;
    const root = path.resolve(__dirname, 'assets');
    const file = path.resolve(root, relative);
    if (!file.startsWith(root + path.sep)) throw new Error('Arquivo fora dos cenários');
    const ext = path.extname(file).slice(1);
    const type = kind === 'image' ? ({jpg:'image/jpeg',png:'image/png',webp:'image/webp'})[ext] : ({ogg:'audio/ogg',wav:'audio/wav',mp3:'audio/mpeg'})[ext];
    if (!type) throw new Error('Formato de arquivo não suportado');
    const bytes = fs.readFileSync(file);
    return { value: `data:${type};base64,${bytes.toString('base64')}`, sha256: sha(bytes) };
  }
  for (const model of models) for (let repetition=1; repetition<=repetitions; repetition++) for (const scenario of scenarios) {
    const record = { scenario_id: scenario.id, model, repetition, started_at: new Date().toISOString(), input: scenario };
    try {
      const image = load(scenario.image, 'image'), audio = load(scenario.audio, 'audio');
      record.asset_hashes = { image: image?.sha256 ?? null, audio: audio?.sha256 ?? null };
      const occurrence = validate({ ...scenario, image: image?.value, audio: audio?.value });
      record.location = await providers.geocode(occurrence.lat, occurrence.lon);
      const selected = createProviders({ ...config, model });
      record.result = await selected.classify(occurrence, record.location);
    } catch (err) { record.error = err.message; if (err.record) record.provider = err.record; }
    record.finished_at = new Date().toISOString();
    fs.appendFileSync(records, JSON.stringify(record)+'\n');
    console.log(`${model} ${scenario.id} repetição ${repetition}: ${record.error ? 'erro' : 'resposta recebida; avaliação pendente'}`);
  }
  console.log(`Registros: ${dir}`);
}
run().catch(err => { console.error(err.message); process.exitCode = 1; });
