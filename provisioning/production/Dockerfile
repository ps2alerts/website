FROM maelstromeous/applications:ps2alerts-website-base

USER root
COPY ./provisioning/production/files/nginx/production.conf /etc/nginx/conf.d
COPY --chown=node:node . /app

USER node
RUN cd /app && npm ci && npm run build && npm prune --production
