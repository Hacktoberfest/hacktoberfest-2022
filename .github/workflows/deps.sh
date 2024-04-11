#!/bin/bash

set -e -o pipefail

# Validate correct args
if [ "$#" -lt 2 ]; then
  echo "Expected args: <type> <command> [args...]"
  echo "         E.g.: major npm-check-updates latest"
  exit 1
fi

# Extract the args
TYPE=$1
COMMAND=$2
shift 2

# Create a temp file to store the script output
TEMP_FILE=$(mktemp)
# shellcheck disable=SC2064
trap "rm -f $TEMP_FILE" EXIT INT QUIT TERM

# Add the commit message to the temp file
printf '%s\n\n' "Update dependencies ($TYPE)" > "$TEMP_FILE"

# Call the command, sending the output to the temp file and stdout
"$COMMAND" "$@" | tee -a "$TEMP_FILE"

# If there are any changes to dependencies, commit them
git add package.json package-lock.json
if [[ -n $(git diff --staged --name-only) ]]; then
  git commit -F "$TEMP_FILE"

  # If we're on GitHub Actions, report that we committed
  if [[ -n "$GITHUB_OUTPUT" ]]; then
    echo "committed=true" >> "$GITHUB_OUTPUT"
  fi
fi
