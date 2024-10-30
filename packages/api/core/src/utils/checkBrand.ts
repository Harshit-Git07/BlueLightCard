import { BLC_AU_BRAND, BLC_UK_BRAND, DDS_UK_BRAND } from "../constants/common";
import { BRAND_SCHEMA } from "../schemas/common";

export function getBrandFromEnv() {
  return BRAND_SCHEMA.parse(process.env.BRAND);
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