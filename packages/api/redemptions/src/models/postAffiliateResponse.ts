import { z } from 'zod';

export const PostAffiliateResponse = z.object({
    affiliateUrl: z.string(),
    memberId: z.string()
});

(PostAffiliateResponse as any)._ModelName = 'PostAffiliateResponse'

export type PostAffiliateResponse = z.infer<typeof PostAffiliateResponse>;