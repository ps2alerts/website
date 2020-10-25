FROM ps2alerts/website:base

USER root
RUN npm install -g @vue/cli serve

USER node
COPY ./entrypoint.sh /usr/sbin/entrypoint.sh