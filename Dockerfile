FROM node:18-alpine AS dev-deps
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Etapa 3: Imagen de producción
FROM node:18-alpine AS production
WORKDIR /app

# Copiamos solo lo necesario
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3080

# Comando para iniciar la app
CMD ["node", "dist/main.js"]