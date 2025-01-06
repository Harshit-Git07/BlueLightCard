export enum MemberStackEnvironmentKeys {
  SKIP_MEMBERS_STACK = 'SKIP_MEMBERS_STACK',
  // CORS
  API_DEFAULT_ALLOWED_ORIGINS = 'API_DEFAULT_ALLOWED_ORIGINS',

  // S3
  ID_UPLOAD_BUCKET = 'ID_UPLOAD_BUCKET',

  // DATADOG
  USE_DATADOG_AGENT = 'false', // # 'true' or 'false'
  DD_API_KEY = '',
  DD_GIT_COMMIT_SHA = '',
  DD_GIT_REPOSITORY_URL = 'https://github.com/bluelightcard/BlueLightCard-2.0',
  DD_VERSION = '',

  // BRAZE
  BRAZE_SERVICE_JSON = 'BRAZE_SERVICE_JSON',
  SERVICE_LAYER_BRAZE_SQS_QUEUE = 'SERVICE_LAYER_BRAZE_SQS_QUEUE',

  // EMAIL
  SERVICE_LAYER_EMAIL_FROM = 'SERVICE_LAYER_EMAIL_FROM',

  // EVENT HANDLING SWITCHES
  SERVICE_LAYER_EVENTS_ENABLED_GLOBAL = 'SERVICE_LAYER_EVENTS_ENABLED_GLOBAL',
  SERVICE_LAYER_EVENTS_ENABLED_BRAZE = 'SERVICE_LAYER_EVENTS_ENABLED_BRAZE',
  SERVICE_LAYER_EVENTS_ENABLED_DWH = 'SERVICE_LAYER_EVENTS_ENABLED_DWH',
  SERVICE_LAYER_EVENTS_ENABLED_EMAIL = 'SERVICE_LAYER_EVENTS_ENABLED_EMAIL',
  SERVICE_LAYER_EVENTS_ENABLED_LEGACY = 'SERVICE_LAYER_EVENTS_ENABLED_LEGACY',
  SERVICE_LAYER_EVENTS_ENABLED_SYSTEM = 'SERVICE_LAYER_EVENTS_ENABLED_SYSTEM',

  // EVENT BUS
  SERVICE_LAYER_EVENT_BUS_NAME = 'SERVICE_LAYER_EVENT_BUS_NAME',

  // DATA WAREHOUSE FIREHOSE STREAM ENVIRONMENT
  SERVICE_LAYER_DWH_STREAM_PRIVCARDSACTIONS = 'SERVICE_LAYER_DWH_STREAM_PRIVCARDSACTIONS',
  SERVICE_LAYER_DWH_STREAM_USERCHANGES = 'SERVICE_LAYER_DWH_STREAM_USERCHANGES',
  SERVICE_LAYER_DWH_STREAM_USERSCONFIRMED = 'SERVICE_LAYER_DWH_STREAM_USERSCONFIRMED',
  SERVICE_LAYER_DWH_STREAM_USERSCOUNTY = 'SERVICE_LAYER_DWH_STREAM_USERSCOUNTY',
  SERVICE_LAYER_DWH_STREAM_USERSEMAIL = 'SERVICE_LAYER_DWH_STREAM_USERSEMAIL',
  SERVICE_LAYER_DWH_STREAM_USERSNEW = 'SERVICE_LAYER_DWH_STREAM_USERSNEW',
  SERVICE_LAYER_DWH_STREAM_USERPROFILES = 'SERVICE_LAYER_DWH_STREAM_USERPROFILES',
  SERVICE_LAYER_DWH_STREAM_USERSSERVICEMEMBER = 'SERVICE_LAYER_DWH_STREAM_USERSSERVICEMEMBER',
  SERVICE_LAYER_DWH_STREAM_USERSTRUSTMEMBER = 'SERVICE_LAYER_DWH_STREAM_USERSTRUSTMEMBER',
  SERVICE_LAYER_DWH_STREAM_USERUUID = 'SERVICE_LAYER_DWH_STREAM_USERUUID',
  SERVICE_LAYER_DWH_STREAM_USERSVALIDATED = 'SERVICE_LAYER_DWH_STREAM_USERSVALIDATED',

  // AUTH0
  SERVICE_LAYER_AUTH0_DOMAIN = 'SERVICE_LAYER_AUTH0_DOMAIN',
  SERVICE_LAYER_AUTH0_API_CLIENT_ID = 'SERVICE_LAYER_AUTH0_API_CLIENT_ID',
  SERVICE_LAYER_AUTH0_API_CLIENT_SECRET = 'SERVICE_LAYER_AUTH0_API_CLIENT_SECRET',
  SERVICE_LAYER_AUTH0_PASSWORD_VALIDATION_CLIENT_ID = 'SERVICE_LAYER_AUTH0_PASSWORD_VALIDATION_CLIENT_ID',
  SERVICE_LAYER_AUTH0_PASSWORD_VALIDATION_CLIENT_SECRET = 'SERVICE_LAYER_AUTH0_PASSWORD_VALIDATION_CLIENT_SECRET',

  // STACK
  BRAND = 'BRAND',
  REGION = 'REGION',
  SERVICE = 'SERVICE',
  STAGE = 'STAGE',

  // OPEN SEARCH
  MEMBERS_OPENSEARCH_DOMAIN_ENDPOINT = 'MEMBERS_OPENSEARCH_DOMAIN_ENDPOINT',

  // CARD BATCHING
  ENABLE_AUTOMATIC_EXTERNAL_CARD_BATCHING = 'ENABLE_AUTOMATIC_EXTERNAL_CARD_BATCHING',

  // CARD PRINTING PROVIDER SFTP
  SFTP_HOST = 'SFTP_HOST',
  SFTP_USER = 'SFTP_USER',
  SFTP_PASSWORD = 'SFTP_PASSWORD',
  SFTP_PATH_SEND_BATCH_FILE = 'SFTP_PATH_SEND_BATCH_FILE',
}
