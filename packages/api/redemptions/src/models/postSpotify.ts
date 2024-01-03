import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/core/src/extensions/apiGatewayExtension/agModelGenerator';

export const PostSpotifyModel = createZodNamedType(
  'PostSpotifyModel',
  z.object({
    platform: z.string(),
    companyId: z.number(),
    offerId: z.number(),
    memberId: z.string(),
    url: z.string(),
  }),
);

export type PostSpotifyModel = z.infer<typeof PostSpotifyModel>;
