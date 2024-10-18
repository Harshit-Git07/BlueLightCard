import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const PostSpotifyModel = createZodNamedType(
  'PostSpotifyModel',
  z.object({
    companyId: z.coerce.string(),
    offerId: z.coerce.string(),
    memberId: z.string(),
    url: z.string(),
  }),
);

export type PostSpotifyModel = z.infer<typeof PostSpotifyModel>;
