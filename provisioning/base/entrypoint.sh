#!/bin/sh

echo "=============== STARTING WEBSITE SERVICES ==================="
sudo --preserve-env root runsvdir -P /etc/service
