FROM maelstromeous/applications:ps2alerts-website-base

USER root

RUN echo $GITHUB_WORKSPACE
RUN pwd
RUN cd $GITHUB_WORKSPACE
RUN ls -lah

COPY $GITHUB_WORKSPACE/provisioning/staging/entrypoint.sh /usr/sbin/entrypoint.sh

USER node

COPY --chown=node:node . /app

RUN cd /app && npm ci && npm run build && npm prune --production
