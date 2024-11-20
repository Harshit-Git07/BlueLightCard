export enum RedemptionsStackEnvironmentKeys {
  // Stack
  SKIP_REDEMPTIONS_STACK = 'SKIP_REDEMPTIONS_STACK',
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
  REDEMPTIONS_LAMBDA_SCRIPTS_VIEW_VAULT_BATCHES_PATH = 'REDEMPTIONS_LAMBDA_SCRIPTS_VIEW_VAULT_BATCHES_PATH',
  REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_VAULT_STOCK_PATH = 'REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_VAULT_STOCK_PATH',
  REDEMPTIONS_WEB_HOST = 'REDEMPTIONS_WEB_HOST',

  // CORS
  ADMIN_API_DEFAULT_ALLOWED_ORIGINS = 'ADMIN_API_DEFAULT_ALLOWED_ORIGINS',
  API_DEFAULT_ALLOWED_ORIGINS = 'API_DEFAULT_ALLOWED_ORIGINS',

  // Braze
  BRAZE_VAULT_EMAIL_CAMPAIGN_ID = 'BRAZE_VAULT_EMAIL_CAMPAIGN_ID',
  BRAZE_GENERIC_EMAIL_CAMPAIGN_ID = 'BRAZE_GENERIC_EMAIL_CAMPAIGN_ID',
  BRAZE_GIFT_CARD_EMAIL_CAMPAIGN_ID = 'BRAZE_GIFT_CARD_EMAIL_CAMPAIGN_ID',
  BRAZE_PRE_APPLIED_EMAIL_CAMPAIGN_ID = 'BRAZE_PRE_APPLIED_EMAIL_CAMPAIGN_ID',
  BRAZE_VAULTQR_EMAIL_CAMPAIGN_ID = 'BRAZE_VAULTQR_EMAIL_CAMPAIGN_ID',
  BRAZE_SHOW_CARD_EMAIL_CAMPAIGN_ID = 'BRAZE_SHOW_CARD_EMAIL_CAMPAIGN_ID',
  BRAZE_CREDIT_CARD_EMAIL_CAMPAIGN_ID = 'BRAZE_CREDIT_CARD_EMAIL_CAMPAIGN_ID',
  BRAZE_API_URL = 'BRAZE_API_URL',
  BRAZE_REDEMPTION_VAULT_PUSH_NOTIFICATION_CAMPAIGN_ID = 'BRAZE_REDEMPTION_VAULT_PUSH_NOTIFICATION_CAMPAIGN_ID',
  BRAZE_REDEMPTION_VAULT_QR_PUSH_NOTIFICATION_CAMPAIGN_ID = 'BRAZE_REDEMPTION_VAULT_QR_PUSH_NOTIFICATION_CAMPAIGN_ID',
  BRAZE_REDEMPTION_PRE_APPLIED_PUSH_NOTIFICATION_CAMPAIGN_ID = 'BRAZE_REDEMPTION_PRE_APPLIED_PUSH_NOTIFICATION_CAMPAIGN_ID',
  BRAZE_REDEMPTION_GENERIC_PUSH_NOTIFICATION_CAMPAIGN_ID = 'BRAZE_REDEMPTION_GENERIC_PUSH_NOTIFICATION_CAMPAIGN_ID',
  BRAZE_REDEMPTION_SHOW_CARD_PUSH_NOTIFICATION_CAMPAIGN_ID = 'BRAZE_REDEMPTION_SHOW_CARD_PUSH_NOTIFICATION_CAMPAIGN_ID',
  BRAZE_REDEMPTION_GIFT_CARD_PUSH_NOTIFICATION_CAMPAIGN_ID = 'BRAZE_REDEMPTION_GIFT_CARD_PUSH_NOTIFICATION_CAMPAIGN_ID',
  BRAZE_REDEMPTION_CREDIT_CARD_PUSH_NOTIFICATION_CAMPAIGN_ID = 'BRAZE_REDEMPTION_CREDIT_CARD_PUSH_NOTIFICATION_CAMPAIGN_ID',

  // EagleEye
  EAGLE_EYE_API_URL = 'EAGLE_EYE_API_URL',

  // Event bus
  REDEMPTIONS_EVENT_BUS_NAME = 'REDEMPTIONS_EVENT_BUS_NAME',

  // DWH Firehose
  DWH_FIREHOSE_COMP_VIEW_STREAM_NAME = 'DWH_FIREHOSE_COMP_VIEW_STREAM_NAME',
  DWH_FIREHOSE_COMP_CLICK_STREAM_NAME = 'DWH_FIREHOSE_COMP_CLICK_STREAM_NAME',
  DWH_FIREHOSE_COMP_APP_CLICK_STREAM_NAME = 'DWH_FIREHOSE_COMP_APP_CLICK_STREAM_NAME',
  DWH_FIREHOSE_COMP_APP_VIEW_STREAM_NAME = 'DWH_FIREHOSE_COMP_APP_VIEW_STREAM_NAME',
  DWH_FIREHOSE_VAULT_STREAM_NAME = 'DWH_FIREHOSE_VAULT_STREAM_NAME',
  DWH_FIREHOSE_REDEMPTIONS_STREAM_NAME = 'DWH_FIREHOSE_REDEMPTIONS_STREAM_NAME',
  DWH_FIREHOSE_CALLBACK_STREAM_NAME = 'DWH_FIREHOSE_CALLBACK_STREAM_NAME',

  // SES Email
  REDEMPTIONS_EMAIL_FROM = 'REDEMPTIONS_EMAIL_FROM',
  REDEMPTIONS_EMAIL_DOMAIN = 'REDEMPTIONS_EMAIL_DOMAIN',

  // Datadog unified service tracking
  DD_VERSION = 'DD_VERSION',
  DD_ENV = 'DD_ENV',
  DD_API_KEY = 'DD_API_KEY',
  DD_GIT_COMMIT_SHA = 'DD_GIT_COMMIT_SHA',
  DD_GIT_REPOSITORY_URL = 'DD_GIT_REPOSITORY_URL',

  // Environment
  USE_DATADOG_AGENT = 'USE_DATADOG_AGENT',

  // Identity
  IDENTITY_API_URL = 'IDENTITY_API_URL',

  // S3
  VAULT_CODES_UPLOAD_BUCKET = 'VAULT_CODES_UPLOAD_BUCKET',

  // Enable legacy vaults to be converted to standard vaults
  ENABLE_STANDARD_VAULT = 'ENABLE_STANDARD_VAULT',

  // Secrets Manager
  SECRETS_MANAGER_NAME = 'SECRETS_MANAGER_NAME',
  INTEGRATION_PROVIDER_SECRETS_MANAGER_NAME = 'INTEGRATION_PROVIDER_SECRETS_MANAGER_NAME',

  //Uniqodo intgration vaults
  USE_UNIQODO_TESTING_PROMOTION_ID = 'USE_UNIQODO_TESTING_PROMOTION_ID',
  UNIQODO_CLAIM_URL = 'UNIQODO_CLAIM_URL',
  UNIQODO_SECRETS_MANAGER_NAME = 'UNIQODO_SECRETS_MANAGER_NAME',
}
