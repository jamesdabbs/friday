FROM node:16-slim AS builder
WORKDIR /app

RUN npm install -g npm

COPY package* ./
RUN --mount=type=secret,id=npmrc,dst=/app/.npmrc --mount=type=cache,target=~/.npm npm ci

COPY . .

ENV NODE_ENV=development
CMD ["npm", "run", "start:dev"]
