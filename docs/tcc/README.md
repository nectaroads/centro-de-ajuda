# Fonte do TCC

Esta pasta contém o projeto Typst do trabalho **Centro de Ajuda: Serviço Inteligente de Recomendação em Situações Emergenciais**, de Pedro Victor Hipólito Cabral, orientado pelo professor Leandro Costa Souza.

O arquivo de entrada é `_main.typ`. As referências ficam em `referencias.bib`, o template em `ifbasaj-tcc/` e os arquivos de apoio em `assets/` e `data/`.

## Gerar o PDF

Com o Typst 0.15.1 instalado, execute na raiz do repositório:

```sh
typst compile docs/tcc/_main.typ docs/tcc/_main.pdf
```

Ou, dentro desta pasta:

```sh
typst compile _main.typ _main.pdf
```

Os imports usam versões explícitas dos pacotes do Typst. Na primeira compilação, o compilador pode precisar acessar a internet para baixá-los. O texto usa New Computer Modern; as listagens usam Consolas e DejaVu Sans Mono. Para manter a mesma composição, disponibilize essas fontes no ambiente de compilação. A fonte New Computer Modern acompanha o compilador usado na conferência.

O PDF incluído nesta pasta foi gerado a partir destes fontes. Ele também acompanha a release `v1.0.0` como `Centro-de-Ajuda-TCC.pdf`. O código da aplicação permanece em `server/` e `client/`, na raiz do repositório.

## Versão do documento

O projeto foi reunido a partir do repositório [tcc-pedro-hipolito-orientador](https://github.com/ifba-saj-ads-tcc/tcc-pedro-hipolito-orientador), commit `73ea48cbe11348618699ecd3974921d0138c64e3`. O conteúdo do trabalho foi preservado nesta organização da entrega.
