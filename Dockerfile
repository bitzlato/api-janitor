FROM node:14.16.0-alpine3.13
WORKDIR /app
COPY . .
RUN yarn \
    && yarn build \
    && node build/buildReporter.js

CMD [ "node", "build/index.js", "--level info", "--port", "8080" ]
