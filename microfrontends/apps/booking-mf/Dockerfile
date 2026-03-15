FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_WEB_GATEWAY_API
ENV VITE_WEB_GATEWAY_API=$VITE_WEB_GATEWAY_API

COPY package*.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm install
RUN npm run build --workspace=booking-mf

FROM nginx:alpine

COPY --from=build /app/apps/booking-mf/dist /usr/share/nginx/html

EXPOSE 80