FROM node:14.4.0
USER root
WORKDIR /backend
COPY . /backend
RUN yarn
RUN yarn build
CMD [ "node", "./dist/index.js" ]