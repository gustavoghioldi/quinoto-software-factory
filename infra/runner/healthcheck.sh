#!/usr/bin/env sh
set -eu

node -e "fetch('http://127.0.0.1:4096/').then(() => process.exit(0)).catch(() => process.exit(1))"
