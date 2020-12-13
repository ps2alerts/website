FROM maelstromeous/applications:ps2alerts-website-base
USER root
COPY ./provisioning/production/files/nginx/production.conf /etc/nginx/conf.d
COPY --chown=node:node . /app

ARG BUILD_SHA="abc12345"

ENV NODE_ENV="production"
ENV VERSION="v3.0.0-alpha"
ENV BUILD="abc12345"
ENV BASE_URL="https://ps2alerts.com"
ENV API_HOST="https://api.ps2alerts.com"
ENV GOOGLE_PROPERTY="G-2X0XQFEBLT"

USER node
RUN cd /app && npm ci --also=dev && npm run generate && npm prune --production
