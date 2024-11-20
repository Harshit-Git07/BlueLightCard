import { v4 as uuidv4 } from 'uuid';

import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { PaymentsStackEnvironmentKeys } from '@blc-mono/payments/infrastructure/constants/environment';

import { UserContext } from '../../models/postPaymentInitiation';
import { IPaymentEventsRepository, PaymentEventsRepository } from '../../repositories/PaymentEventsRepository';
import {
  IPaymentEventStoreRepository,
  PaymentEventStoreRepository,
} from '../../repositories/PaymentEventStoreRepository';
import { Currency, IStripeRepository, StripeRepository } from '../../repositories/StripeRepository';

export type PaymentInitiationResult = {
  paymentIntentId: string;
  clientSecret: string;
  publishableKey: string;
  externalCustomer: string;
};

export interface IPaymentInitiationService {
  InitiatePayment(
    idempotencyKey: string,
    user: UserContext,
    amount: number,
    metadata: Record<string, string>,
    description?: string,
  ): Promise<PaymentInitiationResult>;
}

export class PaymentInitiationService implements IPaymentInitiationService {
  static readonly key = 'PaymentIntentService';
  static readonly inject = [
    Logger.key,
    StripeRepository.key,
    PaymentEventStoreRepository.key,
    PaymentEventsRepository.key,
  ] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly stripeRepository: IStripeRepository,
    private readonly paymentEventStoreRepository: IPaymentEventStoreRepository,
    private readonly paymentEventsRepository: IPaymentEventsRepository,
  ) {}

  async createExternalCustomerIfNotExist({ memberId, name, brazeExternalId }: UserContext): Promise<string> {
    const items = await this.paymentEventStoreRepository.queryPaymentEventsByMemberIdAndEventType(
      memberId,
      'customerCreated',
    );

    if (items.length > 0) {
      const stripeCustomerId = items[0].objectId;
      this.logger.info({
        message: 'Stripe customer already exists for member',
        context: { memberId, stripeCustomerId },
      });
      return stripeCustomerId;
    }

    const metadata = { memberId, name, brazeExternalId };

    const stripeCustomerId = await this.stripeRepository.createCustomer(name, metadata);

    this.logger.info({ message: 'Created Stripe customer for member', context: { memberId, stripeCustomerId } });

    await this.paymentEventStoreRepository.writePaymentEvent(memberId, {
      type: 'customerCreated',
      externalCustomerId: stripeCustomerId,
      name,
      metadata,
      eventId: uuidv4(),
      created: new Date().getTime(),
    });

    return stripeCustomerId;
  }

  public async InitiatePayment(
    idempotencyKey: string,
    user: UserContext,
    amount: number,
    metadata: Record<string, string>,
    description?: string,
  ): Promise<PaymentInitiationResult> {
    const memberId = user.memberId;

    const customerid = await this.createExternalCustomerIfNotExist(user);

    const currency = getEnv(PaymentsStackEnvironmentKeys.CURRENCY_CODE).toLowerCase() as Currency;

    const metadataToUse = { ...metadata, memberId, brazeExternalId: user.brazeExternalId };
    const paymentInitiation = await this.stripeRepository.createPaymentIntent(
      idempotencyKey,
      currency,
      customerid,
      amount,
      metadataToUse,
      description,
    );

    this.logger.info({ message: 'Payment Initiated', context: { memberId, paymentInitiation } });

    await this.paymentEventsRepository.publishPaymentInitiatedEvent({
      member: { id: user.memberId, brazeExternalId: user.brazeExternalId, name: user.name },
      amount,
      metadata: metadataToUse,
      created: new Date().getTime(),
      paymentIntentId: paymentInitiation.paymentIntentId,
      currency,
    });

    await this.paymentEventStoreRepository.writePaymentEvent(memberId, {
      eventId: uuidv4(),
      type: 'paymentInitiated',
      currency,
      paymentIntentId: paymentInitiation.paymentIntentId,
      created: new Date().getTime(),
      metadata: metadataToUse,
      amount,
      externalCustomerId: customerid,
    });

    return { ...paymentInitiation, externalCustomer: customerid };
  }
}
