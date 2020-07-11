FROM php:7.4-fpm

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        nginx \
        runit \
        sudo \
        libmcrypt-dev \
        libcurl4-gnutls-dev \
        libmhash-dev \
        libzip-dev \
        python3-pip \
        python3-setuptools \
        wget \
    && apt-get install -y --no-install-recommends \
        nodejs \
    && curl -L https://www.npmjs.com/install.sh | sh \
    && npm install -g \
        bower \
        grunt-cli \
    && rm -rf /var/lib/apt/lists/* /var/cache/apk/* \
    && docker-php-ext-install -j$(nproc) \
        curl \
        json \
        pdo \
        pdo_mysql \
        opcache \
        zip \
    # Configure gd and gmp
    && rm -rf /tmp/pear

# Add www-data to sudoers
RUN adduser www-data sudo \
    && echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Change UID & GID to match users
RUN usermod -u 1000 www-data \
    && groupmod -g 1000 www-data

# Install NPM
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - \
    && mkdir -p /var/www/.npm \
    && chown -R www-data: /var/www/.npm

# Install composer
RUN curl -sS https://getcomposer.org/installer | php
RUN mv composer.phar /usr/local/bin/composer \
    && mkdir -p /var/www/.composer \
    && chown -R www-data: /var/www/.composer

# Run services
COPY ./files/runit /etc/service
COPY ./files/entrypoint.sh /usr/sbin/
ENTRYPOINT /usr/sbin/entrypoint.sh

# Inject config files
COPY ./files/nginx /etc/nginx/global
COPY ./files/php /usr/local/etc/php/conf.d
COPY ./files/php-fpm /usr/local/etc/php-fpm.d

RUN touch /var/log/php-fpm.log \
    && chmod 777 /var/log/php-fpm.log

USER www-data
WORKDIR /var/www/html
