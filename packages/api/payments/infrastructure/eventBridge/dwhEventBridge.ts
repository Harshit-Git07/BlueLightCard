import { IEventBus, Rule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Queue, Stack } from 'sst/constructs';

import { PAYMENTS_EVENT_SOURCE, PaymentsEventDetailType } from '@blc-mono/core/constants/payments';

import { DwhKenisisFirehoseStreams } from '../../../../../stacks/infra/firehose/DwhKenisisFirehoseStreams';
import { SSTFunction } from '.././constructs/SSTFunction';
import { PaymentsStackEnvironmentKeys } from '../constants/environment';

export class DWHEventBridge {
  constructor(
    private readonly stack: Stack,
    private readonly eventBus: IEventBus,
  ) {}

  paymentIntentHandlerRule(dwhKenisisFirehoseStreams: DwhKenisisFirehoseStreams, layers: string[] | undefined) {
    const dlq = new Queue(this.stack, 'DLQDWHPaymentIntentHandler');
    const handler = new LambdaFunction(
      new SSTFunction(this.stack, 'DWHPaymentIntentHandler', {
        permissions: [dwhKenisisFirehoseStreams.paymentStream.getPutRecordPolicyStatement()],
        handler: 'packages/api/payments/application/handlers/eventBridge/DWH/dwhPaymentIntent.handler',
        retryAttempts: 2,
        deadLetterQueueEnabled: true,
        deadLetterQueue: dlq.cdk.queue,
        environment: {
          // Data Warehouse
          [PaymentsStackEnvironmentKeys.DWH_PAYMENT_STREAM_NAME]:
            dwhKenisisFirehoseStreams.paymentStream.getStreamName(), //TODO: stream name
        },
        layers,
      }),
    );

    new Rule(this.stack, 'DWHPaymentIntentHandler', {
      eventBus: this.eventBus,
      eventPattern: {
        source: [PAYMENTS_EVENT_SOURCE],
        detailType: [PaymentsEventDetailType.PAYMENT_INITIATED],
      },
    }).addTarget(handler);
  }

  paymentSucceededHandlerRule(dwhKenisisFirehoseStreams: DwhKenisisFirehoseStreams, layers: string[] | undefined) {
    const dlq = new Queue(this.stack, 'DLQDWHPaymentSucceededHandler');
    const dwhPaymentSucceededHandler = new LambdaFunction(
      new SSTFunction(this.stack, 'DWHPaymentSucceededHandler', {
        permissions: [dwhKenisisFirehoseStreams.paymentStream.getPutRecordPolicyStatement()],
        handler: 'packages/api/payments/application/handlers/eventBridge/DWH/dwhPaymentSucceeded.handler',
        retryAttempts: 2,
        deadLetterQueueEnabled: true,
        deadLetterQueue: dlq.cdk.queue,
        environment: {
          // Data Warehouse
          [PaymentsStackEnvironmentKeys.DWH_PAYMENT_STREAM_NAME]:
            dwhKenisisFirehoseStreams.paymentStream.getStreamName(), //TODO: stream name
        },
        layers,
      }),
    );

    new Rule(this.stack, 'DWHPaymentSucceededHandler', {
      eventBus: this.eventBus,
      eventPattern: {
        source: [PAYMENTS_EVENT_SOURCE],
        detailType: [PaymentsEventDetailType.PAYMENT_SUCCEEDED],
      },
    }).addTarget(dwhPaymentSucceededHandler);
  }

  paymentFailedHandlerRule(dwhKenisisFirehoseStreams: DwhKenisisFirehoseStreams, layers: string[] | undefined) {
    const dlq = new Queue(this.stack, 'DLQDWHPaymentFailedHandler');
    const handler = new LambdaFunction(
      new SSTFunction(this.stack, 'DWHPaymentFailedHandler', {
        permissions: [dwhKenisisFirehoseStreams.paymentStream.getPutRecordPolicyStatement()],
        handler: 'packages/api/payments/application/handlers/eventBridge/DWH/dwhPaymentFailed.handler',
        retryAttempts: 2,
        deadLetterQueueEnabled: true,
        deadLetterQueue: dlq.cdk.queue,
        environment: {
          // Data Warehouse
          [PaymentsStackEnvironmentKeys.DWH_PAYMENT_STREAM_NAME]:
            dwhKenisisFirehoseStreams.paymentStream.getStreamName(), //TODO: stream name
        },
        layers,
      }),
    );

    new Rule(this.stack, 'DWHPaymentFailedHandler', {
      eventBus: this.eventBus,
      eventPattern: {
        source: [PAYMENTS_EVENT_SOURCE],
        detailType: [PaymentsEventDetailType.PAYMENT_FAILED],
      },
    }).addTarget(handler);
  }
}
