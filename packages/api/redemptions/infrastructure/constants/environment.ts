export enum RedemptionsStackEnvironmentKeys {
  // Database
  REDEMPTIONS_DATABASE_HOST = 'REDEMPTIONS_DATABASE_HOST',
  REDEMPTIONS_DATABASE_NAME = 'REDEMPTIONS_DATABASE_NAME',
  REDEMPTIONS_DATABASE_PASSWORD = 'REDEMPTIONS_DATABASE_PASSWORD',
  REDEMPTIONS_DATABASE_PORT = 'REDEMPTIONS_DATABASE_PORT',
  REDEMPTIONS_DATABASE_SEED_METHOD = 'REDEMPTIONS_DATABASE_SEED_METHOD',
  REDEMPTIONS_DATABASE_TYPE = 'REDEMPTIONS_DATABASE_TYPE',
  REDEMPTIONS_DATABASE_USER = 'REDEMPTIONS_DATABASE_USER',
  REDEMPTIONS_DANGEROUSLY_ALLOW_DATABASE_SETUP_STRATEGY = 'REDEMPTIONS_DANGEROUSLY_ALLOW_DATABASE_SETUP_STRATEGY',

  // Lambda scripts integration
  REDEMPTIONS_LAMBDA_SCRIPTS_HOST = 'REDEMPTIONS_LAMBDA_SCRIPTS_HOST',
  REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT = 'REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT',
  REDEMPTIONS_LAMBDA_SCRIPTS_RETRIEVE_ALL_VAULTS_PATH = 'REDEMPTIONS_LAMBDA_SCRIPTS_RETRIEVE_ALL_VAULTS_PATH',
  REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_AMOUNT_ISSUED_PATH = 'REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_AMOUNT_ISSUED_PATH',
  REDEMPTIONS_LAMBDA_SCRIPTS_ASSIGN_USER_CODES_PATH = 'REDEMPTIONS_LAMBDA_SCRIPTS_ASSIGN_USER_CODES_PATH',
  REDEMPTIONS_LAMBDA_SCRIPTS_CODES_REDEEMED_PATH = 'REDEMPTIONS_LAMBDA_SCRIPTS_CODES_REDEEMED_PATH',
  REDEMPTIONS_LAMBDA_SCRIPTS_SECRET_NAME = 'REDEMPTIONS_LAMBDA_SCRIPTS_SECRET_NAME',

  // CORS
  API_DEFAULT_ALLOWED_ORIGINS = 'API_DEFAULT_ALLOWED_ORIGINS',

  // Braze
  BRAZE_VAULT_REDEMPTION_VAULT_CAMPAIGN_ID = 'BRAZE_VAULT_REDEMPTION_VAULT_CAMPAIGN_ID',
  BRAZE_API_URL = 'BRAZE_API_URL',

  // Event bus
  REDEMPTIONS_EVENT_BUS_NAME = 'REDEMPTIONS_EVENT_BUS_NAME',

  // DWH Firehose
  DWH_FIREHOSE_COMP_VIEW_STREAM_NAME = 'DWH_FIREHOSE_COMP_VIEW_STREAM_NAME',
  DWH_FIREHOSE_COMP_CLICK_STREAM_NAME = 'DWH_FIREHOSE_COMP_CLICK_STREAM_NAME',
  DWH_FIREHOSE_COMP_VAULT_CLICK_STREAM_NAME = 'DWH_FIREHOSE_COMP_VAULT_CLICK_STREAM_NAME',
}
