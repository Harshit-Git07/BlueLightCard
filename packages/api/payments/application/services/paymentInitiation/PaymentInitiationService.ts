import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';

import { IStripeRepository, StripeRepository } from '../../repositories/StripeRepository';

export type PaymentInitiationResult = {
  paymentIntentId: string;
  clientSecret: string;
  publishableKey: string;
};

export interface IPaymentInitiationService {
  InitiatePayment(
    idempotencyKey: string,
    amount: number,
    metadata: Record<string, string>,
  ): Promise<PaymentInitiationResult>;
}

export class PaymentInitiationService implements IPaymentInitiationService {
  static readonly key = 'PaymentIntentService';
  static readonly inject = [Logger.key, StripeRepository.key] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly stripeRepository: IStripeRepository,
  ) {}

  public async InitiatePayment(
    idempotencyKey: string,
    amount: number,
    metadata: Record<string, string>,
  ): Promise<PaymentInitiationResult> {
    const paymentInitiation = await this.stripeRepository.createPaymentIntent(idempotencyKey, amount, metadata);

    //TODO: error handling
    //TODO: raise event or listen to Stripe one?
    return paymentInitiation;
  }
}
