FROM maelstromeous/applications:ps2alerts-website-base

USER root

RUN ls -lah /home/

COPY provisioning/staging/files/nginx/staging.conf /etc/nginx/conf.d
COPY provisioning/staging/files/entrypoint.sh /etc/service/entrypoint.sh

COPY ./public /var/www/html

RUN ls -lah /var/www/html

# Nothing for now, this will eventually have builds in etc
RUN cd /var/www/html