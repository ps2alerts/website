FROM maelstromeous/applications:ps2alerts-website-base
ARG SHA=12345
USER root
COPY ./provisioning/staging/files/nginx/staging.conf /etc/nginx/conf.d
COPY --chown=node:node . /app
RUN sed -i 's/12345/$SHA' /app/.env

USER node
RUN cd /app && npm ci && npm run build:staging && npm prune --production
