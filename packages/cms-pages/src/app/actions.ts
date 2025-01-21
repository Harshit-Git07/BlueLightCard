'use server';

import { APP_BRAND } from '@/lib/env';
import { cookies } from 'next/headers';

export async function updateBrand(brand: string) {
  cookies().set('selectedBrand', brand);
}

export async function getBrand() {
  return (
    (
      {
        'blc-uk': 'BLC_UK',
        'blc-au': 'BLC_AU',
        'dds-uk': 'DDS',
      } as const
    )[APP_BRAND] ?? APP_BRAND
  );
}
