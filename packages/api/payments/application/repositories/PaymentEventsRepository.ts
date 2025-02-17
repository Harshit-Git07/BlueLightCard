import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

import { PAYMENTS_EVENT_SOURCE, PaymentsEventDetailType } from '@blc-mono/core/constants/payments';
import { PaymentObjectEventDetail } from '@blc-mono/core/schemas/payments';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { PaymentsStackEnvironmentKeys } from '@blc-mono/payments/infrastructure/constants/environment';

export interface IPaymentEventsRepository {
  publishPaymentInitiatedEvent(detail: PaymentObjectEventDetail): Promise<void>;
  publishPaymentSucceededEvent(detail: PaymentObjectEventDetail): Promise<void>;
  publishPaymentFailedEvent(detail: PaymentObjectEventDetail): Promise<void>;
}

export class PaymentEventsRepository implements IPaymentEventsRepository {
  static readonly key = 'PaymentEventsRepository';

  public async publishPaymentInitiatedEvent(detail: PaymentObjectEventDetail): Promise<void> {
    const client = new EventBridgeClient();
    const command = new PutEventsCommand({
      Entries: [
        {
          Source: PAYMENTS_EVENT_SOURCE,
          DetailType: PaymentsEventDetailType.PAYMENT_INITIATED,
          Detail: JSON.stringify(detail satisfies PaymentObjectEventDetail),
          EventBusName: getEnv(PaymentsStackEnvironmentKeys.PAYMENTS_EVENT_BUS_NAME),
          Time: new Date(),
        },
      ],
    });
    await client.send(command);
  }

  public async publishPaymentSucceededEvent(detail: PaymentObjectEventDetail): Promise<void> {
    const client = new EventBridgeClient();
    const command = new PutEventsCommand({
      Entries: [
        {
          Source: PAYMENTS_EVENT_SOURCE,
          DetailType: PaymentsEventDetailType.PAYMENT_SUCCEEDED,
          Detail: JSON.stringify(detail satisfies PaymentObjectEventDetail),
          EventBusName: getEnv(PaymentsStackEnvironmentKeys.PAYMENTS_EVENT_BUS_NAME),
          Time: new Date(),
        },
      ],
    });
    await client.send(command);
  }

  public async publishPaymentFailedEvent(detail: PaymentObjectEventDetail): Promise<void> {
    const client = new EventBridgeClient();
    const command = new PutEventsCommand({
      Entries: [
        {
          Source: PAYMENTS_EVENT_SOURCE,
          DetailType: PaymentsEventDetailType.PAYMENT_FAILED,
          Detail: JSON.stringify(detail satisfies PaymentObjectEventDetail),
          EventBusName: getEnv(PaymentsStackEnvironmentKeys.PAYMENTS_EVENT_BUS_NAME),
          Time: new Date(),
        },
      ],
    });
    await client.send(command);
  }
}
