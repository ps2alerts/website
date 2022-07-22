#!/bin/sh
echo "=============== STARTING WEBSITE SERVICES ==================="
sudo -E -u root runsvdir -P /etc/service
