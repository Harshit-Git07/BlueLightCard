import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';

export enum EnvironmentVariablesKeys {
  OFFERS_DATABASE_ROOT_PASSWORD = 'OFFERS_DATABASE_ROOT_PASSWORD',
  OFFERS_DATABASE_USER = 'OFFERS_DATABASE_USER',
  OFFERS_DATABASE_NAME = 'OFFERS_DATABASE_NAME',
  OFFERS_DATABASE_HOST = 'OFFERS_DATABASE_HOST',
  OFFERS_DATABASE_PORT = 'OFFERS_DATABASE_PORT',
  OFFERS_DATABASE_TYPE = 'OFFERS_DATABASE_TYPE',
  DATABASE_CONFIG = 'DATABASE_CONFIG',
  AWS_REGION = 'AWS_REGION',
  STAGE = 'STAGE',
  BASE_URL = 'BASE_URL',
  LEGACY_OFFERS_API_ENDPOINT = 'LEGACY_OFFERS_API_ENDPOINT',
  BANNERS_TABLE_NAME = 'BANNERS_TABLE_NAME'
}

export const getBLCBaseUrlFromEnv = (stage: string): string => {
  switch (true) {
    case isProduction(stage):
      return process.env.PROD_BASE_URL!;
    case isStaging(stage):
      return process.env.STAGING_BASE_URL!;
    default:
      return process.env.DEV_BASE_URL!;
  }
}
