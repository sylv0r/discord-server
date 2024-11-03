FROM node:22-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN yarn install --prod --frozen-lockfile

COPY --chown=node:node . .

RUN yarn build

USER node

FROM node:22-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

ENV NODE_ENV production

CMD [ "node", "dist/main.js" ]