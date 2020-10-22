FROM node:12

USER root

RUN npm install -g @vue/cli serve

# Run services
COPY ./entrypoint.sh /etc/service/entrypoint.sh

USER node

ENTRYPOINT /etc/service/entrypoint.sh
