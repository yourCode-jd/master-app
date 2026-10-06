#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
data_dir="$project_root/.postgres-data"
socket_dir="/tmp/gym-intelligence-pg-socket"
pg_ctl="/usr/lib/postgresql/18/bin/pg_ctl"

if [[ ! -x "$pg_ctl" || ! -d "$data_dir" ]]; then
  echo "Local PostgreSQL 18 data directory is unavailable. See README.md for setup."
  exit 1
fi

mkdir -p "$socket_dir"
if "$pg_ctl" -D "$data_dir" status >/dev/null 2>&1; then
  echo "Gym Intelligence PostgreSQL is already running on port 5434."
else
  "$pg_ctl" -D "$data_dir" \
    -o "-p 5434 -h 127.0.0.1 -k $socket_dir" \
    -l /tmp/gym-intelligence-postgres.log start
fi
