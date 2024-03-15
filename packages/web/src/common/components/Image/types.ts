import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';
import { ImageProps as NextImageProps } from 'next/image';

export type ImageProps = Omit<NextImageProps, 'loader' | 'blurDataURL' | 'placeholder'> & {
  src: string;
  alt?: string;
  responsive?: boolean;
};
