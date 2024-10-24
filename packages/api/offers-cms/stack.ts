import { EventBus as AwsEventBus } from 'aws-cdk-lib/aws-events';
import { AccountPrincipal, Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Api, Config, EventBus, Function, type StackContext, use } from 'sst/constructs';
import { z } from 'zod';

import { ApiGatewayAuthorizer } from '@blc-mono/core/identity/authorizer';
import { getEnvOrDefaultValidated, getEnvValidated } from '@blc-mono/core/utils/getEnv';
import { CliLogger } from '@blc-mono/core/utils/logger';
import { Identity } from '@blc-mono/identity/stack';
import { OffersCMSStackEnvironmentKeys } from '@blc-mono/offers-cms/src/constants/environment';
import { SharedStackEnvironmentKeys } from '@blc-mono/shared/infra/environment';

import { createTables } from './infrastructure/dynamo';

const CMS_BUS_NAME = 'offers-cms-bus';
const API_FUNCTION_NAME = 'offers-cms-api-function';
const CONSUMER_FUNCTION_NAME = 'offers-cms-consumer-function';
const API_GATEWAY_NAME = 'offers-http';
const EVENT_BUS_ID = 'Discovery Event Bus';

const cliLogger = new CliLogger();

export function OffersCMS({ stack }: StackContext) {
  const { authorizer } = use(Identity);
  const discoveryBusName = getEnv(OffersCMSStackEnvironmentKeys.DISCOVERY_EVENT_BUS_NAME, '');

  const { rawDataTable, offersDataTable, companyDataTable } = createTables(stack);

  const consumerFunction = new Function(stack, CONSUMER_FUNCTION_NAME, {
    handler: 'packages/api/offers-cms/lambda/consumer.handler',
    bind: [rawDataTable, offersDataTable, companyDataTable],
    environment: {
      OFFERS_BRAND: getEnv(SharedStackEnvironmentKeys.BRAND),
      DISCOVERY_EVENT_BUS_NAME: discoveryBusName,
    },
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

  const cmsEvents = new EventBus(stack, CMS_BUS_NAME, {
    rules: {
      sanityRule: {
        pattern: { source: ['lambda.sanity.webhook'] },
        targets: {
          consumerTarget: {
            function: consumerFunction,
          },
        },
      },
    },
  });

  const cmsAccountId = getEnv(OffersCMSStackEnvironmentKeys.CMS_ACCOUNT, '');

  if (cmsAccountId.length > 0) {
    const awsCmsBus = cmsEvents.cdk.eventBus as AwsEventBus;
    awsCmsBus.addToResourcePolicy(
      new PolicyStatement({
        sid: `Allow-CMS-Account-To-${awsCmsBus.eventBusName}`,
        actions: ['events:PutEvents'],
        effect: Effect.ALLOW,
        principals: [new AccountPrincipal(cmsAccountId)],
        resources: [awsCmsBus.eventBusArn],
      }),
    );
  } else {
    cliLogger.info({ message: 'CMS Account not set. Skipping resource policy creation.' });
  }

  const apiFunction = new Function(stack, API_FUNCTION_NAME, {
    handler: 'packages/api/offers-cms/lambda/api.handler',
    bind: [offersDataTable, companyDataTable],
    url: true,
    environment: {
      BRAND: getEnv(SharedStackEnvironmentKeys.BRAND),
    },
  });

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
        environment: {
          BRAND: getEnv(SharedStackEnvironmentKeys.BRAND),
        },
      },
      authorizer: 'offersAuthorizer',
    },
  });

  stack.addOutputs({
    api: apiFunction.url,
    ingest: cmsEvents.eventBusArn,
    ingestProcessor: consumerFunction.functionArn,
    offersCmsApiGateway: api.url,
  });

  return {
    apiFunction,
    consumerFunction,
    cmsEvents,
  };
}

function getEnv(value: string, defaultValue?: string): string {
  try {
    if (defaultValue || defaultValue === '') {
      return getEnvOrDefaultValidated(value, defaultValue, z.string());
    } else {
      return getEnvValidated(value, z.string());
    }
  } catch (error) {
    cliLogger.error({ message: `Error retrieving environment variable "${value}"`, error });
    throw error;
  }
}
