FROM maelstromeous/applications:ps2alerts-website-base

RUN env
RUN ls -lah
RUN pwd

COPY ./provisioning/staging/entrypoint.sh /etc/service/entrypoint.sh

COPY --chown=node:node . /app

RUN cd /app && npm ci && npm run build && npm prune --production
