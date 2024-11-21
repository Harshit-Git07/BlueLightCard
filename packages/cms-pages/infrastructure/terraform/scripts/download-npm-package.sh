#!/bin/bash
# Download a npm package from GitHub Package Registry
set -e
echoerr() { echo "$@" 1>&2; }
echo $1
# Parse input
# eval "$(jq -r '@sh "ORG=\(.org) PACKAGE_TOKEN=\(.package_token) PACKAGE_NAME=\(.package_name) PACKAGE_VERSION=\(.package_version)"' <<<$1)" || 0
eval "$(jq -r $1 '@sh "ORG=\(.org) PACKAGE_TOKEN=\(.package_token) PACKAGE_NAME=\(.package_name) PACKAGE_VERSION=\(.package_version)"')" || 0

# Check for required variables
REQUIRED_VARS=("PACKAGE_TOKEN" "PACKAGE_NAME")

for I in "${!REQUIRED_VARS[@]}"; do
	if [ -z ${!REQUIRED_VARS[$I]+x} ]; then
		echoerr "${REQUIRED_VARS[$I]} is a required environment variable"
		exit 1
	fi
done

TOKEN="${PACKAGE_TOKEN}"

# Check for optional/defaulted variables
if [ -z $ORG ]; then
	echoerr "Optional var ORG not provided, using default 'bluelightcard'"
	ORG="bluelightcard"
fi

if [ -z $PACKAGE_VERSION ]; then
	echoerr "Optional var PACKAGE_VERSION not provided, using default 'latest'"
	PACKAGE_VERSION="latest"
fi

echoerr "ORG             = $ORG"
echoerr "PACKAGE_NAME    = $PACKAGE_NAME"
echoerr "PACKAGE_VERSION = $PACKAGE_VERSION"

# Get package meta data
META_DATA=$(curl -H "Authorization: token $PACKAGE_TOKEN" -Ls https://npm.pkg.github.com/@$ORG/$PACKAGE_NAME)
echoerr
echoerr "META_DATA       = $META_DATA"
echoerr
# Resolve 'latest' to semver
if [[ $PACKAGE_VERSION == "latest" ]]; then
	PACKAGE_VERSION=$(jq -r '."dist-tags".latest' <<<$META_DATA)

	echoerr "LATEST          = $PACKAGE_VERSION"
fi

# Extract tarball URL from meta data
TARBALL_URL=$(jq --arg VERSION $PACKAGE_VERSION -r '.versions[$VERSION].dist.tarball' <<<$META_DATA)

echoerr "TARBALL_URL     = $TARBALL_URL"
echoerr

# Create temp directory
TEMP_DIR=$(mktemp -d)

# Download tarball
echoerr "Downloading tarball"
TARBALL_NAME="$TEMP_DIR/$PACKAGE_NAME-$PACKAGE_VERSION.tgz"
curl -s -H "Authorization: token $PACKAGE_TOKEN" -L -o $TARBALL_NAME $TARBALL_URL
echoerr "Tarball saved as $TARBALL_NAME"
echoerr

# Extract tarball
PACKAGE_PATH="$PACKAGE_NAME-$PACKAGE_VERSION"
echoerr "Extracting tarball to $PACKAGE_PATH"
(cd $TEMP_DIR && tar -xf $TARBALL_NAME)
mkdir -p $PACKAGE_PATH
mv $TEMP_DIR/package/dist/*.zip $PACKAGE_PATH
ls -la $PACKAGE_PATH 1>&2
echoerr

# Clean up
echoerr "Cleaning up"
rm -rf package $TEMP_DIR/$TARBALL_NAME
echoerr

# Output temp file path
jq -n --arg directory "$PACKAGE_PATH" '{"directory":$directory}'
echoerr
