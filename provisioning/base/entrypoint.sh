#!/bin/sh

echo "=============== STARTING WEBSITE SERVICES ==================="
sudo --preserve-env=ENVIRONMENT \
  --preserve-env=VERSION \
  --preserve-env=API_URL -u root runsvdir -P /etc/service
