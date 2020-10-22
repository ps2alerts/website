FROM node:12

USER root

RUN npm install -g @vue/cli serve

# Run services
COPY ./entrypoint.sh /usr/sbin/

USER node

ENTRYPOINT /usr/sbin/entrypoint.sh
