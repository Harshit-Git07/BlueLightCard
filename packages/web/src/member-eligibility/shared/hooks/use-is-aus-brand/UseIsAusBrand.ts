import { useMemo } from 'react';
import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';

export const useIsAusBrand = (): boolean => {
  return useMemo(() => BRAND === BRANDS.BLC_AU, []);
};
