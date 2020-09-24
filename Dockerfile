

FROM node:14.9.0-alpine as build
WORKDIR /src
COPY . /src

RUN npm install
RUN npm run build

FROM node:14.9.0 as runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
COPY ormconfig.js ./
COPY .env ./
COPY .env.example ./
COPY --from=build /src/dist .
COPY --from=build /src/node_modules ./node_modules
RUN npm prune --production
EXPOSE 4000

ENTRYPOINT node -r module-alias/register index.js
