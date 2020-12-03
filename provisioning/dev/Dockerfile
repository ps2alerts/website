FROM ps2alerts/website:base

USER root

ENV TERM xterm
ENV ZSH_THEME agnoster

RUN wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh || true

USER node
COPY ./entrypoint.sh /usr/sbin/entrypoint.sh
