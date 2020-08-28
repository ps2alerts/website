FROM maelstromeous/applications:ps2alerts-website-base

USER root

COPY provisioning/staging/files/entrypoint.sh /etc/service/entrypoint.sh
COPY provisioning/staging/files/nginx/staging.conf /etc/nginx/conf.d

COPY ./public /var/www/html

# Nothing for now, this will eventually have builds in etc
RUN cd /var/www/html