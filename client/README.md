# Cliente

Os arquivos em `snippets/` são os trechos do cliente apresentados no TCC, sem o design das telas. Eles cobrem captura de texto, gravação de áudio, seleção de imagem, envio e leitura da recomendação.

São listagens, não uma interface pronta: algumas dependem de elementos HTML, variáveis e funções definidos em outros trechos. Não há PWA, manifesto, service worker ou aplicação nativa entregue nesta versão.

O servidor aceita texto e data URLs para imagem e áudio. O caminho de arquivo usado pelo benchmark não é aceito pela rota HTTP. Para integrar as listagens, converta os blobs com `FileReader.readAsDataURL`, envie números em `lat` e `lon`, preserve o MIME real da gravação e use o contrato de `POST /help` do README principal. Microfone e geolocalização exigem permissão do navegador e contexto seguro, como HTTPS ou localhost. O suporte do navegador a um formato não garante suporte da rota de IA a esse mesmo formato.

O esquema `tel:` apenas solicita a abertura do discador quando houver um telefone válido. A decisão de ligar permanece com o usuário.
