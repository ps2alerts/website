FROM maelstromeous/applications:ps2alerts-website-base
USER root
COPY ./provisioning/staging/files/nginx/staging.conf /etc/nginx/conf.d
COPY --chown=node:node . /app

ENV NODE_ENV="production"
ENV VERSION="v3.0.0-alpha"
ENV BUILD="abc12345"
ENV API_HOST="https://api.ps2alerts.com"

USER node
RUN cd /app && npm ci && npm run generate && npm prune --production
