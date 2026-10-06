# Easypanel

- Fonte: GitHub, repositório `alansaint90-cmd/HosanaAmaralestetica`, branch `main`.
- Build Path: `/`.
- Builder: Dockerfile. Caminho: `Dockerfile`.
- Porta interna do domínio: `3000`, protocolo HTTP.
- Salve e clique em Implantar. Confira o registro da implantação até o build concluir.

O nome `easypanel/fxphub/hozanaamaralestetica:latest` é a imagem esperada pelo serviço. Quando ela não existe, consulte os registros de build: os registros de execução não mostram a causa de uma falha de construção.

O Dockerfile precisa estar enviado ao GitHub antes da implantação. O build usa Node 24 e inclui as imagens otimizadas em `dist/assets`. Não exige npm install, pois o projeto não possui dependências externas.

Teste local com Docker: `docker build -t hosana-amaral .` e `docker run --rm -p 3000:3000 hosana-amaral`.
