FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock", "./"]
RUN corepack enable \
  && yarn install --silent --non-interactive
COPY . .
RUN yarn build

FROM nginx:1.27-alpine
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.d/ /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/*.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
