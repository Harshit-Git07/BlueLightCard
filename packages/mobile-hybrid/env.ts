import { BrandToken } from '@bluelightcard/shared-ui/tailwind';
import { z } from 'zod';

export const env = z
  .object({
    NEXT_APP_BRAND: z.enum([BrandToken.BLC, BrandToken.DDS]).optional(),
  })
  .parse(process.env);

export const BRAND = env.NEXT_APP_BRAND ?? BrandToken.BLC;
