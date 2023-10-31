FROM node:18-alpine
WORKDIR /usr/app
ADD package* ./
RUN npm ci
ADD . .
RUN npm run build
CMD [ "/usr/local/bin/node", "/usr/app/dist/index.js" ]