FROM node:latest

RUN npm install -g @vue/cli serve

# Run services
COPY ./entrypoint.sh /usr/sbin/
ENTRYPOINT /usr/sbin/entrypoint.sh
