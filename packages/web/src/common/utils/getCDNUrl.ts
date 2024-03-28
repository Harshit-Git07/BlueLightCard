import { CDN_URL } from '@/global-vars';

/**
 * Get CDN url - Converts a relative path to a CDN url into an absolute path
 * @param relativePath string - A relative path to the file in the CDN
 * @returns string - The CDN url as an absolute path
 */
const getCDNUrl = (relativePath: string) => {
  if (relativePath.startsWith('https')) {
    return relativePath;
  } else {
    return CDN_URL + (relativePath.startsWith('/') ? '' : '/') + relativePath;
  }
};

export default getCDNUrl;
