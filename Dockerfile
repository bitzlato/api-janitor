FROM node:14.16.0-alpine3.13
WORKDIR /app
COPY . .
RUN yarn \
    && yarn run build

CMD [ "node", "build/buildReporter.js"]
CMD [ "node", "build/index.js", "--level info", "--port", "8080" ]
