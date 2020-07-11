FROM ps2alerts/website:base

USER root

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        watch \
        git \
    && mkdir /var/www/.npm /var/www/.config \
    && chown -R www-data: /var/www/.npm /var/www/.config \
    && rm -rf /var/lib/apt/lists/* /var/cache/apk/*

COPY ./files/nginx /etc/nginx/conf.d
COPY ./files/php /usr/local/etc/php/conf.d
COPY ./files/php-fpm /usr/local/etc/php-fpm.d

USER www-data
