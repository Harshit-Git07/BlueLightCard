import { z } from 'zod';

import { NON_NEGATIVE_INT } from '@blc-mono/core/schemas/common';
import { eventSchema } from '@blc-mono/core/schemas/event';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  IOfferUpdatedService,
  OfferUpdatedService,
} from '@blc-mono/redemptions/application/services/dataSync/offer/OfferUpdatedService';
import { RedemptionsDatasyncEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/datasync';

import { EventBridgeController, UnknownEventBridgeEvent } from '../EventBridgeController';

const OfferUpdatedEventDetailSchema = z.object({
  offerId: NON_NEGATIVE_INT,
  companyId: NON_NEGATIVE_INT,
  offerUrl: z.string().nullable(),
  offerCode: z.string().nullable(),
  offerType: NON_NEGATIVE_INT,
});

const OfferUpdatedEventSchema = eventSchema(
  RedemptionsDatasyncEvents.OFFER_UPDATED,
  z.string(),
  OfferUpdatedEventDetailSchema,
);

export type OfferUpdatedEvent = z.infer<typeof OfferUpdatedEventSchema>;
export type OfferUpdatedEventDetail = z.infer<typeof OfferUpdatedEventDetailSchema>;

export class OfferUpdatedController extends EventBridgeController<OfferUpdatedEvent> {
  static readonly inject = [Logger.key, OfferUpdatedService.key] as const;

  constructor(
    logger: ILogger,
    protected offerUpdatedService: IOfferUpdatedService,
  ) {
    super(logger);
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<OfferUpdatedEvent, Error> {
    // TODO: Remove this log message after migration
    this.logger.info({
      message: 'Parsing request',
      context: {
        request,
      },
    });
    return this.zodParseRequest(request, OfferUpdatedEventSchema);
  }

  protected async handle(event: OfferUpdatedEvent): Promise<void> {
    await this.offerUpdatedService.updateOffer(event);
  }
}
