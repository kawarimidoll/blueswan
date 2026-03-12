#!/usr/bin/env bash
set -euo pipefail

# Usage: publish-firefox.sh <zip-path>
# Submit a Firefox extension to AMO for review using web-ext.
#
# Required environment variables:
#   AMO_JWT_ISSUER - AMO API key (JWT issuer)
#   AMO_JWT_SECRET - AMO API secret (JWT secret)

ZIP_PATH="${1:?Usage: publish-firefox.sh <zip-path>}"

if [[ ! -f "$ZIP_PATH" ]]; then
  echo "Error: $ZIP_PATH not found" >&2
  exit 1
fi

WORK_DIR="source-dir"
mkdir "$WORK_DIR"
unzip -q "$ZIP_PATH" -d "$WORK_DIR"

echo "Submitting to AMO..."
# web-ext sign exits with non-zero for listed extensions
# (submitted for review, not signed immediately). This is expected.
npx web-ext sign \
  --source-dir "$WORK_DIR" \
  --channel listed \
  --api-key "$AMO_JWT_ISSUER" \
  --api-secret "$AMO_JWT_SECRET" || {
  EXIT_CODE=$?
  if [[ $EXIT_CODE -eq 1 ]]; then
    echo "Extension submitted for review (expected for listed channel)."
    exit 0
  fi
  exit $EXIT_CODE
}
echo "Submission complete."
