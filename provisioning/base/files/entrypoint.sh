#!/bin/sh

echo "=============== STARTING SERVICES ==================="
sudo --preserve-env -u root runsvdir -P /etc/service