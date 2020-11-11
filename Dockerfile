FROM node:alpine AS builder
WORKDIR /backend
COPY package.json /backend/package.json
RUN yarn
COPY . /backend
RUN yarn codegen
RUN yarn prisma generate
RUN yarn build

FROM node:alpine
WORKDIR /backend
COPY --from=builder /backend/dist /backend
COPY package.json /backend/package.json
RUN yarn install --prod
COPY --from=builder /backend/node_modules/@prisma/client /backend/node_modules/@prisma/client
COPY --from=builder /backend/node_modules/.prisma/client/ /backend/node_modules/.prisma/client/
COPY --from=builder /backend/prisma /backend/prisma
USER node
CMD [ "node", "./index.js" ]
