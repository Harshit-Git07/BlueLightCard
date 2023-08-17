import { FC } from 'react';
import NextImage, { ImageLoader } from 'next/image';
import { ImageProps } from './types';

const imageLoader: ImageLoader = ({ src, width, quality }) => {
  const optimiseParams = `?width=${width}&quality=${quality}`;
  const srcWithSlash = src.substring(0, 1) === '/' ? src : `/${src}`;
  const _src = `${src.startsWith('http') ? src : `_next/static${srcWithSlash}`}${optimiseParams}`;
  return process.env.STORYBOOK_ENV ? `${src}${optimiseParams}` : _src;
};

const Image: FC<ImageProps> = ({ src, alt, responsive = true, ...props }) => {
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
