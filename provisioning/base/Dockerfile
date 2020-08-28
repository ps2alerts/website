FROM node:latest

USER root

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        runit \
        nginx \
        sudo \
    && rm -rf /var/lib/apt/lists/* /var/cache/apk/*

# Add www-data to sudoers so it can execute services
RUN usermod -a -G sudo node

# Run services
COPY ./files/runit /etc/service
COPY ./files/entrypoint.sh /usr/sbin/
ENTRYPOINT /usr/sbin/entrypoint.sh

# Inject config files
COPY ./files/nginx /etc/nginx/global

# Ensure web dir is correct
RUN mkdir -p /var/www/html && chown -R www-data: /var/www