const mappings: { [key: string]: number } = {
  'blc-uk': 1,
  'blc-aus': 1,
  dds: 2,
};

// Used in search, blc uk and aus can be the same because they will be in different regions
export const getSiteIdFromBrandId = (brandId: string) => {
  const siteId = mappings[brandId] ?? 0;
  return siteId;
};
