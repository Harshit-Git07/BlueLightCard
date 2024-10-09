import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { EventBus as AwsEventBus } from 'aws-cdk-lib/aws-events';
import { AccountPrincipal, Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import {
  ApiGatewayV1Api,
  Config,
  EventBus,
  Function,
  type StackContext,
  Table,
  use,
} from 'sst/constructs';
import { z } from 'zod';

import { GlobalConfigResolver } from '@blc-mono/core/configuration/global-config';
import { ApiGatewayAuthorizer } from '@blc-mono/core/identity/authorizer';
import { generateOffersCustomDomainName } from '@blc-mono/core/offers/generateOffersCustomDomainName';
import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { getEnvOrDefaultValidated, getEnvValidated } from '@blc-mono/core/utils/getEnv';
import { CliLogger } from '@blc-mono/core/utils/logger/cliLogger';
import { Identity } from '@blc-mono/identity/stack';
import { OffersCMSStackEnvironmentKeys } from '@blc-mono/offers-cms/src/constants/environment';
import { SharedStackEnvironmentKeys } from '@blc-mono/shared/infra/environment';
import { Shared } from '@blc-mono/shared/stack';

const CMS_BUS_NAME = 'in';
const CMS_RAW_DATA_TABLE_NAME = 'cmsRawData';
const CMS_DATA_TABLE_NAME = 'cmsData';
const API_FUNCTION_NAME = 'apiFunction';
const CONSUMER_FUNCTION_NAME = 'consumerFunction';
const API_GATEWAY_NAME = 'offers-cms-apiGateway';
const EVENT_BUS_ID = 'Discovery Event Bus';

const cliLogger = new CliLogger();

export function OffersCMS({ stack }: StackContext) {
  const { authorizer } = use(Identity);
  const { certificateArn } = use(Shared);
  const globalConfig = GlobalConfigResolver.for(stack.stage);
  const discoveryBusName = getEnv(OffersCMSStackEnvironmentKeys.DISCOVERY_EVENT_BUS_NAME, '');

  const cmsRawDataTable = new Table(stack, CMS_RAW_DATA_TABLE_NAME, {
    fields: {
      _id: 'string',
      _type: 'string',
    },
    primaryIndex: { partitionKey: '_id', sortKey: '_type' },
  });

  const cmsDataTable = new Table(stack, CMS_DATA_TABLE_NAME, {
    fields: {
      _id: 'string',
      _type: 'string',
    },
    primaryIndex: { partitionKey: '_id', sortKey: '_type' },
  });

  const apiFunction = new Function(stack, API_FUNCTION_NAME, {
    handler: 'packages/api/offers-cms/lambda/api.handler',
    bind: [cmsDataTable],
    url: true,
    environment: {
      OFFERS_BRAND: getEnv(SharedStackEnvironmentKeys.BRAND),
      DISCOVERY_EVENT_BUS_NAME: discoveryBusName,
    },
  });

  const consumerFunction = new Function(stack, CONSUMER_FUNCTION_NAME, {
    handler: 'packages/api/offers-cms/lambda/consumer.handler',
    bind: [cmsRawDataTable, cmsDataTable],
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
        sid: 'AllowCMSaccount',
        actions: ['events:PutEvents'],
        effect: Effect.ALLOW,
        principals: [new AccountPrincipal(cmsAccountId)],
        resources: [awsCmsBus.eventBusArn],
      }),
    );
  } else {
    cliLogger.info({ message: 'CMS Account not set. Skipping resource policy creation.' });
  }

  // API Gateway provisioning
  const gateway = new ApiGatewayV1Api(stack, API_GATEWAY_NAME, {
    authorizers: {
      offersAuthorizer: ApiGatewayAuthorizer(stack, 'ApiGatewayAuthorizer', authorizer),
    },
    defaults: {
      authorizer: 'offersAuthorizer',
    },
    cdk: {
      restApi: {
        deployOptions: {
          stageName: 'v1',
        },
        endpointTypes: globalConfig.apiGatewayEndpointTypes,
        ...((isProduction(stack.stage) || isStaging(stack.stage)) &&
          certificateArn && {
            domainName: {
              domainName: generateOffersCustomDomainName(stack),
              certificate: Certificate.fromCertificateArn(
                stack,
                'DomainCertificate',
                certificateArn,
              ),
            },
          }),
      },
    },
    routes: {
      // Only one single route as hono handles the routing
      'ANY /{proxy+}': 'packages/api/offers-cms/lambda/api.handler',
    },
  });

  stack.addOutputs({
    api: apiFunction.url,
    ingest: cmsEvents.eventBusArn,
    ingestProcessor: consumerFunction.functionArn,
    offersCmsApiGateway: gateway.cdk.restApi.url,
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
