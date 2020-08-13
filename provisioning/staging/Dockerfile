FROM maelstromeous/applications:ps2alerts-websocket-base

USER nginx

COPY --chown=nginx:nginx ./public /var/www/html

# Nothing for now, this will eventually have builds in etc
RUN cd /app
