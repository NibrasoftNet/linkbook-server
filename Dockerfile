###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:20.0.0-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node ./package*.json ./

RUN ls /usr/src/app
RUN npm ci --legacy-peer-deps

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:20.0.0-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node ./package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node ../ .

RUN npm i -g @nestjs/cli

RUN npm run build

ENV NODE_ENV production

RUN npm ci --legacy-peer-deps --only=production && npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:20.0.0-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
