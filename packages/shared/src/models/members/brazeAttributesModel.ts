import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

export const BrazeAttributesModel = createZodNamedType(
  'BrazeAttributesModel',
  z.object({
    attributes: z.string().array().default([]),
  }),
);

export type BrazeAttributesModel = z.infer<typeof BrazeAttributesModel>;
