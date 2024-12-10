/**
 * Trims everything in a URL up to the path and query params.
 *
 * Example:
 * - `https://www.foo.com/bar.php?q=123` becomes `/bar.php?q=123`
 * @param url URL to parse path from
 * @returns Parsed path
 */
export const getPathFromUrl = (url: string): string => {
  const parsedUrl = new URL(url);
  return parsedUrl.pathname + parsedUrl.search;
};

/**
 * Retrieve the region and suffix for constructing an API path based on the current brand.
 * Uses the `NEXT_PUBLIC_APP_BRAND` environment variable to determine these values.
 *
 * @returns {[string, string]} A tuple where the first element is the V5 region
 * ('au' or 'eu') and the second element is the suffix ('/dds' or '').
 */
const getBrandedPathData = (): [string, string] => {
  const brand = process.env.NEXT_PUBLIC_APP_BRAND;

  const region = brand === 'blc-au' ? 'au' : 'eu';
  const brandSuffix = brand === 'dds-uk' ? '/dds' : '';

  return [region, brandSuffix];
};

/**
 * Generate the base path for the Offers API for a V5 API request.
 * Considers the current brand.
 *
 * @param useCms Whether to use the CMS based endpoints as opposed to legacy.
 * @returns {string} The base Offers API path for the current brand
 */
export const getBrandedOffersPath = (useCms = false): string => {
  const [region, brandSuffix] = getBrandedPathData();

  return `/${region}/offers${brandSuffix}${useCms ? '/v2/v2' : ''}`;
};

/**
 * Generate the base path for the Redemptions API for a V5 API request.
 * Considers the current brand.
 *
 * @returns {string} The base Redemptions API path for the current brand
 */
export const getBrandedRedemptionsPath = (): string => {
  const [region, brandSuffix] = getBrandedPathData();

  return `/${region}/redemptions${brandSuffix}`;
};

/**
 * Generate the base path for the Identity API for a V5 API request.
 * Considers the current brand.
 *
 * @returns {string} The base Identity API path for the current brand
 */
export const getBrandedIdentityPath = (): string => {
  const [region] = getBrandedPathData();

  return `/${region}/identity`;
};
