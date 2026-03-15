FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_BOOKING_REMOTE_URL
ARG VITE_WEB_GATEWAY_API

ENV VITE_BOOKING_REMOTE_URL=$VITE_BOOKING_REMOTE_URL
ENV VITE_WEB_GATEWAY_API=$VITE_WEB_GATEWAY_API

COPY package*.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm install
RUN npm run build --workspace=shell

FROM nginx:alpine

COPY --from=build /app/apps/shell/dist /usr/share/nginx/html

EXPOSE 80