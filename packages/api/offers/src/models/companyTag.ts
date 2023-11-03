import { z } from 'zod';

export const CompanyTagModel = z.object({
  companyId: z.string(),
  tagId: z.string(),
});

export type CompanyTag = z.infer<typeof CompanyTagModel>;
