import { EventBus as AwsEventBus } from 'aws-cdk-lib/aws-events';
import { AccountPrincipal, Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Api, Config, Function, type StackContext, use } from 'sst/constructs';

import { ApiGatewayAuthorizer } from '@blc-mono/core/identity/authorizer';
import { CliLogger } from '@blc-mono/core/utils/logger';
import { Identity } from '@blc-mono/identity/stack';
import { Shared } from '@blc-mono/stacks/stack';

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
  const { dwhKenisisFirehoseStreams } = use(Shared);

  const discoveryBusName = env.OFFERS_DISCOVERY_EVENT_BUS_NAME || '';

  const { rawDataTable, offersDataTable, companyDataTable, eventsDataTable } = createTables(stack);

  const consumerFunction = new Function(stack, CONSUMER_FUNCTION_NAME, {
    handler: 'packages/api/offers-cms/lambda/consumer.handler',
    bind: [rawDataTable, offersDataTable, companyDataTable, eventsDataTable],
    environment: env,
  });
  consumerFunction.attachPermissions([
    'sqs:SendMessage',
    dwhKenisisFirehoseStreams.companyLocationStream.getPutRecordPolicyStatement(),
    'firehose:PutRecordBatch',
  ]);

  if (discoveryBusName.length > 0) {
    const discoBus = AwsEventBus.fromEventBusName(stack, EVENT_BUS_ID, discoveryBusName);
    const wrappedDiscoBus = new Config.Parameter(stack, 'discovery_bus', {
      value: discoBus.eventBusName,
    });
    consumerFunction.bind([wrappedDiscoBus]);
    consumerFunction.attachPermissions([[discoBus, 'grantPutEventsTo']]);
  } else {
    cliLogger.info({
      message: 'Discovery Event Bus not set. Offers CMS events will not be sent.',
    });
  }

  const cmsEvents = createCMSEventBus(stack, env, CMS_BUS_NAME, {
    dwhKenisisFirehoseStreams,
    consumerFunction,
  });

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
    cliLogger.info({
      message: 'CMS Account not set. Skipping resource policy creation.',
    });
  }

  const hono = new Function(stack, 'OffersApi', {
    handler: 'packages/api/offers-cms/lambda/api.handler',
    bind: [offersDataTable, companyDataTable, eventsDataTable],
    environment: env,
  });

  const api = new Api(stack, API_GATEWAY_NAME, {
    routes: {
      'OPTIONS /{proxy+}': hono,
      $default: {
        function: hono,
        authorizer: 'offersAuthorizer',
      },
    },
    authorizers: {
      offersAuthorizer: {
        type: 'lambda',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore .function exists. The types are incorrect
        function: ApiGatewayAuthorizer(stack, 'ApiGatewayAuthorizer', authorizer).function,
      },
    },
    cors: false,
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
