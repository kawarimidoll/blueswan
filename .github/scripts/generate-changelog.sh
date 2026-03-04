#!/usr/bin/env bash
set -euo pipefail

# Usage: generate-changelog.sh [base-ref] [new-tag]
# Generate changelog from commits between base-ref and HEAD
# - base-ref: starting point for log range (default: latest tag)
# - new-tag: tag name for Full Changelog link (default: HEAD)

BASE_REF="${1:-$(git tag --sort=-creatordate | head -n 1)}"
NEW_TAG="${2:-HEAD}"

for TYPE in feat fix docs style refactor test chore; do
  LOG=$(git log "$BASE_REF..HEAD" --pretty=format:"[%s](%h)" --grep="^$TYPE:" | grep -vF '[chore(version):' || true)
  if [ -n "$LOG" ]; then
    echo "## $TYPE"
    echo ""
    echo "$LOG" | sed 's/^/- /'
    echo ""
  fi
done

REPO_URL=$(git remote get-url origin | sed 's/\.git$//' | sed 's|git@github.com:|https://github.com/|')
echo "**Full Changelog**: $REPO_URL/compare/$BASE_REF...$NEW_TAG"
