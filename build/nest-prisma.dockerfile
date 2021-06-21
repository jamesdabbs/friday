FROM node:16-slim AS builder
WORKDIR /app

RUN apt-get -qq update && \
  apt-get -yqq --no-install-recommends install libssl-dev && \
  rm -rf /var/lib/apt/lists/*

RUN npm install -g npm

COPY package* ./
RUN --mount=type=secret,id=npmrc,dst=/app/.npmrc --mount=type=cache,target=~/.npm npm ci

COPY prisma prisma/
RUN npx prisma generate

COPY . .

ENV NODE_ENV=development
CMD ["npm", "run", "start:dev"]
