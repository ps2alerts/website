FROM maelstromeous/applications:ps2alerts-website-base

RUN pwd
RUN ls -lah .
RUN ls -lah provisioning/staging

USER root

COPY provisioning/staging/entrypoint.sh /usr/sbin/entrypoint.sh

USER node

COPY --chown=node:node . /app

RUN cd /app && npm ci && npm run build && npm prune --production
