import { FC } from 'react';
import NextImage, { ImageLoader } from 'next/image';

export type Props = {
  src: string;
  alt: string;
  responsive?: boolean;
  onError?: () => void;
  [key: string]: string | boolean | number | (() => void) | undefined;
};

const Image: FC<Props> = ({ src, alt, responsive = true, ...props }) => {
  const imageLoader: ImageLoader = ({ src, width, quality = 75 }) => {
    if (src.startsWith('https://cdn.bluelightcard.co.uk')) {
      const IMAGE_OPTIMISATION_URL = 'https://cdn.bluelightcard.co.uk/cdn-cgi/image';
      const fullUrl = `${IMAGE_OPTIMISATION_URL}/width=${width},quality=${quality},format=webp/${src}`;
      return fullUrl;
    }

    const optimiseParams = `?width=${width}&quality=${quality}`;
    const srcWithSlash = src.substring(0, 1) === '/' ? src : `/${src}`;
    const _src = `${src.startsWith('http') ? src : `_next/static${srcWithSlash}`}${optimiseParams}`;
    return process.env.STORYBOOK_ENV ? `${src}${optimiseParams}` : _src;
  };

  return (
    <NextImage
      className="object-cover"
      src={src}
      alt={alt ?? src}
      fill={responsive}
      placeholder="blur"
      loader={imageLoader}
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPs7+9bAQAFtwJW4mO4owAAAABJRU5ErkJggg=="
      {...props}
    />
  );
};

export default Image;
