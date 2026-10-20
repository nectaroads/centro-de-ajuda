# Dados e privacidade

O servidor não grava relatos, arquivos, coordenadas ou respostas em logs e não usa banco de dados. Há limite de corpo, validação, tempo máximo de espera e resposta com `Cache-Control: no-store`. As chaves ficam em variáveis de ambiente. O padrão de escuta é local; disponibilizar o servidor na internet exige revisar autenticação, limites de requisições, TLS e controle de acesso.

As coordenadas são enviadas ao Google Maps. O relato, a localização resolvida e o horário seguem para o OpenRouter e o provedor selecionado. Não há anonimização automática. A gravação pode conter nomes e vozes de terceiros, e uma imagem pode conter rostos ou endereços. Não há garantia de exclusão ou retenção zero nos fornecedores.

O modo de benchmark grava entradas, saídas e mídias em `benchmark/runs/`, ignorado pelo Git. Isso serve à conferência experimental, mas cria persistência que não existe na rota HTTP. Restrinja o acesso e defina descarte. Os arquivos históricos não trazem documentação de consentimento ou autoria das vozes e imagens; confirmar a autorização é pendência anterior à publicação pública desses materiais.

Antes de uso real, cabe ao responsável definir finalidade e base legal adequadas aos dados tratados, informar os titulares, minimizar a coleta, examinar contratos e transferências internacionais, estabelecer retenção e descarte, atender direitos dos titulares e avaliar riscos. A permissão de microfone ou localização do navegador não resolve essas obrigações. A eventual hipótese de proteção da vida não se aplica automaticamente a todo teste, retenção ou compartilhamento posterior.

Essas pendências não foram validadas no protótipo. A referência legal é a [Lei 13.709/2018](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm), especialmente arts. 4º, II, b, 5º, 6º, 7º, 11, 18, 33 e 46.
