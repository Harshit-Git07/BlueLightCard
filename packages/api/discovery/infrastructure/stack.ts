import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ApiGatewayV1Api, StackContext, use } from 'sst/constructs';

import { GlobalConfigResolver } from '@blc-mono/core/configuration/global-config';
import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { ApiGatewayAuthorizer } from '@blc-mono/core/identity/authorizer';
import { Identity } from '@blc-mono/identity/stack';

import { Shared } from '../../../../stacks/stack';
import { DiscoveryStackConfigResolver, DiscoveryStackRegion } from '../infrastructure/config/config';

import { Route } from './routes/route';

export async function Discovery({ stack, app }: StackContext) {
  const { certificateArn } = use(Shared);
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
      service: SERVICE_NAME,
      DD_VERSION: process.env.DD_VERSION || '',
      DD_ENV: process.env.SST_STAGE || 'undefined',
      DD_API_KEY: process.env.DD_API_KEY || '',
      DD_GIT_COMMIT_SHA: process.env.DD_GIT_COMMIT_SHA || '',
      DD_GIT_REPOSITORY_URL: process.env.DD_GIT_REPOSITORY_URL || '',
      USE_DATADOG_AGENT,
      DD_SERVICE: SERVICE_NAME,
    },
    layers,
  });

  const api = new ApiGatewayV1Api(stack, 'discovery', {
    authorizers: {
      discoveryAuthorizer: ApiGatewayAuthorizer(stack, 'ApiGatewayAuthorizer', authorizer),
    },
    defaults: {
      authorizer: 'discoveryAuthorizer',
    },
    cdk: {
      restApi: {
        ...(['production', 'staging'].includes(stack.stage) &&
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
      },
    }),
  });

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
  stage === 'production' ? 'discovery-au.blcshine.io' : `${stage}-discovery-au.blcshine.io`;

const getUKDomainName = (stage: string) =>
  stage === 'production' ? 'discovery.blcshine.io' : `${stage}-discovery.blcshine.io`;
