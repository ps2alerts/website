FROM maelstromeous/applications:ps2alerts-website-base
USER root
COPY ./provisioning/staging/files/nginx/staging.conf /etc/nginx/conf.d
COPY --chown=node:node . /app

ARG BUILD_SHA="abc12345"

ENV NODE_ENV="staging"
ENV VERSION="v3.0.0-alpha"
ENV BUILD=$BUILD_SHA
ENV API_HOST="https://staging.api.ps2alerts.com"

USER node
RUN cd /app && npm ci --also=dev && npm run generate && npm prune --production
