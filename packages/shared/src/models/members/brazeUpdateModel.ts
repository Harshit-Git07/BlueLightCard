import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

const AttributeValue = z.union([z.string(), z.number(), z.boolean()]);

export const BrazeUpdateModel = createZodNamedType(
  'BrazeUpdateModel',
  z.object({
    attributes: z.record(AttributeValue),
  }),
);

export type BrazeUpdateModel = z.infer<typeof BrazeUpdateModel>;
export type BrazeUpdateAttributeValue = z.infer<typeof AttributeValue>;
