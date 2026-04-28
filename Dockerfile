# Builder
FROM node:20-slim AS builder
RUN apt-get update && apt-get install -y libc6 libstdc++6 && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY data/ ./data/
COPY . .
RUN npx tsc

FROM node:20-slim
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Re-install runtime dependencies if needed
RUN apt-get update && apt-get install -y libc6 libstdc++6 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/swagger.yml ./swagger.yml
COPY --from=builder /usr/src/app/data ./data

COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]