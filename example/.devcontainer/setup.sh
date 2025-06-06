#!/bin/bash
# This script sets port 8030 to public in GitHub Codespaces to handle preflight request issues.
# @see https://github.com/community/community/discussions/15351

set -euo pipefail

PORT=8030

if [[ -n "${CODESPACE_NAME:-}" ]]; then
    echo "Setting port $PORT to public in Codespace: $CODESPACE_NAME"
    gh codespace ports visibility "$PORT:public" -c "$CODESPACE_NAME"
else
    echo "Not running in a Codespace, skipping port visibility change."
fi
