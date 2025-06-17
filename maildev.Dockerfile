FROM node:20.19.2-alpine

RUN npm i -g maildev@2.1.0

CMD maildev
