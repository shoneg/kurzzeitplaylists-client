FROM node:lts-alpine
ENV PORT=3000
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock", "./"]
RUN corepack enable \
  && yarn install --silent --non-interactive
COPY . .
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
