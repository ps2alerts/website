FROM maelstromeous/applications:ps2alerts-website-base

COPY provisioning/production/files/nginx/production.conf /etc/nginx/conf.d
#COPY provisioning/production/files/entrypoint.sh /etc/service/entrypoint.sh

USER www-data

COPY --chown=www-data:www-data ./public /var/www/html/public

USER root

# Nothing for now, this will eventually have builds in etc