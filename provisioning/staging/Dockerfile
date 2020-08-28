FROM maelstromeous/applications:ps2alerts-website-base

RUN cd $GITHUB_WORKSPACE && pwd && ls -lah

USER root

RUN cd $GITHUB_WORKSPACE && pwd && ls -lah

COPY provisioning/staging/files/nginx/staging.conf /etc/nginx/conf.d
COPY provisioning/staging/files/entrypoint.sh /etc/service/entrypoint.sh

USER www-data

COPY ./public /var/www/html

RUN ls -lah /var/www/html

# Nothing for now, this will eventually have builds in etc
RUN cd /var/www/html