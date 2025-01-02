import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose';

import { PaymentObjectEventDetail } from '@blc-mono/core/schemas/payments';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { PaymentsStackEnvironmentKeys } from '@blc-mono/payments/infrastructure/constants/environment';

export interface IDwhRepository {
  logPaymentIntent(event: PaymentObjectEventDetail): Promise<void>;
  logPaymentFailed(event: PaymentObjectEventDetail): Promise<void>;
  logPaymentSucceeded(event: PaymentObjectEventDetail): Promise<void>;
}

/**
 * Repository for logging events to the Data Warehouse
 */
export class DwhRepository implements IDwhRepository {
  static key = 'DwhRepository' as const;

  private readonly client = new FirehoseClient();

  async logPaymentIntent(event: PaymentObjectEventDetail): Promise<void> {
    const command = new PutRecordCommand({
      DeliveryStreamName: getEnv(PaymentsStackEnvironmentKeys.DWH_PAYMENT_STREAM_NAME),
      Record: {
        Data: Buffer.from(
          JSON.stringify({
            currency: event.currency,
            payment_intent_id: event.paymentIntentId,
            amount: event.amount,
            event_time: new Date(event.created).toISOString(),
            member_id: event.member?.id,
            event_type: 'payment_intent',
          }),
        ),
      },
    });
    await this.client.send(command);
  }

  async logPaymentFailed(event: PaymentObjectEventDetail): Promise<void> {
    const command = new PutRecordCommand({
      DeliveryStreamName: getEnv(PaymentsStackEnvironmentKeys.DWH_PAYMENT_STREAM_NAME),
      Record: {
        Data: Buffer.from(
          JSON.stringify({
            currency: event.currency,
            payment_intent_id: event.paymentIntentId,
            amount: event.amount,
            event_time: new Date(event.created).toISOString(),
            member_id: event.member?.id,
            payment_method_id: event.paymentMethodId,
            event_type: 'payment_failed',
          }),
        ),
      },
    });
    await this.client.send(command);
  }

  async logPaymentSucceeded(event: PaymentObjectEventDetail): Promise<void> {
    const command = new PutRecordCommand({
      DeliveryStreamName: getEnv(PaymentsStackEnvironmentKeys.DWH_PAYMENT_STREAM_NAME),
      Record: {
        Data: Buffer.from(
          JSON.stringify({
            currency: event.currency,
            payment_intent_id: event.paymentIntentId,
            amount: event.amount,
            event_time: new Date(event.created).toISOString(),
            member_id: event.member?.id,
            payment_method_id: event.paymentMethodId,
            event_type: 'payment_succeeded',
          }),
        ),
      },
    });
    await this.client.send(command);
  }
}
