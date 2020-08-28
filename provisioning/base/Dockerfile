FROM nginx:latest

USER root

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        runit \
        sudo \
    && rm -rf /var/lib/apt/lists/* /var/cache/apk/*

# Add www-data to sudoers so it can execute services
RUN usermod -a -G sudo www-data

# Run services
COPY ./files/runit /etc/service
COPY ./files/entrypoint.sh /usr/sbin/
ENTRYPOINT /usr/sbin/entrypoint.sh

# Inject config files
COPY ./files/nginx /etc/nginx/global

USER www-data