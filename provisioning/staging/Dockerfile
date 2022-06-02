FROM maelstromeous/applications:ps2alerts-website-base
USER root
COPY ./provisioning/staging/files/nginx/staging.conf /etc/nginx/conf.d
COPY --chown=node:node . /app

ARG BUILD_SHA="abc12345"
ARG BUILT="1970-01-01 00:00:00"
ARG VERSION="v4.0.0"

ENV BUILT="$BUILT"
ENV ENV="staging"
ENV VERSION="$VERSION"
ENV BUILD="$BUILD_SHA"
ENV BASE_URL="https://staging.ps2alerts.com"
ENV API_HOST="https://api.ps2alerts.com"
ENV GOOGLE_PROPERTY="G-FJDCBTJV5D"

USER node
RUN cd /app && yarn install && yarn run generate
