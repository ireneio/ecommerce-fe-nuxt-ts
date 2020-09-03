FROM node:12.18.3

RUN mkdir -p /usr/src/nuxt-frontend
WORKDIR /usr/src/nuxt-frontend
COPY . .

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

ENV API_KEY=20160918723789416akzuYTRVHCSXISDLjss
ENV API_URL=http://localhost:8081
ENV PROXY_URL=http://localhost:8081

RUN npm install && npm run build

EXPOSE 3000

CMD [ "npm", "start" ]