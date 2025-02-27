import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

export const PostRedeemModel = createZodNamedType(
  'PostRedeemModel',
  z.object({
    offerId: z.union([z.string(), z.number()]).transform((value) => String(value)),
    companyName: z.string(),
    offerName: z.string(),
  }),
);

export type PostRedeemModel = z.infer<typeof PostRedeemModel>;
