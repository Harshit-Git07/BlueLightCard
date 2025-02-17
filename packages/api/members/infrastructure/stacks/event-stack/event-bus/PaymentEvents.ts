import { Queue, use, Stack } from 'sst/constructs';
import { EventBus, Rule } from 'aws-cdk-lib/aws-events';
import { PAYMENTS_EVENT_SOURCE, PaymentsEventDetailType } from '@blc-mono/core/constants/payments';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { SSTFunction } from '@blc-mono/payments/infrastructure/constructs/SSTFunction';
import { Construct } from 'constructs';
import { MembersStack } from '@blc-mono/members/infrastructure/stacks/members-stack/membersStack';
import { Shared } from '../../../../../../../stacks/stack';
import { SERVICE_NAME } from '@blc-mono/members/infrastructure/stacks/shared/Constants';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/environment';

export class PaymentEvents extends Construct {
  constructor(stack: Stack) {
    super(stack, 'PaymentEvents');

    const { bus } = use(Shared);
    const { tables } = use(MembersStack);

    const eventBus = EventBus.fromEventBusArn(stack, 'ExistingSharedEventBus', bus.eventBusArn);

    const deadLetterQueue = new Queue(stack, 'DLQ-PaymentEventHandler');
    const handler = new LambdaFunction(
      new SSTFunction(stack, 'PaymentEventHandler', {
        handler: 'packages/api/members/application/handlers/eventbus/memberPaymentEvents.handler',
        bind: [tables.profilesTable],
        retryAttempts: 2,
        deadLetterQueueEnabled: true,
        deadLetterQueue: deadLetterQueue.cdk.queue,
        environment: {
          [MemberStackEnvironmentKeys.SERVICE]: SERVICE_NAME,
        },
      }),
    );

    new Rule(stack, 'PaymentEventForMembers', {
      eventBus,
      eventPattern: {
        source: [PAYMENTS_EVENT_SOURCE],
        detailType: [
          PaymentsEventDetailType.PAYMENT_SUCCEEDED,
          PaymentsEventDetailType.PAYMENT_FAILED,
        ],
      },
    }).addTarget(handler);
  }
}
