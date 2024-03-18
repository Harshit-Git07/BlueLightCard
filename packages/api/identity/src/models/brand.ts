import {z} from 'zod';

export const BrandModel = z.object({
  pk: z.string(),
  sk: z.string(),
  legacy_id: z.number()
}).transform(brand => ({
  legacyId: brand.legacy_id,
  uuid: brand.pk.replace('MEMBER#', ''),
  brand: brand.sk.replace('BRAND#', ''),
}));

(BrandModel as any)._ModelName = 'BrandModel'

export type BrandModel = z.infer<typeof BrandModel>;
