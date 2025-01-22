import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

export const CompanyInfoModel = createZodNamedType(
  'CompanyInfoModel',
  z.object({
    id: z.number().int(),
    name: z.string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    }),
    description: z.string(),
  }),
);

export type CompanyInfo = z.infer<typeof CompanyInfoModel>;
