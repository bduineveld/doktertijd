#!/usr/bin/env bash
# Bouwt de statische site en zet hem op doktertijd.dokterbart.nl (Bitnami/Apache op amazon-eu5).
# Gebruik: ./deploy.sh   (vereist de ssh-host "amazon-eu5" in ~/.ssh/config)
set -euo pipefail
cd "$(dirname "$0")"

HOST=amazon-eu5
REMOTE_DIR=/opt/bitnami/apps/doktertijd
TARBALL=$(mktemp -t doktertijd-XXXXXX.tar.gz)
trap 'rm -f "$TARBALL"' EXIT

echo "==> Bouwen (statisch, prerendered)"
npm run build:static

echo "==> Inpakken"
# --force-local is alleen nodig (en bekend) bij GNU tar op Windows; macOS-tar kent het niet.
TAR_OPTS=""
if tar --version 2>/dev/null | grep -q "GNU tar"; then TAR_OPTS="--force-local"; fi
# COPYFILE_DISABLE voorkomt dat macOS ._-bestanden meepakt.
COPYFILE_DISABLE=1 tar $TAR_OPTS -czf "$TARBALL" -C dist/client .

echo "==> Uploaden naar $HOST:$REMOTE_DIR"
scp -q "$TARBALL" "$HOST:/tmp/doktertijd-dist.tar.gz"
ssh "$HOST" "set -e
  mkdir -p $REMOTE_DIR.new
  tar -xzf /tmp/doktertijd-dist.tar.gz -C $REMOTE_DIR.new
  rm -f /tmp/doktertijd-dist.tar.gz
  rm -rf $REMOTE_DIR.old
  [ -d $REMOTE_DIR ] && mv $REMOTE_DIR $REMOTE_DIR.old
  mv $REMOTE_DIR.new $REMOTE_DIR
  rm -rf $REMOTE_DIR.old"

echo "==> Controle"
status=$(curl -s -o /dev/null -w "%{http_code}" https://doktertijd.dokterbart.nl/)
echo "https://doktertijd.dokterbart.nl/ -> $status"
