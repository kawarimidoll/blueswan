#!/usr/bin/env bash
set -euo pipefail

# Usage: publish-chrome.sh <zip-path>
# Upload and publish a Chrome extension to the Chrome Web Store.
#
# Required environment variables:
#   CHROME_CLIENT_ID     - Google OAuth2 client ID
#   CHROME_CLIENT_SECRET - Google OAuth2 client secret
#   CHROME_REFRESH_TOKEN - Google OAuth2 refresh token

EXTENSION_ID="cnenmkcimleaeklmeflfnejicbhndlko"
ZIP_PATH="${1:?Usage: publish-chrome.sh <zip-path>}"

if [[ ! -f "$ZIP_PATH" ]]; then
  echo "Error: $ZIP_PATH not found" >&2
  exit 1
fi

echo "Requesting access token..."
ACCESS_TOKEN=$(curl -sf -X POST https://oauth2.googleapis.com/token \
  -d "client_id=$CHROME_CLIENT_ID" \
  -d "client_secret=$CHROME_CLIENT_SECRET" \
  -d "refresh_token=$CHROME_REFRESH_TOKEN" \
  -d "grant_type=refresh_token" \
  | jq -r '.access_token')

if [[ -z "$ACCESS_TOKEN" || "$ACCESS_TOKEN" == "null" ]]; then
  echo "Error: failed to obtain access token" >&2
  exit 1
fi

echo "Uploading $ZIP_PATH..."
UPLOAD_RESULT=$(curl -sf -X PUT \
  "https://www.googleapis.com/upload/chromewebstore/v1.1/items/$EXTENSION_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "x-goog-api-version: 2" \
  -T "$ZIP_PATH")

UPLOAD_STATUS=$(echo "$UPLOAD_RESULT" | jq -r '.uploadState')
if [[ "$UPLOAD_STATUS" != "SUCCESS" ]]; then
  echo "Error: upload failed" >&2
  echo "$UPLOAD_RESULT" | jq . >&2
  exit 1
fi
echo "Upload succeeded."

echo "Publishing..."
PUBLISH_RESULT=$(curl -sf -X POST \
  "https://www.googleapis.com/chromewebstore/v1.1/items/$EXTENSION_ID/publish" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "x-goog-api-version: 2")

PUBLISH_STATUS=$(echo "$PUBLISH_RESULT" | jq -r '.status[0]')
if [[ "$PUBLISH_STATUS" != "OK" && "$PUBLISH_STATUS" != "PUBLISHED_WITH_FRICTION_WARNING" ]]; then
  echo "Error: publish failed" >&2
  echo "$PUBLISH_RESULT" | jq . >&2
  exit 1
fi
echo "Publish succeeded: $PUBLISH_STATUS"
