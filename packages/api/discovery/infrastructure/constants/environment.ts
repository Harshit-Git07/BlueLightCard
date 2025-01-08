export enum DiscoveryStackEnvironmentKeys {
  // Lambda scripts integration
  SKIP_DISCOVERY_STACK = 'SKIP_DISCOVERY_STACK',
  SEARCH_LAMBDA_SCRIPTS_HOST = 'SEARCH_LAMBDA_SCRIPTS_HOST',
  SEARCH_LAMBDA_SCRIPTS_ENVIRONMENT = 'SEARCH_LAMBDA_SCRIPTS_ENVIRONMENT',
  SEARCH_BRAND = 'SEARCH_BRAND',
  DWH_FIREHOSE_SEARCH_REQUESTS_STREAM_NAME = 'DWH_FIREHOSE_SEARCH_REQUESTS_STREAM_NAME',
  SEARCH_AUTH_TOKEN_OVERRIDE = 'SEARCH_AUTH_TOKEN_OVERRIDE',
  MENUS_TABLE_NAME = 'MENUS_TABLE_NAME',
  // CORS
  API_DEFAULT_ALLOWED_ORIGINS = 'API_DEFAULT_ALLOWED_ORIGINS',
  // OPEN SEARCH
  OPENSEARCH_DOMAIN_ENDPOINT = 'OPENSEARCH_DOMAIN_ENDPOINT',
  // Search
  SEARCH_ENDPOINT = 'SEARCH_ENDPOINT',
  MENU_ENDPOINT = 'MENU_ENDPOINT',
  SEARCH_OFFER_COMPANY_TABLE_NAME = 'SEARCH_OFFER_COMPANY_TABLE_NAME',
  REGION = 'REGION',
  SERVICE = 'SERVICE',
  STAGE = 'STAGE',
}

export const ENDPOINTS = {
  SEARCH: process.env[DiscoveryStackEnvironmentKeys.SEARCH_ENDPOINT],
  MENU: process.env[DiscoveryStackEnvironmentKeys.MENU_ENDPOINT],
};
