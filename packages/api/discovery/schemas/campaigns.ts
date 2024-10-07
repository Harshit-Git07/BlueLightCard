import { z } from 'zod';

import { CampaignType } from '../application/services/campaigns';

export const CampaignEventsSchema = z.array(
  z.object({
    id: z.string(),
    campaignType: z.enum([CampaignType.ThankYouCampaign, CampaignType.BlackFriday]),
    content: z.object({
      imageURL: z.string().optional(),
      iframeURL: z.string().optional(),
    }),
    startDate: z.string(),
    endDate: z.string(),
  }),
);
