import { z } from 'zod';

import { NON_NEGATIVE_INT } from '@blc-mono/core/schemas/common';
import { PLATFORM_SCHEMA } from '@blc-mono/core/schemas/domain';
import { eventSchema } from '@blc-mono/core/schemas/event';
import { RedemptionsDatasyncEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/datasync';

const offerSchema = z.object({
  offerId: NON_NEGATIVE_INT,
  companyId: NON_NEGATIVE_INT,
  offerUrl: z.string(),
  offerCode: z.string(),
  offerType: NON_NEGATIVE_INT,
  platform: PLATFORM_SCHEMA,
});

export const OfferEventSchema = {
  [RedemptionsDatasyncEvents.OFFER_CREATED]: eventSchema(
    RedemptionsDatasyncEvents.OFFER_CREATED,
    z.string(),
    offerSchema,
  ),
  [RedemptionsDatasyncEvents.OFFER_UPDATED]: eventSchema(
    RedemptionsDatasyncEvents.OFFER_UPDATED,
    z.string(),
    offerSchema,
  ),
};
export const OfferCreatedEventSchema = OfferEventSchema[RedemptionsDatasyncEvents.OFFER_CREATED];
export type OfferCreatedEvent = z.infer<typeof OfferCreatedEventSchema>;
export type OfferCreatedEventDetail = OfferCreatedEvent['detail'];
export const OfferUpdatedEventSchema = OfferEventSchema[RedemptionsDatasyncEvents.OFFER_UPDATED];
export type OfferUpdatedEvent = z.infer<typeof OfferUpdatedEventSchema>;
export type OfferUpdatedEventDetail = OfferUpdatedEvent['detail'];
