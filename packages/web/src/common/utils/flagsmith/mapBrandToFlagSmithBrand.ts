import { BRANDS } from '@/types/brands.enum';

export const mapBrandToFlagsmithBrand = (brand: BRANDS) => brand.replace('-', '_');
