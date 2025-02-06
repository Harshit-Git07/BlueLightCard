#!/bin/bash

set -e

# Environment to build & deploy to e.g preview or production
ENV=$1
# Tag the worker deployment for filtering
TAG=$2
# Name of the worker to deploy changes to
WORKER_NAME=$3

err() {
  echo "$1" >&2
}

build() {
  npm run build:worker
}

upload_version() {
  npm run upload-version:worker -- --tag "$TAG"
}

deploy() {
  npm run deploy:worker
}

# Retrieves the id of the uploaded version and echoes a shorten version of it
get_version_id() {
  local api_response=$(curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/scripts/$WORKER_NAME/versions \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H 'Content-Type: application/json')
  
  if [[ -z "$api_response" ]]; then
    err "API response was empty"
    exit 1
  fi

  if [[ $(echo "$api_response" | jq '.success == false') == true ]]; then
    err "API Response Error: Success status was false, something went wrong"
    exit 1
  fi

  # capture the version id from the response
  local version_id=$(echo "$api_response" | jq --arg tag "$TAG" 'first(.result.items[] | select(.annotations["workers/tag"] == $tag)) | .id')
  
  if [[ -z "$version_id" ]]; then
    err "Failed to get version, latest version not found"
    exit 1
  fi

  # shorten the id to 8 chars
  local short_version_id=${version_id:1:8}

  echo "$short_version_id"
}

# used for capturing the deployment url
DEPLOYMENT_URL=''

case $ENV in
  preview)
    # build and upload the version to the preview worker
    build
    upload_version
    VERSION_ID=$(get_version_id)
    DEPLOYMENT_URL=$(echo "https://$VERSION_ID-$WORKER_NAME.bluelightcard.workers.dev")
    ;;
  staging | production)
    # build and deploy the worker
    build
    deploy
    DEPLOYMENT_URL=$(echo "https://$WORKER_NAME.bluelightcard.workers.dev")
    ;;
  *)
    echo "Usage: $0 {preview | staging | production} {TAG}"
    exit 1
    ;;
esac

if [[ -z "$DEPLOYMENT_URL" ]]; then
  err "Failed to set deployment url"
  exit 1
fi

echo "deployment-url=$DEPLOYMENT_URL" >> $GITHUB_OUTPUT
