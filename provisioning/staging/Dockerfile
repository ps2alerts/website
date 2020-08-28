FROM maelstromeous/applications:ps2alerts-website-base

COPY provisioning/staging/files/nginx/staging.conf /etc/nginx/conf.d
#COPY provisioning/staging/files/entrypoint.sh /etc/service/entrypoint.sh

USER www-data

COPY --chown=www-data:www-data ./public /var/www/html

USER root

# Nothing for now, this will eventually have builds in etc