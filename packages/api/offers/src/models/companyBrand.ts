import { z } from 'zod';

export const CompanyBrandModel = z.object({
  companyId: z.string(),
  brandId: z.string(),
});

export type CompanyBrand = z.infer<typeof CompanyBrandModel>;
