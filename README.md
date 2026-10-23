# Centro de Ajuda

O Centro de Ajuda nasceu de uma dúvida simples: diante de uma ocorrência, como saber qual serviço procurar? A proposta do TCC é usar um relato em texto, áudio ou imagem, junto da localização e do horário, para sugerir um serviço e apresentar seu contato.

Este repositório reúne o servidor da prova de conceito, os trechos do cliente usados no trabalho e o material disponível para conferir os testes. O cliente é web, acessado pelo navegador. As listagens estão cruas, sem o design e sem uma interface completa.

O resultado é uma recomendação. O sistema não despacha equipes nem faz ligações automaticamente. Os testes exploratórios sugerem potencial técnico, mas não medem eficácia ou segurança em emergências reais. Telefones locais produzidos pelo modelo precisam de confirmação em fonte oficial.

## TCC e entrega final

O [fonte completo do TCC](docs/tcc/) está neste repositório, junto do código da aplicação. O arquivo de entrada é [docs/tcc/_main.typ](docs/tcc/_main.typ), e o [PDF compilado](docs/tcc/_main.pdf) está na mesma pasta.

Para gerar o PDF com Typst 0.15.1, execute na raiz do repositório:

```sh
typst compile docs/tcc/_main.typ docs/tcc/_main.pdf
```

As dependências e instruções de compilação estão em [docs/tcc/README.md](docs/tcc/README.md). A [release v1.0.0](https://github.com/nectaroads/centro-de-ajuda/releases/tag/v1.0.0) registra a entrega com o código, o fonte do trabalho e o PDF.

## Como funciona

O servidor recebe `POST /help`, valida o relato e as coordenadas, consulta a geocodificação reversa do Google Maps e envia o contexto ao modelo escolhido no OpenRouter. A resposta contém `service_name`, `phone_number` e `emergency_context`.

Não há banco de dados, cadastro ou histórico de ocorrências no servidor. A aplicação mantém os dados em memória durante a solicitação. Isso não elimina eventual retenção pelos serviços externos. A arquitetura está em [docs/arquitetura.svg](docs/arquitetura.svg).

## Como executar

Use Node.js 22 ou superior. Na pasta do projeto:

```sh
npm ci
```

Copie `.env.example` para `.env` e preencha `OPENROUTER_API_KEY`, `GOOGLE_MAPS_API_KEY` e `OPENROUTER_MODEL`. Confira no OpenRouter se a rota escolhida aceita as modalidades que você pretende enviar. O identificador do arquivo de exemplo vem do estudo e sua disponibilidade não é garantida. `OPENROUTER_ONLINE=true` acrescenta o sufixo de busca `:online`; esse recurso pode gerar custo adicional e não garante a verificação factual da resposta.

```sh
npm start
```

O servidor escuta em `http://127.0.0.1:27020`. `GET /health` permite conferir se está ativo. Não há uma página de entrada nessa URL: o cliente entregue consiste apenas nas listagens de [client/snippets](client/snippets).

## Enviar um relato

```sh
curl -X POST http://127.0.0.1:27020/help -H "Content-Type: application/json" --data-binary @examples/relato.json
```

No PowerShell, use `curl.exe` para evitar o alias de versões antigas. O arquivo de exemplo contém:

```json
{
  "text": "Meu carro quebrou no acostamento e está escurecendo.",
  "lat": -13.006421,
  "lon": -41.370269,
  "time": "2026-07-03T18:46:00-03:00"
}
```

Forneça ao menos texto, imagem ou áudio. O texto aceita até 2.000 caracteres; `image` e `audio` recebem data URLs em base64, até 5 MiB cada. Imagens: JPEG, PNG ou WebP. Áudios: OGG, WAV, MP3 ou WebM, sujeitos ao suporte do modelo remoto. Latitude e longitude devem ser números. O horário deve incluir fuso; quando omitido, usa-se o instante recebido pelo servidor.

Uma resposta estruturalmente válida tem este formato ilustrativo, sem representar um resultado medido:

```json
{
  "success": true,
  "service_name": "Serviço sugerido",
  "phone_number": "",
  "emergency_context": "Resumo da ocorrência e eventual limitação na identificação do contato."
}
```

`success` informa que o fluxo produziu a estrutura esperada; não comprova que a recomendação é correta. Um contato não identificável pode vir vazio. Dados inválidos retornam 400, corpo excessivo retorna 413 e falhas dos serviços externos ou respostas inválidas retornam 502. Caminhos de arquivos locais não são aceitos pela API.

## Código e avaliação

`server/` contém a rota, validações, prompts e integrações. `client/snippets/` preserva os trechos do TCC. `benchmark/` reúne os cenários, as entradas e o protocolo, separando material histórico de novas execuções. `docs/` reúne o fonte do TCC, a arquitetura e as limitações de privacidade.

```sh
npm test
npm run benchmark
```

Os testes locais usam respostas simuladas e não consomem as APIs. O benchmark faz chamadas reais e pagas. Leia [o protocolo](benchmark/protocol.md) antes de executá-lo. Há um registro histórico com quatro respostas do Gemini; os registros brutos dos outros seis modelos descritos no TCC não foram localizados. Não foram gerados novos resultados para preencher essa lacuna.

## Dados e privacidade

Relatos, vozes, imagens e localização podem identificar pessoas ou revelar informações de saúde. A geocodificação recebe as coordenadas; o OpenRouter e o provedor selecionado recebem o relato e o contexto. Use dados de teste autorizados. As políticas e a retenção dos terceiros precisam ser avaliadas antes de qualquer uso real. Veja [as decisões e pendências de privacidade](docs/privacidade.md).

## Relação com o TCC

O código parte do projeto AI-Emergency-Caller e das listagens do trabalho [Centro de Ajuda](https://github.com/ifba-saj-ads-tcc/tcc-pedro-hipolito-orientador). Nesta versão foram corrigidos problemas de variáveis indefinidas na rota, leitura de arquivos em entradas HTTP, validação das coordenadas, tratamento de erros e extração da resposta. Os prompts e o registro das novas execuções também foram revistos; isso não modifica retroativamente os resultados históricos.

O design foi deixado fora desta entrega. PWA, validação com profissionais, base de contatos verificados e avaliação com usuários permanecem como possibilidades de continuidade.
