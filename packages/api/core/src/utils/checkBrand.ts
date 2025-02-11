import { BLC_AU_BRAND, BLC_UK_BRAND, DDS_UK_BRAND } from "../constants/common";
import { Brand, BRAND_SCHEMA } from '../schemas/common';

export function getBrandFromEnv(): Brand {
  const parseResult = BRAND_SCHEMA.safeParse(process.env.BRAND);
  if (!parseResult.success) return 'BLC_UK';

  return parseResult.data;
}

export function isDdsUkBrand() {
  return getBrandFromEnv() === DDS_UK_BRAND;
}

export function isBlcUkBrand() {
  return getBrandFromEnv() === BLC_UK_BRAND;
}

export function isBlcAuBrand() {
  return getBrandFromEnv() === BLC_AU_BRAND;
}
