FROM node:12
USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    runit \
    sudo \
    && rm -rf /var/lib/apt/lists/* /var/cache/apk/* \
    && npm install -g @vue/cli
RUN adduser node sudo && \
    echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
COPY ./files/runit /etc/service
COPY ./files/nginx /etc/nginx/global
COPY ./entrypoint.sh /usr/sbin/entrypoint.sh

USER node
ENTRYPOINT /usr/sbin/entrypoint.sh
