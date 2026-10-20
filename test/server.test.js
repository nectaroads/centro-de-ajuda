const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { createApp } = require('../server/app');
const { validate, parseRecommendation } = require('../server/validation');
const { createProviders } = require('../server/providers');
const input = { text: 'Árvore sobre fiação com faíscas', lat: 0, lon: 0, time: '2026-04-09T03:41:00-03:00' };
const recommendation = { service_name: 'Serviço de teste', phone_number: '193', emergency_context: 'Árvore sobre fiação' };

test('validação aceita coordenada zero e rejeita valores ausentes ou fora da faixa', () => {
  assert.equal(validate(input).lat, 0);
  for (const patch of [{lat: null}, {lon: 181}, {lat: '0'}, {text: ''}, {time:'ontem'}, {text: 'x'.repeat(2001)}]) {
    assert.throws(() => validate({...input, ...patch}));
  }
});
test('API recusa caminhos locais e MIME não permitido; aceita áudio sem texto', () => {
  assert.throws(() => validate({...input, image:'C:/arquivo.jpg'}));
  assert.throws(() => validate({...input, image:'data:text/html;base64,YQ=='}));
  assert.equal(validate({...input, text:null, audio:'data:audio/ogg;base64,YQ=='}).text, null);
});
test('resposta precisa de três strings, mas telefone desconhecido pode estar vazio', () => {
  assert.deepEqual(parseRecommendation(JSON.stringify(recommendation)), recommendation);
  assert.equal(parseRecommendation(JSON.stringify({...recommendation, phone_number:''})).phone_number, '');
  assert.throws(() => parseRecommendation('{"service_name":"teste"}'));
  assert.throws(() => parseRecommendation(JSON.stringify({...recommendation, phone_number:'javascript:alert(1)'})));
  assert.throws(() => parseRecommendation(JSON.stringify({...recommendation, emergency_context:''})));
});
test('rota HTTP coordena geocodificação, classificação, erro de entrada e erro remoto', async t => {
  let calls=0, fail=false;
  const server = createApp({
    geocode: async (lat,lon) => { calls++; assert.equal(lat,0); assert.equal(lon,0); return {city:'Teste'}; },
    classify: async (occurrence, location) => { assert.equal(location.city,'Teste'); assert.equal(occurrence.time,input.time); if(fail) throw new Error('segredo remoto'); return {recommendation}; }
  }).listen(0,'127.0.0.1');
  await once(server,'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  const url=`http://127.0.0.1:${server.address().port}`;
  const post=body => fetch(url+'/help',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  const res=await post(input);
  assert.equal(res.status,200); assert.equal(res.headers.get('cache-control'),'no-store');
  assert.deepEqual(await res.json(),{success:true,...recommendation});
  assert.equal((await post({...input,lat:null})).status,400); assert.equal(calls,1);
  fail=true;
  const failed=await post(input); assert.equal(failed.status,502); assert.doesNotMatch(await failed.text(),/segredo/);
  const malformed=await fetch(url+'/help',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'});
  assert.equal(malformed.status,400);
});
test('integração preserva modalidades, contexto, métricas ausentes e falhas brutas', async () => {
  const sent=[];
  const config={apiKey:'fake', mapsKey:'fake', model:'example/model', online:true, timeout:1000};
  let broken=false;
  const providers=createProviders(config, async (url, options) => {
    sent.push(JSON.parse(options.body));
    if(broken) return new Response(JSON.stringify({error:{message:'incompatível',code:404}}),{status:404});
    return new Response(JSON.stringify({model:'example/resolved',choices:[{message:{content:JSON.stringify(recommendation)}}]}),{status:200});
  });
  const result=await providers.classify({...input,image:'data:image/jpeg;base64,YQ==',audio:'data:audio/ogg;base64,YQ=='},{city:'Teste'});
  assert.equal(sent[0].model,'example/model:online');
  assert.deepEqual(sent[0].messages[2].content.map(x=>x.type),['text','image_url','input_audio']);
  assert.equal(result.usage,null); assert.ok(result.response_time_ms>=0);
  broken=true;
  await assert.rejects(providers.classify(input,{}),err => err.record.http_status===404 && err.record.raw.error.code===404 && err.record.response_time_ms>=0);
});
test('geocodificação vazia é tratada como falha', async () => {
  const providers=createProviders({timeout:1000,mapsKey:'fake'},async()=>new Response(JSON.stringify({status:'ZERO_RESULTS',results:[]})));
  await assert.rejects(providers.geocode(0,0),/Localização não encontrada/);
});
