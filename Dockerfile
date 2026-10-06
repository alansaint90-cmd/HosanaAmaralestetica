FROM node:24-alpine AS build
WORKDIR /app
COPY package.json ./
COPY scripts ./scripts
COPY src ./src
COPY dist/assets ./dist/assets
RUN node scripts/build.mjs

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/scripts/serve.mjs ./scripts/serve.mjs
USER node
EXPOSE 3000
CMD ["node", "scripts/serve.mjs"]
