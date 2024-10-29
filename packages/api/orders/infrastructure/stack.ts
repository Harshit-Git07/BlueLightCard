import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ApiGatewayV1Api, StackContext, use } from 'sst/constructs';

import { GlobalConfigResolver } from '@blc-mono/core/configuration/global-config';
import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { ApiGatewayAuthorizer } from '@blc-mono/core/identity/authorizer';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { getEnvOrDefault, getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { Shared } from '@blc-mono/shared/stack';

import { Identity } from '../../identity/stack';
import { PostCheckoutModel } from '../application/models/postCheckout';

import { OrdersStackConfigResolver } from './config/config';
import { productionDomainNames, stagingDomainNames } from './constants/domains';
import { OrdersStackEnvironmentKeys } from './constants/environment';
import { Route } from './routes/route';

function OrdersStack({ stack }: StackContext) {
  const { certificateArn } = use(Shared);
  const { authorizer } = use(Identity);
  const SERVICE_NAME = 'orders';

  // set tag service identity to all resources
  stack.tags.setTag('service', SERVICE_NAME);
  stack.tags.setTag('map-migrated', 'd-server-017zxazumgiycz');

  // Config
  const config = OrdersStackConfigResolver.for(stack);
  const globalConfig = GlobalConfigResolver.for(stack.stage);

  stack.setDefaultFunctionProps({
    timeout: 20,
    environment: {
      BRAND: getBrandFromEnv(),
      service: SERVICE_NAME,
      DD_VERSION: getEnvOrDefault(OrdersStackEnvironmentKeys.DD_VERSION, ''),
      DD_ENV: process.env?.SST_STAGE || 'undefined',
      DD_API_KEY: getEnvOrDefault(OrdersStackEnvironmentKeys.DD_API_KEY, ''),
      DD_GIT_COMMIT_SHA: getEnvOrDefault(OrdersStackEnvironmentKeys.DD_GIT_COMMIT_SHA, ''),
      DD_GIT_REPOSITORY_URL: getEnvOrDefault(OrdersStackEnvironmentKeys.DD_GIT_REPOSITORY_URL, ''),
      USE_DATADOG_AGENT: getEnvOrDefault(OrdersStackEnvironmentKeys.USE_DATADOG_AGENT, 'false'),
      DD_SERVICE: SERVICE_NAME,
      DD_SITE: 'datadoghq.eu',
    },
  });

  const brand = getBrandFromEnv();
  const api = new ApiGatewayV1Api(stack, SERVICE_NAME, {
    authorizers: {
      ordersAuthorizer: ApiGatewayAuthorizer(stack, 'ApiGatewayAuthorizer', authorizer),
    },
    defaults: {
      authorizer: 'ordersAuthorizer',
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
        deployOptions: {
          stageName: 'v1',
          metricsEnabled: true,
        },
        // IMPORTANT: If you need to update these settings, remember to also
        //            update them in APIGatewayController
        defaultCorsPreflightOptions: {
          allowOrigins: config.networkConfig.apiDefaultAllowedOrigins,
          allowHeaders: ['*'],
          allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowCredentials: true,
        },
      },
    },
  });
  const restApi = api.cdk.restApi;

  // Create API Models
  const apiGatewayModelGenerator = new ApiGatewayModelGenerator(api.cdk.restApi);
  const postCheckoutModel = apiGatewayModelGenerator.generateModel(PostCheckoutModel);

  // Create permissions
  const executeApiPolicy = new PolicyStatement({
    actions: ['execute-api:Invoke'],
    effect: Effect.ALLOW,
    resources: ['*'],
  });

  // functionName is automatically appended with the stage name

  api.addRoutes(stack, {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    'POST /checkout': Route.createRoute({
      model: postCheckoutModel,
      apiGatewayModelGenerator,
      stack,
      functionName: 'PostCheckoutHandler',
      restApi,
      handler: 'packages/api/orders/application/handlers/apiGateway/checkout/postCheckout.handler',
      requestValidatorName: 'PostCheckoutValidator',
      environment: {
        [OrdersStackEnvironmentKeys.IDENTITY_API_URL]: config.networkConfig.identityApiUrl,
        [OrdersStackEnvironmentKeys.PAYMENTS_API_URL]: config.networkConfig.paymentsApiUrl,
        [OrdersStackEnvironmentKeys.MEMBERSHIP_PRICE]: config.membershipPrice,
      },
      defaultAllowedOrigins: config.networkConfig.apiDefaultAllowedOrigins,
      permissions: [executeApiPolicy],
    }),
  });

  stack.addOutputs({
    OrdersApiEndpoint: api.url,
  });

  return {
    api,
  };
}

export const Orders =
  getEnvRaw(OrdersStackEnvironmentKeys.SKIP_ORDERS_STACK) !== 'true' ? OrdersStack : () => Promise.resolve();
