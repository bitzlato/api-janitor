FROM node:14.16.0-alpine3.13
WORKDIR /app
COPY . .
RUN yarn \
    && yarn run build
CMD [ "node", "build/index.js", "--debug", "--port", "8080" ]