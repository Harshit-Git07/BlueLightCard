import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/src/extensions/apiGatewayExtension/agModelGenerator';

export const OffersHomepageModel = createZodNamedType(
  'OffersHomepageModel',
  z.object({
    deals: z.array(z.any()),
    featured: z.array(z.any()),
    flexible: z.array(z.any()),
    marketplace: z.array(z.any()),
  }),
);

export type OffersHomepage = z.infer<typeof OffersHomepageModel>;
