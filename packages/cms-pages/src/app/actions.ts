'use server';

import { cookies } from 'next/headers';

export async function updateBrand(brand: string) {
  cookies().set('selectedBrand', brand);
}

export async function getBrand() {
  return cookies().get('selectedBrand')?.value || 'BLC_UK';
}
