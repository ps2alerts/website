FROM maelstromeous/applications:ps2alerts-website-base

USER root

RUN env
COPY provisioning/staging/entrypoint.sh /etc/service/entrypoint.sh

USER node

COPY --chown=node:node . /app

RUN cd /app && npm ci && npm run build && npm prune --production
