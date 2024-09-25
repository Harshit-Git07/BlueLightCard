import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ApiGatewayV1Api, Function, StackContext, use } from 'sst/constructs';

import { GlobalConfigResolver } from '@blc-mono/core/configuration/global-config';
import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { ApiGatewayAuthorizer } from '@blc-mono/core/identity/authorizer';
import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';
import { createSearchOfferCompanyTable } from '@blc-mono/discovery/infrastructure/database/CreateSearchOfferCompanyTable';
import { populateOpenSearchRule } from '@blc-mono/discovery/infrastructure/rules/populateOpenSearchRule';
import { OpenSearchDomain } from '@blc-mono/discovery/infrastructure/search/OpenSearchDomain';
import { Identity } from '@blc-mono/identity/stack';

import { Shared } from '../../../../stacks/stack';
import { DiscoveryStackConfigResolver, DiscoveryStackRegion } from '../infrastructure/config/config';

import { Route } from './routes/route';
async function DiscoveryStack({ stack, app }: StackContext) {
  const { certificateArn, vpc, bus } = use(Shared);
  const { authorizer } = use(Identity);
  const SERVICE_NAME = 'discovery';
  stack.tags.setTag('service', SERVICE_NAME);

  const config = DiscoveryStackConfigResolver.for(stack, app.region as DiscoveryStackRegion);
  const globalConfig = GlobalConfigResolver.for(stack.stage);
  const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT || 'false';

  // https://docs.datadoghq.com/serverless/aws_lambda/installation/nodejs/?tab=custom
  const layers =
    USE_DATADOG_AGENT.toLowerCase() === 'true' && stack.region
      ? [`arn:aws:lambda:${stack.region}:464622532012:layer:Datadog-Extension:60`]
      : undefined;

  stack.setDefaultFunctionProps({
    timeout: 20,
    environment: {
      region: stack.region,
      SERVICE: SERVICE_NAME,
      DD_VERSION: process.env.DD_VERSION || '',
      DD_ENV: process.env.SST_STAGE || 'undefined',
      DD_API_KEY: process.env.DD_API_KEY || '',
      DD_GIT_COMMIT_SHA: process.env.DD_GIT_COMMIT_SHA || '',
      DD_GIT_REPOSITORY_URL: process.env.DD_GIT_REPOSITORY_URL || '',
      USE_DATADOG_AGENT,
      DD_SERVICE: SERVICE_NAME,
      DD_SITE: 'datadoghq.eu',
      OPENSEARCH_DOMAIN: process.env.OPENSEARCH_DOMAIN ?? '',
    },
    layers,
  });

  const openSearchDomain = await new OpenSearchDomain(stack, vpc).setup();

  const api = new ApiGatewayV1Api(stack, 'discovery', {
    authorizers: {
      discoveryAuthorizer: ApiGatewayAuthorizer(stack, 'ApiGatewayAuthorizer', authorizer),
    },
    defaults: {
      authorizer: 'discoveryAuthorizer',
    },
    cdk: {
      restApi: {
        ...((isProduction(stack.stage) || isStaging(stack.stage)) &&
          certificateArn && {
            domainName: {
              domainName: getDomainName(stack.stage, app.region),
              certificate: Certificate.fromCertificateArn(stack, 'DomainCertificate', certificateArn),
            },
          }),
        deployOptions: {
          stageName: 'v1',
        },
        endpointTypes: globalConfig.apiGatewayEndpointTypes,
        defaultCorsPreflightOptions: {
          allowOrigins: config.apiDefaultAllowedOrigins,
          allowHeaders: ['*'],
          allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowCredentials: true,
        },
      },
    },
  });
  const restApi = api.cdk.restApi;

  const apiGatewayModelGenerator = new ApiGatewayModelGenerator(api.cdk.restApi);

  api.addRoutes(stack, {
    'GET /search': Route.createRoute({
      apiGatewayModelGenerator,
      stack,
      functionName: 'GetSearchHandler',
      restApi,
      handler: 'packages/api/discovery/application/handlers/search/getSearch.handler',
      requestValidatorName: 'GetSearchValidator',
      defaultAllowedOrigins: config.apiDefaultAllowedOrigins,
      environment: {
        SEARCH_LAMBDA_SCRIPTS_HOST: config.searchLambdaScriptsHost,
        SEARCH_LAMBDA_SCRIPTS_ENVIRONMENT: config.searchLambdaScriptsEnvironment,
        SEARCH_BRAND: config.searchBrand,
        SEARCH_AUTH_TOKEN_OVERRIDE: config.searchAuthTokenOverride,
        OPENSEARCH_DOMAIN_ENDPOINT: config.openSearchDomainEndpoint,
      },
      vpc,
    }),
    'GET /campaigns': Route.createRoute({
      apiGatewayModelGenerator,
      stack,
      functionName: 'GetActiveCampaignHandler',
      restApi,
      handler: 'packages/api/discovery/application/handlers/campaigns/getActiveCampaigns.handler',
      requestValidatorName: 'GetCampaignEventValidator',
      defaultAllowedOrigins: config.apiDefaultAllowedOrigins,
    }),
  });

  const createSearchIndex = new Function(stack, `${stack.stage}-createSearchIndex`, {
    functionName: `${stack.stage}-createSearchIndex`,
    handler: 'packages/api/discovery/application/handlers/search/createSearchIndex.handler',
    memorySize: 512,
    permissions: ['es'],
    environment: {
      OPENSEARCH_DOMAIN_ENDPOINT: openSearchDomain,
    },
    vpc,
  });

  const searchOfferCompanyTable = createSearchOfferCompanyTable(stack);

  bus.addRules(stack, {
    populateOpenSearchRule: populateOpenSearchRule(
      stack,
      vpc,
      searchOfferCompanyTable,
      openSearchDomain,
      config,
      SERVICE_NAME,
    ),
  });

  stack.addOutputs({
    DiscoveryApiEndpoint: api.url,
    DiscoveryApiCustomDomain: api.customDomainUrl,
    CreateSearchIndex: createSearchIndex.functionArn,
  });

  return {
    api,
  };
}

const getDomainName = (stage: string, region: string) => {
  return region === 'ap-southeast-2' ? getAustraliaDomainName(stage) : getUKDomainName(stage);
};

const getAustraliaDomainName = (stage: string) =>
  isProduction(stage) ? 'discovery-au.blcshine.io' : `${stage}-discovery-au.blcshine.io`;

const getUKDomainName = (stage: string) =>
  isProduction(stage) ? 'discovery.blcshine.io' : `${stage}-discovery.blcshine.io`;

export const Discovery =
  getEnvRaw(DiscoveryStackEnvironmentKeys.SKIP_DISCOVERY_STACK) !== 'true' ? DiscoveryStack : () => Promise.resolve();
