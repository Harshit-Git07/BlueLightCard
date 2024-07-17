#!/usr/bin/env bash

# Brands
APP_BRANDS=('blc-uk' 'blc-au' 'dds-uk')

# Script args
PACKAGE_NAME=$1
BRAND_DEPLOYMENTS=$2

if [ "$BRAND_DEPLOYMENTS" = "true" ]
then
  mkdir -p packages/"$PACKAGE_NAME"/.brands/fonts
  cp -r packages/shared-ui/fonts/* packages/"$PACKAGE_NAME"/.brands/fonts

  if [ "$PACKAGE_NAME" = "web" ]
  then
    mkdir -p packages/web/.brands/assets
    cp -r packages/web/assets/* packages/web/.brands/assets
  fi

  for brand in "${APP_BRANDS[@]}"
  do
    mkdir -p packages/"$PACKAGE_NAME"/.brands/"$brand"
    echo "Created brand directory for brand '$brand'"

    NEXT_PUBLIC_APP_BRAND="$brand" STORYBOOK_APP_BRAND="$brand" npm run build-storybook -w packages/"$PACKAGE_NAME"
    echo "Built storybook assets for brand '$brand'"

    cp -r packages/"$PACKAGE_NAME"/storybook-static/* packages/"$PACKAGE_NAME"/.brands/"$brand"
  done
else
  npm run build-storybook -w packages/"$PACKAGE_NAME"
fi