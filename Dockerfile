FROM node:12.18.3

RUN mkdir -p /usr/src/nuxt-frontend
WORKDIR /usr/src/nuxt-frontend
COPY . .

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

ENV NUXT_ENV_PROXY_URL=http://localhost:8081
ENV NUXT_ENV_ZENDESK_KEY=5o67kZfbLoMX5AFZ4QctJi2cIF9ivSYP

RUN npm install && npm run build:docker

EXPOSE 3000

CMD [ "npm", "start:docker" ]