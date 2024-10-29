import { z } from 'zod';

import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';

import { IPaymentEventsRepository, PaymentEventsRepository } from '../../repositories/PaymentEventsRepository';
import {
  IPaymentEventStoreRepository,
  PaymentEventStoreRepository,
} from '../../repositories/PaymentEventStoreRepository';
import { IStripeRepository, StripeRepository } from '../../repositories/StripeRepository';

export const PaymentExternalEvent = z.object({
  type: z.string(),
  id: z.string(),
  object: z.string(),
  created: z.number(),
  data: z.object({
    object: z
      .object({
        id: z.string(),
      })
      .catchall(z.any()),
  }),
});

export type PaymentExternalEventModel = z.infer<typeof PaymentExternalEvent>;

export interface IPaymentEventHandlerService {
  TranslateAndPublish(event: PaymentExternalEventModel): Promise<void>;
}

export class PaymentEventHandlerService implements IPaymentEventHandlerService {
  static readonly key = 'PaymentEventHandlerService';
  static readonly inject = [
    Logger.key,
    StripeRepository.key,
    PaymentEventsRepository.key,
    PaymentEventStoreRepository.key,
  ] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly stripeRepository: IStripeRepository,
    private readonly paymentEventsRepository: IPaymentEventsRepository,
    private readonly paymentEventStoreRepository: IPaymentEventStoreRepository,
  ) {}

  public async TranslateAndPublish(event: PaymentExternalEventModel): Promise<void> {
    this.logger.info({ message: 'Processing External payment event', context: { event } });

    const paymentEvent = this.stripeRepository.translateEvent(event);
    this.logger.info({ message: 'Translated External payment event', context: { paymentEvent } });

    if (!paymentEvent || !['paymentFailed', 'paymentSucceeded'].includes(paymentEvent.type)) {
      this.logger.info({ message: 'Ignoring payment event', context: { paymentEvent } });
      return;
    }

    //TODO: what do we want to do here if externalCustomerId (which is mapped from customerId in Stripe) is not set.
    // setting customer when initiating payment is not mandatory so it doesn't make sense to enforce and kick up a fuss here...?
    let memberId = 'NO_MEMBER_ID';
    if (paymentEvent.externalCustomerId) {
      const items = await this.paymentEventStoreRepository.queryEventsByTypeAndObjectId(
        'customerCreated',
        paymentEvent.externalCustomerId,
      );
      if (items.length > 0) {
        memberId = items[0].pk.split('#')[1];
      }
    }

    switch (paymentEvent.type) {
      case 'paymentSucceeded':
        await this.paymentEventsRepository.publishPaymentSucceededEvent({
          currency: paymentEvent.currency,
          paymentIntentId: paymentEvent.paymentIntentId,
          created: paymentEvent.created,
          metadata: paymentEvent.metadata,
          amount: paymentEvent.amount,
          paymentMethodId: paymentEvent.paymentMethodId,
          memberId,
        });
        break;
      case 'paymentFailed':
        await this.paymentEventsRepository.publishPaymentFailedEvent({
          currency: paymentEvent.currency,
          paymentIntentId: paymentEvent.paymentIntentId,
          created: paymentEvent.created,
          metadata: paymentEvent.metadata,
          amount: paymentEvent.amount,
          paymentMethodId: paymentEvent.paymentMethodId,
          memberId,
        });
        break;
    }

    await this.paymentEventStoreRepository.writePaymentEvent(memberId, paymentEvent);
  }
}
