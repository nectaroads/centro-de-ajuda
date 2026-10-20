const { startExpress } = require('./source/express/express');
const { askOpenRouter, getLocation } = require('./source/scripts/fetch');
const { print, fileToBase64, log } = require('./source/scripts/tools');

const benchmark = require('./source/jsons/benchmark.json');
const { systemprompt, assistantprompt } = require('./source/scripts/constants');

async function benchmarkTest() {
  print(`[Log] Benchmark: Building context`);

  let string = '';

  for (const model of benchmark.models) {
    for (const emergency of benchmark.emergencies) {
      const context = {};
      context.model = model;
      context.emergency = emergency;
      print(`[Log] Benchmark: Getting context location`);
      context.location = await getLocation(emergency.lat, emergency.lon);
      print(`[Log] Benchmark: Building prompts`);
      context.prompt = {};
      context.prompt.system = systemprompt;
      context.prompt.assistant = assistantprompt(context);
      context.prompt.user = emergency.text;
      context.prompt.image = emergency.image;
      context.prompt.audio = emergency.audio;
      print(`[Log] Benchmark: Asking OpenRouter: ${model}`);
      try {
        const res = await askOpenRouter({ model: context.model, system: context.prompt.system, assistant: context.prompt.assistant, user: context.prompt.user, image: context.prompt.image, audio: context.prompt.audio });
        const { lat, lon, ...input } = emergency;
        string += `\n\n# Model: ${model}\n`;
        string += `${JSON.stringify({ input: { ...input, location: context.location }, response: res }, null, 2)}\n`;
        console.log(res);
      } catch (err) {
        string += `\n\n# Model: ${model}\n`;
        string += `${JSON.stringify({ input: { text: emergency.text, audio: emergency.audio, image: emergency.image, time: emergency.time }, error: err.message || String(err) }, null, 2)}\n`;
      }
    }
    log('./benchmark.txt', string.trim(), true);
  }
}

async function simpleTest() {
  print(`[Log] Benchmark: Building context`);
  const context = {};
  context.model = benchmark.models[0];
  context.emergency = benchmark.emergencies[4];
  print(`[Log] Benchmark: Getting context location`);
  context.location = await getLocation(context.emergency.lat, context.emergency.lon);
  print(`[Log] Benchmark: Building prompts`);
  context.prompt = {};
  context.prompt.system = systemprompt;
  context.prompt.assistant = assistantprompt(context);
  context.prompt.user = context.emergency.text;
  context.prompt.image = context.emergency.image;
  context.prompt.audio = context.emergency.audio;
  print(`[Log] Benchmark: Asking OpenRouter`);
  const res = await askOpenRouter({ model: context.model, system: context.prompt.system, assistant: context.prompt.assistant, user: context.prompt.user, image: context.prompt.image, audio: context.prompt.audio });
  console.log(res);
}

// Start the system
async function main() {
  console.clear();
  print(`[Setup] Main module: Starting core systems: Please, wait...`);
  //simpleTest();
  benchmarkTest();
}

main();
