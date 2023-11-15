import { z } from 'zod';

export const PostSpotifyModel = z.object({
  platform: z.string(),
  companyId: z.number(),
  offerId: z.number(),
  memberId: z.string(),
  url: z.string(),
});

(PostSpotifyModel as any)._ModelName = 'PostSpotifyModel';
export type PostSpotifyModel = z.infer<typeof PostSpotifyModel>;
