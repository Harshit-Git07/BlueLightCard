import { BLC_AUS, BLC_UK, DDS_UK } from './global-constants';

export function validateBrand(brandId: string) {
  return !(!brandId || ![BLC_UK, BLC_AUS, DDS_UK].includes(brandId));
}
