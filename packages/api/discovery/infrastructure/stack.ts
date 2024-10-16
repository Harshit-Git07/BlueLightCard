import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { ApiGatewayV1Api, Function, FunctionDefinition, StackContext, use } from 'sst/constructs';

import { GlobalConfigResolver } from '@blc-mono/core/configuration/global-config';
import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { ApiGatewayAuthorizer } from '@blc-mono/core/identity/authorizer';
import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';
import { deleteOldSearchIndicesCron } from '@blc-mono/discovery/infrastructure/crons/deleteOldSearchIndicesCron';
import { createSearchOfferCompanyTable } from '@blc-mono/discovery/infrastructure/database/createSearchOfferCompanyTable';
import { eventRule } from '@blc-mono/discovery/infrastructure/eventHandling/eventQueueRule';
import { populateSearchIndexRule } from '@blc-mono/discovery/infrastructure/rules/populateSearchIndexRule';
import { OpenSearchDomain } from '@blc-mono/discovery/infrastructure/search/OpenSearchDomain';
import { Identity } from '@blc-mono/identity/stack';

import { Shared } from '../../../../stacks/stack';
import { DiscoveryStackConfigResolver, DiscoveryStackRegion } from '../infrastructure/config/config';

import { populateSearchIndexCron } from './crons/populateSearchIndexCron';
import { eventQueue } from './eventHandling/eventQueue';
import { Route } from './routes/route';
async function DiscoveryStack({ stack, app }: StackContext) {
  const { certificateArn, vpc, bus } = use(Shared);
  const { authorizer } = use(Identity);
  const SERVICE_NAME = 'discovery';
  stack.tags.setTag('service', SERVICE_NAME);

  const config = DiscoveryStackConfigResolver.for(stack, app.region as DiscoveryStackRegion);
  const globalConfig = GlobalConfigResolver.for(stack.stage);
  const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

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
      DD_VERSION: process.env.DD_VERSION ?? '',
      DD_ENV: process.env.SST_STAGE ?? 'undefined',
      DD_API_KEY: process.env.DD_API_KEY ?? '',
      DD_GIT_COMMIT_SHA: process.env.DD_GIT_COMMIT_SHA ?? '',
      DD_GIT_REPOSITORY_URL: process.env.DD_GIT_REPOSITORY_URL ?? '',
      USE_DATADOG_AGENT,
      DD_SERVICE: SERVICE_NAME,
      DD_SITE: 'datadoghq.eu',
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
      permissions: ['es'],
      environment: {
        OPENSEARCH_DOMAIN_ENDPOINT: config.openSearchDomainEndpoint ?? openSearchDomain,
        STAGE: stack.stage,
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
    'GET /categories': Route.createRoute({
      apiGatewayModelGenerator,
      stack,
      functionName: 'GetCatgoriesHandler',
      restApi,
      handler: 'packages/api/discovery/application/handlers/categories/getCategories.handler',
      requestValidatorName: 'GetCategoriesValidator',
      defaultAllowedOrigins: config.apiDefaultAllowedOrigins,
    }),
    'GET /menus': Route.createRoute({
      apiGatewayModelGenerator,
      stack,
      functionName: 'GetMenusHandler',
      restApi,
      handler: 'packages/api/discovery/application/handlers/Menus/getMenus.handler',
      requestValidatorName: 'GetMenusValidator',
      defaultAllowedOrigins: config.apiDefaultAllowedOrigins,
    }),
  });

  const searchOfferCompanyTable = createSearchOfferCompanyTable(stack);

  const populateSearchIndexFunction: FunctionDefinition = {
    permissions: ['dynamodb:Query', searchOfferCompanyTable.tableName, 'es'],
    handler: 'packages/api/discovery/application/handlers/search/populateSearchIndex.handler',
    environment: {
      OPENSEARCH_DOMAIN_ENDPOINT: config.openSearchDomainEndpoint ?? openSearchDomain,
      STAGE: stack.stage ?? '',
      SEARCH_OFFER_COMPANY_TABLE_NAME: searchOfferCompanyTable.tableName ?? '',
    },
    vpc,
    deadLetterQueueEnabled: true,
    timeout: '5 minutes',
  };

  populateSearchIndexCron(stack, populateSearchIndexFunction);

  const deleteOldSearchIndicesFunction: FunctionDefinition = {
    permissions: ['es'],
    handler: 'packages/api/discovery/application/handlers/search/deleteOldSearchIndices.handler',
    environment: {
      OPENSEARCH_DOMAIN_ENDPOINT: config.openSearchDomainEndpoint ?? openSearchDomain,
      STAGE: stack.stage ?? '',
    },
    vpc,
    deadLetterQueueEnabled: true,
    timeout: '5 minutes',
  };

  deleteOldSearchIndicesCron(stack, deleteOldSearchIndicesFunction);

  const discoveryEventQueue = eventQueue(stack, 'discoveryEventQueue');

  bus.addRules(stack, {
    populateOpenSearchRule: populateSearchIndexRule(populateSearchIndexFunction),
    discoveryEventRule: eventRule(stack, discoveryEventQueue),
  });

  const eventQueueListener = new Function(stack, 'EventQueueListenerLambda', {
    handler: 'packages/api/discovery/application/handlers/eventQueue/eventQueueListener.handler',
    environment: {
      SEARCH_OFFER_COMPANY_TABLE_NAME: searchOfferCompanyTable.tableName,
      REGION: stack.region,
    },
  });
  searchOfferCompanyTable.grantReadWriteData(eventQueueListener);
  eventQueueListener.addEventSource(
    new SqsEventSource(discoveryEventQueue.cdk.queue, {
      batchSize: 10,
      enabled: true,
    }),
  );

  discoveryEventQueue.cdk.queue.grantConsumeMessages(eventQueueListener);

  stack.addOutputs({
    DiscoveryApiEndpoint: api.url,
    DiscoveryApiCustomDomain: api.customDomainUrl,
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
