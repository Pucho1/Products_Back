FROM node:18-alpine AS dev-deps
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM nginx:1.23.3 AS prod

EXPOSE 8080

COPY --from=builder /app/dist /usr/share/nginx/html

# RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/default.conf.template /etc/nginx/templates/

CMD ["nginx", "-g", "daemon off;"]