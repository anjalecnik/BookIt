FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN mkdir -p /app/dist/grpc && cp -r /app/src/grpc/*.proto /app/dist/grpc/

EXPOSE 3001

CMD ["node", "dist/main.js"]