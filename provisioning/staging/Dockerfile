FROM maelstromeous/applications:ps2alerts-website-base

COPY ./public /var/www/html
COPY provisioning/staging/files/nginx /etc/nginx/conf.d

# Nothing for now, this will eventually have builds in etc
RUN cd /var/www/html
