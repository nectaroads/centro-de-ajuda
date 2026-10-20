# Protocolo de avaliação

O benchmark é uma comparação exploratória das combinações entre modelo e cenário. Os quatro casos completos estão em `scenarios.json`; os arquivos de áudio e imagem estão em `assets/`, com hashes em `assets.sha256.json`. O horário de cada cenário é contexto simulado, não a data da execução. C2 contém uma data posterior à banca registrada no texto; isso não demonstra quando o teste ocorreu.

## Registros históricos

`historical-gemini.txt` preserva o único registro bruto localizado: quatro respostas identificadas como `google/gemini-3.5-flash`. Não há nesse arquivo data real de execução, ID imutável do modelo, provedor resolvido ou versão dos pesos. Há log de atividade em 23/09/2026 no projeto de origem, mas não é possível atribuir essa data a cada resposta. A data da análise documental declarada no TCC, 10/06/2026, também não equivale à data de execução.

As tabelas dos sete modelos no TCC são resultados descritos pelo autor; os registros completos dos outros seis modelos não foram encontrados. O arquivo de configuração principal preservado lista somente o Gemini. A configuração de composições contém seis famílias, não sete, e não comprova execuções. Não se deve reconstruir os resultados ausentes a partir dessas configurações.

`legacy-prompts.cjs`, `legacy-fetch.cjs` e `legacy-runner.cjs` documentam o procedimento original e não são executados pelos comandos atuais. O código histórico adicionava `:online`, usava `stream: false`, não enviava `temperature`, `top_p`, `seed` ou `max_tokens`, e assumia OGG nos áudios. Na falha de API, substituía métricas por zero; zero nesse caso não é medida de tempo nem custo. Os prompts históricos e os trechos do TCC têm diferenças de redação, por isso ambos são preservados. O prompt atual é revisado e seus resultados não devem ser misturados aos históricos.

## Nova execução

Configure `.env`, execute `npm ci` e depois `npm run benchmark`. O padrão é uma execução por cenário e pelo modelo configurado. `BENCHMARK_MODELS` aceita IDs separados por vírgula, e `BENCHMARK_REPETITIONS` define repetições. Cada execução faz chamadas pagas e envia os arquivos aos provedores externos. Use apenas material de teste cuja utilização esteja autorizada. A origem, a autoria e o consentimento para divulgação das vozes e imagens históricas não estão documentados no projeto original; precisam ser confirmados antes de uma publicação pública desses arquivos.

As novas execuções salvam em `runs/` um manifesto e registros JSONL com horários reais, cenário, arquivos e hashes, localização resolvida, requisição completa, retorno bruto, identificação retornada pelo provedor, erros, tempo em ms e uso informado pela API. As chaves não são gravadas. O tempo cobre envio e leitura da resposta do OpenRouter, sem geocodificação; custo é USD quando informado, e ausência de métrica permanece ausente. A versão dos pesos pode continuar indisponível: registre essa limitação. Não há retry automático nem substituição de modelo no código local; o roteamento remoto depende do OpenRouter.

## Regras para análise manual

Classifique separadamente execução HTTP, estrutura JSON, interpretação, adequação do serviço e verificação do telefone. Salve a avaliação com ID do cenário, execução, avaliador, regra aplicada, justificativa e fonte oficial consultada para o contato. O runner não transforma validade estrutural em sucesso semântico.

| Caso | Elementos centrais esperados |
| --- | --- |
| C1 | Veículo imobilizado no acostamento, passageira idosa, anoitecer e insegurança |
| C2 | Árvore sobre fiação, faíscas e obstrução da via após chuva |
| C3 | Relato sonoro de gato atropelado; não atribuir transcrição literal sem ouvi-lo |
| C4 | Relato e imagem de água entrando em residência após chuva |

“Sucesso” de interpretação exige reconhecer a ocorrência central sem contradição relevante. Erro de rota ou incompreensão é “Falha”; registro vazio ou inacessível é “Sem resultado”. JSON completo por resposta exige as três strings; a cobertura por modelo conta quantos cenários cumprem cada critério. “Adequação” é coerência qualitativa, não validação clínica ou operacional. Um telefone sem confirmação oficial permanece “não verificado”, mesmo com resumo coerente. Dois avaliadores independentes e registro de discordâncias são propostas para uma nova avaliação, não procedimentos atribuídos aos testes históricos.

Uma execução por combinação não permite estimar variabilidade. Não há gabarito validado por profissionais, demonstração de segurança, comparação estatística ou teste de remoção de modalidades. Composições de modelos exigem avaliação própria. O objetivo é examinar viabilidade técnica do protótipo.
