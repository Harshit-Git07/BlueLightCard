import { z } from 'zod';

import { NON_NEGATIVE_INT } from '@blc-mono/core/schemas/common';
import { PLATFORM_SCHEMA } from '@blc-mono/core/schemas/domain';
import { eventSchema } from '@blc-mono/core/schemas/event';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  IOfferCreatedService,
  OfferCreatedService,
} from '@blc-mono/redemptions/application/services/dataSync/offer/OfferCreatedService';
import { RedemptionsDatasyncEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/datasync';

import { EventBridgeController, UnknownEventBridgeEvent } from '../EventBridgeController';

const OfferCreatedEventDetailSchema = z.object({
  offerId: NON_NEGATIVE_INT,
  companyId: NON_NEGATIVE_INT,
  offerUrl: z.string().nullable(),
  offerCode: z.string().nullable(),
  offerType: NON_NEGATIVE_INT,
  platform: PLATFORM_SCHEMA,
});

const OfferCreatedEventSchema = eventSchema(
  RedemptionsDatasyncEvents.OFFER_CREATED,
  z.string(),
  OfferCreatedEventDetailSchema,
);

export type OfferCreatedEvent = z.infer<typeof OfferCreatedEventSchema>;
export type OfferCreatedEventDetail = z.infer<typeof OfferCreatedEventDetailSchema>;

export class OfferCreatedController extends EventBridgeController<OfferCreatedEvent> {
  static readonly inject = [Logger.key, OfferCreatedService.key] as const;

  constructor(
    protected logger: ILogger,
    protected offerCreatedService: IOfferCreatedService,
  ) {
    super();
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<OfferCreatedEvent, Error> {
    return this.zodParseRequest(request, OfferCreatedEventSchema);
  }

  protected async handle(event: OfferCreatedEvent): Promise<void> {
    await this.offerCreatedService.createOffer(event);
  }
}
