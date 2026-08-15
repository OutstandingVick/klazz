#!/bin/sh
set -eu

token="${HYDRADB_TOKEN:-local-development-token-32-bytes}"
mkdir -p /data/store /data/cache
printf '%s\n' "$token" > /data/auth-token
exec /usr/local/bin/graph-node
