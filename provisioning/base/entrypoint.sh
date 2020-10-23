#!/bin/sh

echo "=============== STARTING WEBSITE SERVICES ==================="
sudo -e -u root runsvdir -P /etc/service
