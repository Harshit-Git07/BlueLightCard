#!/bin/bash

#TODO: Create DNS records for dev APIs so we can use this script to automate localhost.
npx wrangler dev --var \
  ENVIRONMENT:localhost \
  AUTH_API_BLC_UK:https://$1-auth.blcshine.io \
  AUTH_API_BLC_AU:https://$1-auth-au.blcshine.io \
  AUTH_API_DDS_UK:https://$1-auth-dds.blcshine.io \
  IDENTITY_API_BLC_UK:https://$1-identity.blcshine.io \
  IDENTITY_API_BLC_AU:https://$1-identity-au.blcshine.io \
  OFFERS_API_BLC_UK:https://$1-offers.blcshine.io \
  OFFERS_API_BLC_AU:https://$1-offers-au.blcshine.io \
  OFFERS_API_DDS_UK:https://$1-offers-dds-uk.blcshine.io \
  OFFERS_CMS_API_BLC_UK:https://$1-offers.blcshine.io \
  OFFERS_CMS_API_BLC_AU:https://$1-offers-au.blcshine.io \
  OFFERS_CMS_API_DDS_UK:https://$1-offers-dds-uk.blcshine.io \
  REDEMPTIONS_API_UK:https://$1-redemptions.blcshine.io \
  DISCOVERY_API_BLC_UK:https://$1-discovery.blcshine.io \
  DISCOVERY_API_BLC_AU:https://$1-discovery-blc-au.blcshine.io \
  DISCOVERY_API_DDS_UK:https://$1-discovery-dds-uk.blcshine.io \

# TODO: Update OFFER_CMS_... values once we have the valid URLS
