import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { NON_NEGATIVE_INT } from '@blc-mono/core/schemas/common';

export const PostSpotifyModel = createZodNamedType(
  'PostSpotifyModel',
  z.object({
    companyId: NON_NEGATIVE_INT,
    offerId: NON_NEGATIVE_INT,
    memberId: z.string(),
    url: z.string(),
  }),
);

export type PostSpotifyModel = z.infer<typeof PostSpotifyModel>;
