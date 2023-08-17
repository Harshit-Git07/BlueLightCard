import { ImageLoader } from 'next/image';

/**
 * Custom image loader that resolves to a image url with optimisation parameters
 * @TODO Change loader to resolve to cloudflare cdn-cgi optimisation url
 * @returns
 */
const loader: ImageLoader = ({ src, width, quality }) => {
  const path = src.startsWith('/') ? src.substring(1) : src;
  return `${path}?width=${width}&quality=${quality}`;
};

export default loader;
