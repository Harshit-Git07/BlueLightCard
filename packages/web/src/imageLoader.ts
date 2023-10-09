import { CDN_URL } from '@/global-vars';
import { ImageLoader } from 'next/image';

/**
 * Custom image loader that resolves to a image url with optimisation parameters
 * @TODO Change loader to resolve to cloudflare cdn-cgi optimisation url
 * @returns
 */
const loader: ImageLoader = ({ src, width, quality = 75 }) => {
  if (src.startsWith(CDN_URL)) {
    const IMAGE_OPTIMISATION_URL = `${CDN_URL}/cdn-cgi/image`;
    return `${IMAGE_OPTIMISATION_URL}/width=${width},quality=${quality},format=auto/${src}`;
  }

  const optimiseParams = `?width=${width}&quality=${quality}`;
  const srcWithSlash = src.substring(0, 1) === '/' ? src : `/${src}`;
  const _src = `${src.startsWith('http') ? src : `_next/static${srcWithSlash}`}${optimiseParams}`;
  return process.env.STORYBOOK_ENV ? `${src}${optimiseParams}` : _src;
};

export default loader;
