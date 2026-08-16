FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

# Build tools needed to compile native modules (bcrypt) on Alpine/musl
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
