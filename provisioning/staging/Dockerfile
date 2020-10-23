FROM maelstromeous/applications:ps2alerts-website-base
USER root
COPY ./provisioning/staging/entrypoint.sh /etc/service/entrypoint.sh
COPY --chown=node:node . /app
USER node
RUN cd /app && npm ci && npm run build && npm prune --production
