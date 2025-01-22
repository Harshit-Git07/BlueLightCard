import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { ApiGatewayV1Api, StackContext, use } from 'sst/constructs';

import { GlobalConfigResolver } from '@blc-mono/core/configuration/global-config';
import { STAGES } from '@blc-mono/core/types/stages.enum';
import { getBrandFromEnv, isDdsUkBrand } from '@blc-mono/core/utils/checkBrand';
import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { getEnvOrDefault, getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { Shared } from '@blc-mono/stacks/stack';

import { productionDomainNames, stagingDomainNames } from './constants/domains';
import { ZendeskStackEnvironmentKeys } from './constants/environment';

function ZendeskStack({ stack }: StackContext) {
  const globalConfig = GlobalConfigResolver.for(stack.stage);
  const { certificateArn } = use(Shared);
  const SERVICE_NAME = 'zendesk';
  const brand = getBrandFromEnv();

  const stageSecret = (isProduction(stack.stage) || isStaging(stack.stage))
      ? stack.stage
      : STAGES.STAGING;

  let secretName = `blc-mono-zendesk/${stageSecret}/secrets`;
  if (isDdsUkBrand()) {
    secretName = `blc-mono-zendesk-dds/${stageSecret}/secrets`;
  }
  const appSecret = Secret.fromSecretNameV2(
    stack,
    'zendesk-app-secret',
    secretName
  );
  stack.tags.setTag('service', SERVICE_NAME);
  stack.setDefaultFunctionProps({
    timeout: 20,
    environment: {
      BRAND: brand,
      SERVICE: SERVICE_NAME,
      ZENDESK_JWT_SECRET: appSecret.secretValueFromJson('zendesk_jwt_secret').toString(),
      ZENDESK_REDIRECT_URI: appSecret.secretValueFromJson('zendesk_redirect_uri').toString(),
      USER_POOL_DOMAIN: appSecret.secretValueFromJson('user_pool_domain').toString(),
      ZENDESK_SUBDOMAIN: appSecret.secretValueFromJson('zendesk_subdomain').toString(),
      ZENDESK_APP_CLIENT_ID: appSecret
        .secretValueFromJson('zendesk_app_client_id')
        .toString(),
      ZENDESK_MESSAGING_JWT_SECRET: appSecret.secretValueFromJson('zendesk_messaging_jwt_secret').toString(),
      ZENDESK_MESSAGING_KID: appSecret.secretValueFromJson('zendesk_messaging_jwt_secret').toString(),
      ZENDESK_URL_UK: getEnvOrDefault(ZendeskStackEnvironmentKeys.ZENDESK_URL_UK, ''),
      ZENDESK_URL_AUS: getEnvOrDefault(ZendeskStackEnvironmentKeys.ZENDESK_URL_AUS, ''),
      ZENDESK_URL_DDS: getEnvOrDefault(ZendeskStackEnvironmentKeys.ZENDESK_URL_DDS, ''),
      ZENDESK_SUPPORT_URL_UK: getEnvOrDefault(ZendeskStackEnvironmentKeys.ZENDESK_SUPPORT_URL_UK, ''),
      ZENDESK_SUPPORT_URL_AUS: getEnvOrDefault(ZendeskStackEnvironmentKeys.ZENDESK_SUPPORT_URL_AUS, ''),
      ZENDESK_SUPPORT_URL_DDS: getEnvOrDefault(ZendeskStackEnvironmentKeys.ZENDESK_SUPPORT_URL_DDS, ''),
      ZENDESK_API_BASE_URL_UK: getEnvOrDefault(ZendeskStackEnvironmentKeys.ZENDESK_API_BASE_URL_UK, ''),
      ZENDESK_API_BASE_URL_AUS: getEnvOrDefault(ZendeskStackEnvironmentKeys.ZENDESK_API_BASE_URL_AUS, ''),
      ZENDESK_API_BASE_URL_DDS: getEnvOrDefault(ZendeskStackEnvironmentKeys.ZENDESK_API_BASE_URL_DDS, ''),
      DD_VERSION: getEnvOrDefault(ZendeskStackEnvironmentKeys.DD_VERSION, ''),
      DD_ENV: process.env?.SST_STAGE || 'undefined',
      DD_API_KEY: getEnvOrDefault(ZendeskStackEnvironmentKeys.DD_API_KEY, ''),
      DD_GIT_COMMIT_SHA: getEnvOrDefault(ZendeskStackEnvironmentKeys.DD_GIT_COMMIT_SHA, ''),
      DD_GIT_REPOSITORY_URL: getEnvOrDefault(ZendeskStackEnvironmentKeys.DD_GIT_REPOSITORY_URL, ''),
      USE_DATADOG_AGENT: getEnvOrDefault(ZendeskStackEnvironmentKeys.USE_DATADOG_AGENT, 'false'),
      DD_SERVICE: SERVICE_NAME,
      DD_SITE: 'datadoghq.eu',
    },
  });
  const zendeskApi = new ApiGatewayV1Api(stack, SERVICE_NAME, {
    defaults: {
      function: {
        timeout: 20
      },
    },
    routes: {
      'GET /login': 'packages/api/zendesk/application/handlers/login.handler',
      'GET /logout': 'packages/api/zendesk/application/handlers/logout.handler',
      'GET /callback':
        'packages/api/zendesk/application/handlers/callback.handler',
      'GET /login/zd':
        'packages/api/zendesk/application/handlers/zdlogin.handler',
      // 'GET /logout/zd':
      //   'packages/api/zendesk/application/handlers/zdlogout.handler'
    },
    cdk: {
      restApi: {
        endpointTypes: globalConfig.apiGatewayEndpointTypes,
        ...((isProduction(stack.stage) || isStaging(stack.stage)) &&
          certificateArn && {
            domainName: {
              domainName: isProduction(stack.stage) ? productionDomainNames[brand] : stagingDomainNames[brand],
              certificate: Certificate.fromCertificateArn(stack, 'DomainCertificate', certificateArn),
            },
          }),
      },
    },
  });

  zendeskApi.addRoutes(stack, {
    'GET /token': {
      function: {
        handler: "packages/api/zendesk/application/handlers/generateToken.handler",
        environment: {
          ZENDESK_MESSAGING_JWT_SECRET: appSecret.secretValueFromJson('zendesk_jwt_secret').toString(),
          ZENDESK_MESSAGING_KID: appSecret.secretValueFromJson('zendesk_jwt_secret').toString()
        }
      },
    }
  });
  stack.addOutputs({
    ZendeskApiEndpoint: zendeskApi.url,
  });
  return {
    zendeskApi,
  };
}

export const Zendesk =
  getEnvRaw(ZendeskStackEnvironmentKeys.SKIP_ZENDESK_STACK) !== 'true' ? ZendeskStack : () => Promise.resolve();

