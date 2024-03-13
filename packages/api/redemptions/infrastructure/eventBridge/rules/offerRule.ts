import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { SSTFunction } from '../../constructs/SSTFunction';
import { IDatabase } from '../../database/adapter';
import { RedemptionsDatasyncEvents } from '../events/datasync';

export function createOfferRule(stack: Stack, database: IDatabase): EventBusRuleProps {
  const queue = new Queue(stack, 'offerCreatedDeadLetterQueue');
  const offerCreatedHandler = new SSTFunction(stack, 'offerCreatedHandler', {
    database,
    handler: 'packages/api/redemptions/application/handlers/eventBridge/offers/offerCreatedHandler.handler',
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
  });
  return {
    pattern: { source: [RedemptionsDatasyncEvents.OFFER_CREATED] },
    targets: { offerCreatedHandler },
  };
}

export function updateOfferRule(stack: Stack, database: IDatabase): EventBusRuleProps {
  const queue = new Queue(stack, 'offerUpdatedDeadLetterQueue');
  const offerUpdatedHandler = new SSTFunction(stack, 'offerUpdatedHandler', {
    database,
    handler: 'packages/api/redemptions/application/handlers/eventBridge/offers/offerUpdatedHandler.handler',
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
  });
  return {
    pattern: { source: [RedemptionsDatasyncEvents.OFFER_UPDATED] },
    targets: { offerUpdatedHandler },
  };
}
