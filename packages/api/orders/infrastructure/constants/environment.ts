export enum OrdersStackEnvironmentKeys {
  ORDERS_WEB_HOST = 'ORDERS_WEB_HOST',
  DD_VERSION = 'DD_VERSION',
  DD_ENV = 'DD_ENV',
  DD_API_KEY = 'DD_API_KEY',
  DD_GIT_COMMIT_SHA = 'DD_GIT_COMMIT_SHA',
  DD_GIT_REPOSITORY_URL = 'DD_GIT_REPOSITORY_URL',

  // CORS
  API_DEFAULT_ALLOWED_ORIGINS = 'API_DEFAULT_ALLOWED_ORIGINS',

  // Identity
  IDENTITY_API_URL = 'IDENTITY_API_URL',

  //Payments
  PAYMENTS_API_URL = 'PAYMENTS_API_URL',
  MEMBERSHIP_PRICE = 'MEMBERSHIP_PRICE',

  // Environment
  USE_DATADOG_AGENT = 'USE_DATADOG_AGENT',

  SKIP_ORDERS_STACK = 'false',

  CURRENCY_CODE = 'CURRENCY_CODE',

  // Emails
  BRAZE_API_URL = 'BRAZE_API_URL',
  BRAZE_PAYMENT_SUCCEEDED_EMAIL_CAMPAIGN_ID = 'BRAZE_PAYMENT_SUCCEEDED_EMAIL_CAMPAIGN_ID',
}
