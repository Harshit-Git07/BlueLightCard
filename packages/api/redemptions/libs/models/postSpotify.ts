import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const PostSpotifyModel = createZodNamedType(
  'PostSpotifyModel',
  z.object({
    companyId: z.union([z.string(), z.number()]).transform((value) => String(value)),
    offerId: z.union([z.string(), z.number()]).transform((value) => String(value)),
    memberId: z.string(),
    url: z.string(),
  }),
);

export type PostSpotifyModel = z.infer<typeof PostSpotifyModel>;
