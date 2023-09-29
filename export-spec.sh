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

API_ID=$(aws apigateway get-rest-apis --region $Region --query 'items[?name==`'$Stage'-blc-mono-'$Domain'`].[id]' --output text)

aws apigateway get-export --parameters extensions='apigateway' --rest-api-id $API_ID --stage-name v1 --export-type swagger swagger.json --region $Region

REDOCLY_AUTHORIZATION=$REDOCLY_AUTHORIZATION npx @redocly/cli@latest push swagger.json --destination="$Domain@$APIVersion" --organization="blc-jgk"

