const express = require('express');
const { validate, InputError } = require('./validation');
function createApp({ geocode, classify }) {
  const app = express();
  app.disable('x-powered-by');
  app.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  app.use(express.json({ limit: '15mb' }));
  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.post('/help', async (req, res) => {
    try {
      const occurrence = validate(req.body);
      const location = await geocode(occurrence.lat, occurrence.lon);
      const { recommendation } = await classify(occurrence, location);
      res.json({ success: true, ...recommendation });
    } catch (err) {
      const status = err instanceof InputError ? 400 : 502;
      res.status(status).json({ success: false, reason: status === 400 ? err.message : 'Não foi possível obter uma recomendação válida' });
    }
  });
  app.use((err, req, res, next) => {
    const status = err.type === 'entity.too.large' ? 413 : err.type === 'entity.parse.failed' ? 400 : 500;
    res.status(status).json({ success: false, reason: status === 413 ? 'Solicitação excede 15 MiB' : 'Solicitação inválida' });
  });
  return app;
}
module.exports = { createApp };
