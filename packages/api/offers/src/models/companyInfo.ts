import { z } from 'zod';
import { createZodNamedType } from '../../../core/src/extensions/apiGatewayExtension/agModelGenerator';

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
