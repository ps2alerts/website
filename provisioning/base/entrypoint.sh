#!/bin/sh

echo "=============== STARTING WEBSITE SERVICES ==================="
sudo -E -S -u root runsvdir -P /etc/service
