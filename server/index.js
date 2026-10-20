const { createApp } = require('./app');
const { createProviders, configuration } = require('./providers');
const port = Number(process.env.PORT || 27020);
const host = process.env.HOST || '127.0.0.1';
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT inválida');
createApp(createProviders(configuration())).listen(port, host, () => console.log(`Centro de Ajuda: http://${host}:${port}`));
