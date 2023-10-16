import { z } from 'zod';

export const PostAffiliateModel = z.object({
  affiliateUrl: z.string(),
  memberId: z.string(),
});

(PostAffiliateModel as any)._ModelName = 'PostAffiliateModel';
export type PostAffiliateModel = z.infer<typeof PostAffiliateModel>;
