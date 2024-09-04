export const BLC_UK_BRAND = 'BLC_UK';
export const BLC_AU_BRAND = 'BLC_AU';
export const DDS_UK_BRAND = 'DDS_UK';
export const BRANDS = [BLC_UK_BRAND, BLC_AU_BRAND, DDS_UK_BRAND] as const;

/**
 * lowercase with hyphen mapping - S3 bucket names must be lowercase and underscore not allowed
 */
export const MAP_BRAND = {
  'BLC_UK': 'blc-uk',
  'BLC_AU': 'blc-au',
  'DDS_UK': 'dds-uk'
} as const;
