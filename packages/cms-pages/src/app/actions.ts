'use server';

import { APP_BRAND } from '@/lib/env';
import { BRAND } from '@bluelightcard/shared-ui/types';
import { cookies } from 'next/headers';

type BrandKeys = BRAND.BLC_UK | BRAND.BLC_AU | BRAND.DDS_UK;
type BrandMap = Record<BrandKeys, keyof typeof BRAND>;

const appBrand = APP_BRAND as BrandKeys;

export async function updateBrand(brand: string) {
  cookies().set('selectedBrand', brand);
}

export async function getBrand() {
  return (
    (
      {
        'blc-uk': 'BLC_UK',
        'blc-au': 'BLC_AU',
        'dds-uk': 'DDS_UK',
      } as BrandMap
    )[appBrand] ?? 'BLC_UK'
  );
}
