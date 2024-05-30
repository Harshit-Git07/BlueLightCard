import { ENVIRONMENTS } from "./global-constants";

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

export const getBLCBaseUrlFromEnv = (stage: string, stackName: string): string => {
  switch (stage) {
    case ENVIRONMENTS.PRODUCTION:
      return process.env[getBrandSpecificEnvVar('PROD_BASE_URL', stackName)]!;
    case ENVIRONMENTS.STAGING:
      return process.env[getBrandSpecificEnvVar('STAGING_BASE_URL', stackName)]!;
    default:
      return process.env[getBrandSpecificEnvVar('DEV_BASE_URL', stackName)]!;
  }
}

export const getBrandSpecificEnvVar = (envVar: string, stackName: string) => {
  return stackName.includes('dds') ? `${envVar}_DDS` : envVar;
}
