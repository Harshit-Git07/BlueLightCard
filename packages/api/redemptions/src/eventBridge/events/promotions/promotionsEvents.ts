import { z } from 'zod';

import { DATE_YYYY_MM_DD_SCHEMA, NON_NEGATIVE_INT } from '../../../schemas/common';
import { PLATFORM_SCHEMA } from '../../../schemas/domain';
import { OPTIONAL_URL_SCHEMA } from '../../../schemas/utility';
import { EventSchema, eventSchema } from '../../schemas/event';

export enum PromotionEvents {
  PROMOTION_UPDATED = 'promotion.updated',
}

export const PromotionEventSchema = {
  [PromotionEvents.PROMOTION_UPDATED]: eventSchema(
    PromotionEvents.PROMOTION_UPDATED,
    z.object({
      update: z.object({
        link: OPTIONAL_URL_SCHEMA.optional(),
      }),
      meta: z.object({
        platform: PLATFORM_SCHEMA,
        dependentEntities: z.array(
          z.object({
            type: z.literal('vault'),
            offerId: NON_NEGATIVE_INT,
            companyId: NON_NEGATIVE_INT,
          }),
        ),
      }),
    }),
  ),
} satisfies Record<PromotionEvents, EventSchema>;

export const PromotionUpdatedEventSchema = PromotionEventSchema[PromotionEvents.PROMOTION_UPDATED];
export type PromotionUpdatedEvent = z.infer<typeof PromotionUpdatedEventSchema>;
export type PromotionUpdatedEventDetail = PromotionUpdatedEvent['detail'];
