import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { SERVICE_NAME } from '@blc-mono/members/infrastructure/stacks/shared/Constants';
import { FunctionProps } from 'sst/constructs/Function';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/environment';

export function getDefaultFunctionProps(region: string): FunctionProps {
  const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

  const layers =
    USE_DATADOG_AGENT.toLowerCase() === 'true' && region
      ? [`arn:aws:lambda:${region}:464622532012:layer:Datadog-Extension:65`]
      : undefined;

  return {
    timeout: 20,
    environment: {
      service: SERVICE_NAME,
      BRAND: getBrandFromEnv(),
      REGION: region,
      SFTP_HOST: getEnvOrDefault(MemberStackEnvironmentKeys.SFTP_HOST, ''),
      SFTP_USER: getEnvOrDefault(MemberStackEnvironmentKeys.SFTP_USER, ''),
      SFTP_PASSWORD: getEnvOrDefault(MemberStackEnvironmentKeys.SFTP_PASSWORD, ''),
      SFTP_PATH_SEND_BATCH_FILE: getEnvOrDefault(
        MemberStackEnvironmentKeys.SFTP_PATH_SEND_BATCH_FILE,
        '',
      ),
      USE_DATADOG_AGENT: getEnvOrDefault(MemberStackEnvironmentKeys.USE_DATADOG_AGENT, 'false'),
      DD_API_KEY: getEnvOrDefault(MemberStackEnvironmentKeys.DD_API_KEY, ''),
      DD_ENV: process.env?.SST_STAGE || 'undefined',
      DD_GIT_COMMIT_SHA: getEnvOrDefault(MemberStackEnvironmentKeys.DD_GIT_COMMIT_SHA, ''),
      DD_GIT_REPOSITORY_URL: getEnvOrDefault(MemberStackEnvironmentKeys.DD_GIT_REPOSITORY_URL, ''),
      DD_SERVICE: SERVICE_NAME,
      DD_SITE: 'datadoghq.eu',
      DD_VERSION: getEnvOrDefault(MemberStackEnvironmentKeys.DD_VERSION, ''),
      SERVICE_LAYER_AUTH0_DOMAIN: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_AUTH0_DOMAIN,
        '',
      ),
      SERVICE_LAYER_AUTH0_API_CLIENT_ID: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_AUTH0_API_CLIENT_ID,
        '',
      ),
      SERVICE_LAYER_AUTH0_API_CLIENT_SECRET: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_AUTH0_API_CLIENT_SECRET,
        '',
      ),
      SERVICE_LAYER_AUTH0_PASSWORD_VALIDATION_CLIENT_ID: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_AUTH0_PASSWORD_VALIDATION_CLIENT_ID,
        '',
      ),
      SERVICE_LAYER_AUTH0_PASSWORD_VALIDATION_CLIENT_SECRET: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_AUTH0_PASSWORD_VALIDATION_CLIENT_SECRET,
        '',
      ),
      SERVICE_LAYER_EVENT_BUS_NAME: process.env?.SST_STAGE + '-blc-mono-eventBus',
      SERVICE_LAYER_BRAZE_SQS_QUEUE: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_BRAZE_SQS_QUEUE,
        '',
      ),
      SERVICE_LAYER_DWH_STREAM_PRIVCARDSACTIONS: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_PRIVCARDSACTIONS,
        '',
      ),
      SERVICE_LAYER_DWH_STREAM_USERCHANGES: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERCHANGES,
        '',
      ),
      SERVICE_LAYER_DWH_STREAM_USERSCONFIRMED: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSCONFIRMED,
        '',
      ),
      SERVICE_LAYER_DWH_STREAM_USERSCOUNTY: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSCOUNTY,
        '',
      ),
      SERVICE_LAYER_DWH_STREAM_USERSEMAIL: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSEMAIL,
        '',
      ),
      SERVICE_LAYER_DWH_STREAM_USERSNEW: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSNEW,
        '',
      ),
      SERVICE_LAYER_DWH_STREAM_USERPROFILES: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERPROFILES,
        '',
      ),
      SERVICE_LAYER_DWH_STREAM_USERSSERVICEMEMBER: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSSERVICEMEMBER,
        '',
      ),
      SERVICE_LAYER_DWH_STREAM_USERSTRUSTMEMBER: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSTRUSTMEMBER,
        '',
      ),
      SERVICE_LAYER_DWH_STREAM_USERUUID: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERUUID,
        '',
      ),
      SERVICE_LAYER_DWH_STREAM_USERSVALIDATED: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSVALIDATED,
        '',
      ),
      SERVICE_LAYER_EVENTS_ENABLED_GLOBAL: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_GLOBAL,
        'false',
      ),
      SERVICE_LAYER_EVENTS_ENABLED_BRAZE: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_BRAZE,
        'false',
      ),
      SERVICE_LAYER_EVENTS_ENABLED_DWH: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_DWH,
        'false',
      ),
      SERVICE_LAYER_EVENTS_ENABLED_EMAIL: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_EMAIL,
        'false',
      ),
      SERVICE_LAYER_EVENTS_ENABLED_LEGACY: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_LEGACY,
        'false',
      ),
      SERVICE_LAYER_EVENTS_ENABLED_SYSTEM: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_SYSTEM,
        'false',
      ),
      SERVICE_LAYER_EVENTS_ENABLED_PAYMENT: getEnvOrDefault(
        MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_PAYMENT,
        'false',
      ),
    },
    layers,
  };
}
