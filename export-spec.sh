#!/bin/bash

while [[ "$#" -gt 0 ]]
  do
    case $1 in
      -s|--stage) Stage="$2"; shift;;
      -r|--region) Region="$2"; shift;;
      -d|--domain) Domain="$2"; shift;;
      -av|--api-version) APIVersion="$2"; shift;;      
    esac
    shift
done

node ./swagger.mjs $Stage

REDOCLY_AUTHORIZATION=$REDOCLY_AUTHORIZATION npx @redocly/cli push swagger.json --destination="$Stage.$Domain@$APIVersion" --organization="blc-jgk"

