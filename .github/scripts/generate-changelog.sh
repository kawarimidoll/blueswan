#!/usr/bin/env bash
set -euo pipefail

# Usage: generate-changelog.sh <tag-name>
# Generate changelog from diff with previous tag and output to stdout

TAG_NAME="${1:?Usage: generate-changelog.sh <tag-name>}"

PREV_TAG=$(git tag --sort=-creatordate | grep -v "$TAG_NAME" | head -n 1)

for TYPE in feat fix docs style refactor test chore; do
  LOG=$(git log "$PREV_TAG..$TAG_NAME" --pretty=format:"[%s](%h)" --grep="^$TYPE:" | grep -v '^chore(version):' || true)
  if [ -n "$LOG" ]; then
    echo "## $TYPE"
    echo ""
    echo "$LOG" | sed 's/^/- /'
    echo ""
  fi
done

REPO_URL=$(git remote get-url origin | sed 's/\.git$//' | sed 's|git@github.com:|https://github.com/|')
echo "**Full Changelog**: $REPO_URL/compare/$PREV_TAG...$TAG_NAME"
