FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN mkdir -p /app/dist/slots/grpc && cp -r /app/src/grpc/*.proto /app/dist/slots/grpc/

EXPOSE 3002

CMD ["node", "dist/main.js"]