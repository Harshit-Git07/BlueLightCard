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
 * Generate the base path for the Offers API for a V5 API request.
 * Considers the current brand and has a flag to determine whether to use the CMS based endpoints or legacy.
 *
 * @param useCms Whether to use the CMS based endpoints
 * @returns {string} The base Offers API path for the current brand
 */
export const getBrandedOffersPath = (useCms: boolean = false): string => {
  const brand = process.env.NEXT_PUBLIC_APP_BRAND;

  const v5_region = brand === 'blc-au' ? 'au' : 'eu';
  const suffix = brand === 'dds-uk' ? '/dds' : '';

  return `/${v5_region}/offers${suffix}${useCms ? '/v2/v2' : ''}`;
};
