FROM node:14
USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    runit \
    sudo \
    && rm -rf /var/lib/apt/lists/* /var/cache/apk/*
RUN adduser node sudo && \
    echo '%node ALL=(ALL) NOPASSWD:SETENV:ALL' >> /etc/sudoers
COPY ./files/runit /etc/service
COPY ./files/nginx /etc/nginx/global
COPY ./entrypoint.sh /usr/sbin/entrypoint.sh

USER node
ENTRYPOINT /usr/sbin/entrypoint.sh
