import { z } from 'zod';

import { NON_NEGATIVE_INT } from '@blc-mono/core/schemas/common';
import { PLATFORM_SCHEMA } from '@blc-mono/core/schemas/domain';
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
  offerUrl: z.string(),
  offerCode: z.string(),
  offerType: NON_NEGATIVE_INT,
  platform: PLATFORM_SCHEMA,
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
    protected logger: ILogger,
    protected offerUpdatedService: IOfferUpdatedService,
  ) {
    super();
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<OfferUpdatedEvent, Error> {
    return this.zodParseRequest(request, OfferUpdatedEventSchema);
  }

  protected async handle(event: OfferUpdatedEvent): Promise<void> {
    await this.offerUpdatedService.updateOffer(event);
  }
}
