import {z} from 'zod';
import { getPrefix } from '../../../core/src/utils/getPrefix';

export const BrandModel = z.object({
    pk: z.string(),
    sk: z.string(),
    legacy_id: z.number()
}).transform(brand => ({
  brand: brand.sk.replace('BRAND#', ''),
  prefix: getPrefix(brand.sk.replace('BRAND#', '')),
  legacyId: brand.legacy_id,
}));

(BrandModel as any)._ModelName = 'BrandModel'

export type BrandModel = z.infer<typeof BrandModel>;
