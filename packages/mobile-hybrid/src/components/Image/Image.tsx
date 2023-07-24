import { FC } from 'react';
import NextImage from 'next/image';
import { ImageProps } from './types';

const Image: FC<ImageProps> = ({ src, alt, responsive = true, ...props }) => {
  return (
    <NextImage
      className="object-cover"
      src={src}
      alt={alt ?? src}
      fill={responsive}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPs7+9bAQAFtwJW4mO4owAAAABJRU5ErkJggg=="
      {...props}
    />
  );
};

export default Image;
