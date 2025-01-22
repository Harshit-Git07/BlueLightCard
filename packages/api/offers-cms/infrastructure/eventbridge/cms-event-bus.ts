import type { env as Env } from 'src/lib/env';
import { EventBus, type Function as SSTFunction, type Stack } from 'sst/constructs';

import { type DwhKenisisFirehoseStreams } from '@blc-mono/stacks/infra/firehose/DwhKenisisFirehoseStreams';

export function createCMSEventBus(
  stack: Stack,
  env: typeof Env,
  busName: string,
  dependencies: {
    dwhKenisisFirehoseStreams: DwhKenisisFirehoseStreams;
    consumerFunction: SSTFunction;
  },
): EventBus {
  const { consumerFunction } = dependencies;
  const cmsEventBus = new EventBus(stack, busName);

  const sanityWebhookRule = {
    pattern: { source: ['lambda.sanity.webhook'] },
    targets: {
      consumerTarget: {
        function: consumerFunction,
      },
    },
  };

  const dataWarehouseOfferRule = {
    pattern: {
      source: ['lambda.sanity.webhook'],
      detail: {
        body: {
          _type: ['offer'],
        },
      },
    },
  };

  const dataWarehouseCompanyRule = {
    pattern: {
      source: ['lambda.sanity.webhook'],
      detail: {
        body: {
          _type: ['company'],
        },
      },
    },
  };

  const dataWarehouseMenuRule = {
    pattern: {
      source: ['lambda.sanity.webhook'],
      detail: {
        body: {
          _type: ['menu.offer', 'menu.campaign', 'menu.company'],
        },
      },
    },
    targets: {
      dataWarehouseMenuFunction: {
        function: {
          permissions: [
            'sqs:SendMessage',
            dependencies.dwhKenisisFirehoseStreams.menuStream.getPutRecordPolicyStatement(),
          ],
          handler: 'packages/api/offers-cms/lambda/dataWarehouseMenuLambda.handler',
          deadLetterQueueEnabled: true,
          environment: {
            DWH_FIREHOSE_MENU_STREAM_NAME:
              dependencies.dwhKenisisFirehoseStreams.menuStream.getStreamName(),
            BRAND: env.BRAND,
          },
          retryAttempts: 2,
        },
      },
    },
  };

  const dataWarehouseThemedMenuRule = {
    pattern: {
      source: ['lambda.sanity.webhook'],
      detail: {
        body: {
          _type: ['menu.themed.offer'],
        },
      },
    },
    targets: {
      dataWarehouseThemedMenuFunction: {
        function: {
          permissions: [
            'sqs:SendMessage',
            'firehose:PutRecordBatch',
            dependencies.dwhKenisisFirehoseStreams.themedMenuStream.getPutRecordPolicyStatement(),
          ],
          handler: 'packages/api/offers-cms/lambda/dataWarehouseThemedMenuLambda.handler',
          deadLetterQueueEnabled: true,
          environment: {
            DWH_FIREHOSE_THEMED_MENU_STREAM_NAME:
              dependencies.dwhKenisisFirehoseStreams.themedMenuStream.getStreamName(),
            BRAND: env.BRAND,
          },
          retryAttempts: 2,
        },
      },
    },
  };

  cmsEventBus.addRules(stack, {
    sanityWebhookRule,
    dataWarehouseOfferRule,
    dataWarehouseCompanyRule,
    dataWarehouseMenuRule,
    dataWarehouseThemedMenuRule,
  });

  return cmsEventBus;
}
