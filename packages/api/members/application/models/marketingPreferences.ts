import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const MarketingPreferencesModel = createZodNamedType(
  'MarketingPreferencesModel',
  z.object({
    spam: z.string().nullable(),
    moreSpam: z.string().nullable(),
  }),
);

export type MarketingPreferencesModel = z.infer<typeof MarketingPreferencesModel>;
