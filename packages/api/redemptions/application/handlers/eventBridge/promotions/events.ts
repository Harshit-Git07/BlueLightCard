import { z } from 'zod';

import { NON_NEGATIVE_INT } from '@blc-mono/core/schemas/common';
import { PLATFORM_SCHEMA } from '@blc-mono/core/schemas/domain';
import { eventSchema } from '@blc-mono/core/schemas/event';
import { OPTIONAL_URL_SCHEMA } from '@blc-mono/core/schemas/utility';

export enum PromotionEvents {
  PROMOTION_UPDATED = 'promotion.updated',
}

export const PromotionUpdatedEventSchema = eventSchema(
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
);
export type PromotionUpdatedEvent = z.infer<typeof PromotionUpdatedEventSchema>;
export type PromotionUpdatedEventDetail = PromotionUpdatedEvent['detail'];
