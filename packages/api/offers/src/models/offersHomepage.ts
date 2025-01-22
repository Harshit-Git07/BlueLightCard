import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

export const OffersHomepageModel = createZodNamedType(
  'OffersHomepageModel',
  z.object({
    deals: z.array(z.any()),
    featured: z.array(z.any()),
    flexible: z.array(z.any()),
    marketplace: z.array(z.any()),
  }),
);

export type OffersHomepage = z.infer<typeof OffersHomepageModel>;

export const CompanyMenuModel = createZodNamedType(
  'CompanyMenuModel',
  z.object({
    id: z.string(),
    name: z.string(),
  }),
);

export type CompanyMenu = z.infer<typeof CompanyMenuModel>;

export const CategoryMenuModel = createZodNamedType(
  'CategoryMenuModel',
  z.object({
    id: z.string(),
    name: z.string(),
  }),
);

export type CategoryMenu = z.infer<typeof CategoryMenuModel>;
