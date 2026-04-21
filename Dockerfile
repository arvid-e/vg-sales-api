# Build Stage
FROM node:20-slim AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx tsc

# Run Stage
FROM node:20-slim
RUN apk add --no-cache curl

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist
COPY data ./data
COPY --from=builder /usr/src/app/swagger.yml ./swagger.yml

EXPOSE 3000

CMD ["sh", "-c", "node dist/server/config/seed-db.js && node dist/index.js"]