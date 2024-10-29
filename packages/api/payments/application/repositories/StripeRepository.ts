import Stripe from 'stripe';

import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';

import { PaymentEvent } from '../models/paymentEvent';
import { PaymentExternalEventModel } from '../services/paymentEvents/PaymentEventsHandlerService';

import { ISecretRepository, SecretRepository } from './SecretRepository';

export type Currency = 'gbp' | 'aud';

export type PaymentIntentCreated = {
  paymentIntentId: string;
  clientSecret: string;
  publishableKey: string;
};

export interface IStripeRepository {
  createPaymentIntent(
    idempotencyKey: string,
    currency: Currency,
    customerId: string,
    amount: number,
    metadata: Record<string, string>,
    description?: string,
  ): Promise<PaymentIntentCreated>;
  createEphemeralKey(customerId: string): Promise<string>;
  createCustomer(name: string, metadata: Record<string, string>): Promise<string>;
  translateEvent(event: PaymentExternalEventModel): PaymentEvent | null;
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

  public createEphemeralKey = async (customerId: string): Promise<string> => {
    const client = await this.client();

    const response = await client.ephemeralKeys.create({ customer: customerId }, { apiVersion: '2013-08-12' });

    if (!response.secret) throw new Error('No secret returned from stripe for Ephemeral Key');

    return response.secret;
  };

  public createCustomer = async (name: string, metadata: Record<string, string>): Promise<string> => {
    const client = await this.client();

    const response = await client.customers.create({
      name,
      metadata,
    });

    return response.id;
  };

  public createPaymentIntent = async (
    idempotencyKey: string,
    currency: Currency,
    customerId: string,
    amount: number,
    metadata: Record<string, string>,
    description?: string,
  ): Promise<PaymentIntentCreated> => {
    const client = await this.client();

    //TODO: do we use setup_future_usage for saving payment method??
    try {
      const paymentIntent = await client.paymentIntents.create(
        {
          customer: customerId,
          description,
          amount: amount,
          currency,
          automatic_payment_methods: {
            enabled: true,
          },
          metadata: metadata,
        },
        {
          idempotencyKey,
        },
      );

      if (!paymentIntent.client_secret) throw new Error('No client secret returned from stripe for payment method');

      return {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
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

  public translateEvent = (event: PaymentExternalEventModel): PaymentEvent | null => {
    switch (event.type) {
      case 'payment_intent.created':
        return {
          eventId: event.id,
          externalCustomerId: event.data.object.customer,
          type: 'paymentInitiated',
          currency: event.data.object.currency,
          paymentIntentId: event.data.object.id,
          created: event.created,
          metadata: event.data.object.metadata,
          amount: event.data.object.amount,
        };
      case 'payment_intent.succeeded':
        return {
          eventId: event.id,
          externalCustomerId: event.data.object.customer,
          type: 'paymentSucceeded',
          currency: event.data.object.currency,
          paymentIntentId: event.data.object.id,
          created: event.created,
          metadata: event.data.object.metadata,
          amount: event.data.object.amount,
          paymentMethodId: event.data.object.payment_method,
        };
      case 'payment_intent.payment_failed':
        return {
          eventId: event.id,
          externalCustomerId: event.data.object.customer,
          type: 'paymentFailed',
          currency: event.data.object.currency,
          paymentIntentId: event.data.object.id,
          created: event.created,
          metadata: event.data.object.metadata,
          amount: event.data.object.amount,
          paymentMethodId: event.data.object.payment_method,
        };
      case 'customer.created':
        return {
          eventId: event.id,
          type: 'customerCreated',
          externalCustomerId: event.data.object.id,
          created: event.created,
          metadata: event.data.object.metadata,
          name: event.data.object.name,
          email: event.data.object.email,
        };
      default:
        return null;
    }
  };
}
