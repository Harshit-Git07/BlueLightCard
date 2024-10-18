import Stripe from 'stripe';

import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { PaymentsStackEnvironmentKeys } from '@blc-mono/payments/infrastructure/constants/environment';

import { ISecretRepository, SecretRepository } from './SecretRepository';

export type PaymentIntentCreated = {
  paymentIntentId: string;
  clientSecret: string;
  publishableKey: string;
};

export interface IStripeRepository {
  createPaymentIntent(
    idempotencyKey: string,
    amount: number,
    metadata: Record<string, string>,
  ): Promise<PaymentIntentCreated>;
}

export class StripeRepository implements IStripeRepository {
  static readonly key = 'StripeRepository' as const;
  static readonly inject = [Logger.key, SecretRepository.key] as const;

  private stripeClient: Stripe | undefined;
  private stripePublishableKey: string | undefined;

  constructor(
    private readonly logger: ILogger,
    private readonly secretRepository: ISecretRepository,
  ) {}

  private client = async (): Promise<Stripe> => {
    if (this.stripeClient) return this.stripeClient;

    const { secretKey } = await this.secretRepository.fetchStripeSecrets();

    this.stripeClient = new Stripe(secretKey);
    return this.stripeClient;
  };

  private fetchStripePublishableKey = async (): Promise<string> => {
    if (this.stripePublishableKey) return this.stripePublishableKey;

    const { publishableKey } = await this.secretRepository.fetchStripeSecrets();

    this.stripePublishableKey = publishableKey;
    return this.stripePublishableKey;
  };

  public createPaymentIntent = async (
    idempotencyKey: string,
    amount: number,
    metadata: Record<string, string>,
  ): Promise<PaymentIntentCreated> => {
    const client = await this.client();

    //TODO: error handling
    //TODO: how to do idempotency?
    //TODO: attach customer and use setup_future_usage for saving payment method??
    try {
      const paymentIntent = await client.paymentIntents.create({
        amount: amount,
        currency: getEnv(PaymentsStackEnvironmentKeys.CURRENCY_CODE),
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: metadata,
      });

      return {
        paymentIntentId: paymentIntent.id,
        //TOOD: throw if client secret is falsy?
        clientSecret: paymentIntent.client_secret || '',
        publishableKey: await this.fetchStripePublishableKey(),
      };
    } catch (err) {
      this.logger.error({
        message: 'Error creating payment intent',
        error: err,
      });
      throw err;
    }
  };
}
