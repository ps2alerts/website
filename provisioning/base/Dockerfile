FROM nginx:latest

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        runit \
        sudo \
    && rm -rf /var/lib/apt/lists/* /var/cache/apk/*

# Run services
COPY ./files/runit /etc/service
COPY ./files/entrypoint.sh /usr/sbin/
ENTRYPOINT /usr/sbin/entrypoint.sh

# Inject config files
COPY ./files/nginx /etc/nginx/global
