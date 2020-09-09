FROM stayfunfrontend.azurecr.io/node

RUN mkdir -p /usr/src/nuxt-frontend
WORKDIR /usr/src/nuxt-frontend
COPY . .

RUN npm install --production && npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]
