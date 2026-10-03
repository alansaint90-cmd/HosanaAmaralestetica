# Hosana Amaral — Estética Avançada

Reconstrução estática e responsiva da referência Lovable com as fotografias fornecidas. Não depende de pacotes externos para gerar ou servir o site. Requer Node.js 22 ou superior.

## Abrir localmente

```sh
node scripts/build.mjs
node scripts/serve.mjs
```

Abra http://127.0.0.1:4187. O servidor usa apenas a interface local. Os arquivos finais estão em `dist/`, prontos para hospedagem estática com suporte a diretórios `index.html`.

## Editar

- `src/data/siteContent.json`: conteúdo, FAQ, tratamentos e número oficial do WhatsApp.
- `src/data/legal.json`: textos das páginas legais, preservados da referência publicada.
- `src/render.mjs`: estrutura inicial, slides e componentes básicos.
- `src/sections.mjs`: demais seções.
- `src/style.css`: cores, tipografia, espaçamento e adaptação de telas.
- `src/app.js`: carrossel, filtros, menu, galeria e animações.
- `dist/assets/`: fotografias WebP locais em dois tamanhos. Não foram geradas imagens ou alterados resultados de procedimentos.

Execute novamente `node scripts/build.mjs` após alterações e atualize o navegador. Fontes: Cormorant Garamond e Manrope via Google Fonts, com alternativas locais de segurança.

## Comportamentos

Quatro slides com transição suave, setas, seleção direta, swipe e controle de reprodução. A reprodução pausa com foco, hover, aba oculta ou interação manual; respeita a preferência de movimento reduzido. Menu e galeria usam diálogos nativos com Escape e foco contido. Filtros atualizam a lista e anunciam o resultado. FAQ usa elementos nativos acessíveis.

## Referências e limites

Conteúdo conferido em https://radiant-advances.lovable.app/ durante a reconstrução. WhatsApp: +55 71 99629-7451. Os links externos abrem o canal; o site não envia mensagens nem confirma agendamentos.

Os seis cards originalmente sem fotos usam agora imagens ilustrativas geradas com a ferramenta integrada image_gen, conforme solicitado. Os originais estão em `output/imagegen/`, os prompts finais em `src/data/generated-images.json` e as versões WebP em `dist/assets/`. A imagem de estética facial é a fotografia original; a nova foto IMG_1122 foi acrescentada à galeria como atendimento-novo. Imagens conceituais não representam equipamentos ou resultados específicos da clínica. Endereço, preços, currículo, depoimentos e explicações clínicas não foram inventados.

Rotas: `/`, `/privacidade`, `/termos`, com aliases `/politica-de-privacidade` e `/termos-de-uso`. A publicação e a definição de um domínio final estão pendentes. Um sitemap com URLs absolutas deve ser criado quando esse domínio for definido. Nenhuma configuração de hospedagem existente foi alterada.
