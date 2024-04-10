#!/usr/bin/env bash

FONTAWESOME_MODULES="@fortawesome.zip"
NODE_MODULES="node_modules"

if [[ ! -d "$NODE_MODULES" ]]; then
  mkdir node_modules
fi

echo "Extracting font awesome modules zip"

unzip -q -o -d "$NODE_MODULES" "$FONTAWESOME_MODULES"
