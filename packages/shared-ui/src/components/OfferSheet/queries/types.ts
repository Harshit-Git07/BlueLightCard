import { z } from 'zod';

export const RedemptionTypeSchema = z.object({
  data: z.object({
    redemptionType: z.string(),
  }),
});
