import { z } from 'zod';

export const CompanyCategoryModel = z.object({
  companyId: z.string(),
  categoryId: z.string(),
});

export type CompanyCategory = z.infer<typeof CompanyCategoryModel>;
