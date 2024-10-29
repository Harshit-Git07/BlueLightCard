import { z } from 'zod';

import { eventSchema } from '@blc-mono/core/schemas/event';
import { Result } from '@blc-mono/core/types/result';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  IPaymentEventHandlerService,
  PaymentEventHandlerService,
} from '@blc-mono/payments/application/services/paymentEvents/PaymentEventsHandlerService';
import { PaymentExternalEvent } from '@blc-mono/payments/application/services/paymentEvents/PaymentEventsHandlerService';
import { PaymentsStackEnvironmentKeys } from '@blc-mono/payments/infrastructure/constants/environment';

import { EventBridgeController, UnknownEventBridgeEvent } from '../EventBridgeController';

const StripePaymentEventSchema = eventSchema(
  { prefix: getEnv(PaymentsStackEnvironmentKeys.STRIPE_EVENT_SOURCE_PREFIX) },
  z.string(),
  PaymentExternalEvent,
);
export type StripePaymentEvent = z.infer<typeof StripePaymentEventSchema>;

export class StripeEventsController extends EventBridgeController<StripePaymentEvent> {
  static readonly inject = [Logger.key, PaymentEventHandlerService.key] as const;

  constructor(
    logger: ILogger,
    private readonly paymentEventHandlerService: IPaymentEventHandlerService,
  ) {
    super(logger);
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<StripePaymentEvent, Error> {
    // TODO: Remove this log message after migration
    this.logger.info({
      message: 'Parsing request',
      context: {
        request,
      },
    });
    return this.zodParseRequest(request, StripePaymentEventSchema);
  }

  protected async handle(event: StripePaymentEvent): Promise<void> {
    await this.paymentEventHandlerService.TranslateAndPublish(event.detail);
  }
}
