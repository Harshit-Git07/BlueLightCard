import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { ApiGatewayV1Api, Queue, StackContext, use } from 'sst/constructs';

import { GlobalConfigResolver } from '@blc-mono/core/configuration/global-config';
import { MAP_BRAND } from '@blc-mono/core/constants/common';
import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { getEnvOrDefault, getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { Shared } from '@blc-mono/shared/stack';

import { PostPaymentInitiationModel } from '../application/models/postPaymentInitiation';

import { PaymentsStackConfigResolver } from './config/config';
import { productionDomainNames, stagingDomainNames } from './constants/domains';
import { PaymentsStackEnvironmentKeys } from './constants/environment';
import { SSTFunction } from './constructs/SSTFunction';
import { createTransactionsEventTable } from './database/createTransactionsEventsTable';
import { DWHEventBridge } from './eventBridge/dwhEventBridge';
import { StripeEventBridge } from './eventBridge/stripeEventBridge';
import { Route } from './routes/route';

function PaymentsStack({ stack }: StackContext) {
  const { certificateArn, bus, dwhKenisisFirehoseStreams } = use(Shared);
  const SERVICE_NAME = 'payments';

  // set tag service identity to all resources
  stack.tags.setTag('service', SERVICE_NAME);
  // TODO: what is this?
  stack.tags.setTag('map-migrated', 'd-server-017zxazumgiycz');

  // Config
  const config = PaymentsStackConfigResolver.for(stack);
  const globalConfig = GlobalConfigResolver.for(stack.stage);

  stack.setDefaultFunctionProps({
    timeout: 20,
    environment: {
      BRAND: getBrandFromEnv(),
      service: SERVICE_NAME,
      DD_VERSION: getEnvOrDefault(PaymentsStackEnvironmentKeys.DD_VERSION, ''),
      DD_ENV: process.env?.SST_STAGE || 'undefined',
      DD_API_KEY: getEnvOrDefault(PaymentsStackEnvironmentKeys.DD_API_KEY, ''),
      DD_GIT_COMMIT_SHA: getEnvOrDefault(PaymentsStackEnvironmentKeys.DD_GIT_COMMIT_SHA, ''),
      DD_GIT_REPOSITORY_URL: getEnvOrDefault(PaymentsStackEnvironmentKeys.DD_GIT_REPOSITORY_URL, ''),
      USE_DATADOG_AGENT: getEnvOrDefault(PaymentsStackEnvironmentKeys.USE_DATADOG_AGENT, 'false'),
      DD_SERVICE: SERVICE_NAME,
      DD_SITE: 'datadoghq.eu',
    },
  });

  // Create Database
  // const database = await new RedemptionsDatabase(app, stack, vpc, bastionHost).setup();

  const brand = getBrandFromEnv();
  const api = new ApiGatewayV1Api(stack, SERVICE_NAME, {
    defaults: {
      authorizer: 'iam',
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
      },
    },
  });
  const restApi = api.cdk.restApi;

  // Create API Models
  const apiGatewayModelGenerator = new ApiGatewayModelGenerator(api.cdk.restApi);
  const postPaymentInitiationModel = apiGatewayModelGenerator.generateModel(PostPaymentInitiationModel);

  // functionName is automatically appended with the stage name

  const brandSuffix = MAP_BRAND[getBrandFromEnv()];
  const secretName = `stripe-api-key-${brandSuffix}`;

  const stripeApiKey = Secret.fromSecretNameV2(stack, 'stripe-api-key', secretName);

  const transactionsEventsTable = createTransactionsEventTable(stack);

  const USE_DATADOG_AGENT = getEnvOrDefault(PaymentsStackEnvironmentKeys.USE_DATADOG_AGENT, 'false');
  // https://docs.datadoghq.com/serverless/aws_lambda/installation/nodejs/?tab=custom
  const layers =
    USE_DATADOG_AGENT.toLowerCase() === 'true' && stack.region
      ? [`arn:aws:lambda:${stack.region}:464622532012:layer:Datadog-Extension:60`]
      : undefined;

  api.addRoutes(stack, {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    'POST /payment-intiation': Route.createRoute({
      model: postPaymentInitiationModel,
      apiGatewayModelGenerator,
      stack,
      functionName: 'PostPaymentInitiationHandler',
      restApi,
      handler: 'packages/api/payments/application/handlers/apiGateway/paymentInitiation/postPaymentInitiation.handler',
      requestValidatorName: 'PostPaymentInitiationValidator',
      environment: {
        [PaymentsStackEnvironmentKeys.CURRENCY_CODE]: config.currencyCode,
        [PaymentsStackEnvironmentKeys.TRANSACTIONS_EVENTS_TABLE]: transactionsEventsTable.tableName ?? '',
        // Event Bus
        [PaymentsStackEnvironmentKeys.PAYMENTS_EVENT_BUS_NAME]: bus.eventBusName,
      },
      permissions: [
        new PolicyStatement({
          actions: ['dynamodb:*'],
          effect: Effect.ALLOW,
          resources: [transactionsEventsTable.tableArn],
        }),
        new PolicyStatement({
          actions: ['secretsmanager:GetSecretValue'],
          effect: Effect.ALLOW,
          resources: [stripeApiKey.secretArn + '-??????'],
        }),
        new PolicyStatement({
          actions: ['events:PutEvents'],
          effect: Effect.ALLOW,
          resources: [bus.eventBusArn],
        }),
      ],
      layers,
    }),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    'GET /payment-events': Route.createRoute({
      model: postPaymentInitiationModel,
      apiGatewayModelGenerator,
      stack,
      functionName: 'GetPaymentEventsHandler',
      restApi,
      handler: 'packages/api/payments/application/handlers/apiGateway/paymentEvents/getPaymentEvents.handler',
      requestValidatorName: 'GetPaymentEventsValidator',
      environment: {
        [PaymentsStackEnvironmentKeys.TRANSACTIONS_EVENTS_TABLE]: transactionsEventsTable.tableName ?? '',
      },
      permissions: [
        new PolicyStatement({
          actions: ['dynamodb:*'],
          effect: Effect.ALLOW,
          resources: [transactionsEventsTable.tableArn],
        }),
      ],
      layers,
    }),
  });

  const queue = new Queue(stack, 'DLQPaymentsStripeEventsHandler');
  const stripeEventHandler = new LambdaFunction(
    new SSTFunction(stack, 'StripeEventsHandler', {
      permissions: [
        new PolicyStatement({
          actions: ['dynamodb:*'],
          effect: Effect.ALLOW,
          resources: [transactionsEventsTable.tableArn, `${transactionsEventsTable.tableArn}/index/*`],
        }),
        new PolicyStatement({
          actions: ['events:PutEvents'],
          effect: Effect.ALLOW,
          resources: [bus.eventBusArn],
        }),
      ],
      handler: 'packages/api/payments/application/handlers/eventBridge/paymentEvents/paymentEventsHandler.handler',
      retryAttempts: 2,
      deadLetterQueueEnabled: true,
      deadLetterQueue: queue.cdk.queue,
      environment: {
        [PaymentsStackEnvironmentKeys.CURRENCY_CODE]: config.currencyCode,
        [PaymentsStackEnvironmentKeys.TRANSACTIONS_EVENTS_TABLE]: transactionsEventsTable.tableName ?? '',
        // Event Bus
        [PaymentsStackEnvironmentKeys.PAYMENTS_EVENT_BUS_NAME]: bus.eventBusName,
        [PaymentsStackEnvironmentKeys.STRIPE_EVENT_SOURCE_PREFIX]: config.stripeEventSourcePrefix,
      },
      layers,
    }),
  );

  new StripeEventBridge(stack, config.stripeEventBusArn, config.stripeEventSourcePrefix, stripeEventHandler);

  const eventBus = EventBus.fromEventBusArn(stack, 'ExistingSharedEventBus', bus.eventBusArn);
  const dwh = new DWHEventBridge(stack, eventBus);
  dwh.paymentSucceededHandlerRule(dwhKenisisFirehoseStreams, layers);
  dwh.paymentFailedHandlerRule(dwhKenisisFirehoseStreams, layers);
  dwh.paymentIntentHandlerRule(dwhKenisisFirehoseStreams, layers);

  stack.addOutputs({
    PaymentsApiEndpoint: api.url,
  });

  return {
    api,
  };
}

export const Payments =
  getEnvRaw(PaymentsStackEnvironmentKeys.SKIP_PAYMENTS_STACK) !== 'true' ? PaymentsStack : () => Promise.resolve();
