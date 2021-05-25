FROM node:16-slim AS build
WORKDIR /app

COPY package* /app/
RUN --mount=type=secret,id=npmrc,dst=/app/.npmrc --mount=type=cache,target=~/.npm npm ci

COPY . .

ENV NODE_ENV=development
CMD ["npm", "run", "start"]
