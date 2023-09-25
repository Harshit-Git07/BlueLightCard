/**
 * Get CDN url - Converts a relative path to a CDN url into an absolute path
 * @param relativePath string - A relative path to the file in the CDN
 * @returns string - The CDN url as an absolute path
 */
function getCDNUrl(relativePath: string) {
  const cdn = process.env.NEXT_PUBLIC_APP_CDN_URL ?? '';
  return cdn + (relativePath.startsWith('/') ? '' : '/') + relativePath;
}

export default getCDNUrl;
