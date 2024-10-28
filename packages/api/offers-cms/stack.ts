import { EventBus as AwsEventBus } from 'aws-cdk-lib/aws-events';
import { AccountPrincipal, Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Api, Config, Function, type StackContext, use } from 'sst/constructs';

import { ApiGatewayAuthorizer } from '@blc-mono/core/identity/authorizer';
import { CliLogger } from '@blc-mono/core/utils/logger';
import { Identity } from '@blc-mono/identity/stack';

import { createTables } from './infrastructure/dynamo';
import { createCMSEventBus } from './infrastructure/eventbridge';
import { env } from './src/lib/env';

const CMS_BUS_NAME = 'offers-cms-bus';
const CONSUMER_FUNCTION_NAME = 'offers-cms-consumer-function';
const API_GATEWAY_NAME = 'offers-http';
const EVENT_BUS_ID = 'Discovery Event Bus';

const cliLogger = new CliLogger();

export function OffersCMS({ stack }: StackContext) {
  const { authorizer } = use(Identity);
  const discoveryBusName = env.OFFERS_DISCOVERY_EVENT_BUS_NAME || '';

  const { rawDataTable, offersDataTable, companyDataTable } = createTables(stack);

  const consumerFunction = new Function(stack, CONSUMER_FUNCTION_NAME, {
    handler: 'packages/api/offers-cms/lambda/consumer.handler',
    bind: [rawDataTable, offersDataTable, companyDataTable],
    environment: env,
  });

  if (discoveryBusName.length > 0) {
    const discoBus = AwsEventBus.fromEventBusName(stack, EVENT_BUS_ID, discoveryBusName);
    const wrappedDiscoBus = new Config.Parameter(stack, 'discovery_bus', {
      value: discoBus.eventBusName,
    });
    consumerFunction.bind([wrappedDiscoBus]);
    consumerFunction.attachPermissions([[discoBus, 'grantPutEventsTo']]);
  } else {
    cliLogger.info({ message: 'Discovery Event Bus not set. Offers CMS events will not be sent.' });
  }

  const cmsEvents = createCMSEventBus(stack, CMS_BUS_NAME, { consumerFunction });

  if (env.OFFERS_CMS_ACCOUNT) {
    const awsCmsBus = cmsEvents.cdk.eventBus as AwsEventBus;
    awsCmsBus.addToResourcePolicy(
      new PolicyStatement({
        sid: `Allow-CMS-Account-To-${awsCmsBus.eventBusName}`,
        actions: ['events:PutEvents'],
        effect: Effect.ALLOW,
        principals: [new AccountPrincipal(env.OFFERS_CMS_ACCOUNT)],
        resources: [awsCmsBus.eventBusArn],
      }),
    );
  } else {
    cliLogger.info({ message: 'CMS Account not set. Skipping resource policy creation.' });
  }

  const api = new Api(stack, API_GATEWAY_NAME, {
    routes: {
      $default: 'packages/api/offers-cms/lambda/api.handler',
    },
    authorizers: {
      offersAuthorizer: {
        type: 'lambda',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore .function exists. The typings are incorrect
        function: ApiGatewayAuthorizer(stack, 'ApiGatewayAuthorizer', authorizer).function,
      },
    },
    defaults: {
      function: {
        bind: [offersDataTable, companyDataTable],
        environment: env,
      },
      authorizer: 'offersAuthorizer',
    },
  });

  stack.addOutputs({
    ingest: cmsEvents.eventBusArn,
    ingestProcessor: consumerFunction.functionArn,
    offersCmsApiGateway: api.url,
  });

  return {
    consumerFunction,
    cmsEvents,
  };
}
