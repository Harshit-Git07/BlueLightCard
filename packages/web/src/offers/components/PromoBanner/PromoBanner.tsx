import React from 'react';
import Link from '@/components/Link/Link';
import Image from '@/components/Image/Image';
import { PromoBannerProps } from './types';

const PromoBanner: React.FC<PromoBannerProps> = ({ image, href, id, onClick }) => {
  return (
    <button className="w-full relative" onClick={onClick} aria-label="Promo banner">
      <Link href={href} useLegacyRouting data-testid={id}>
        <Image
          src={image}
          alt="Banner image"
          fill={false}
          width="0"
          height="0"
          sizes="100vw"
          className="h-auto w-full"
          quality={75}
        />
      </Link>
    </button>
  );
};

export default PromoBanner;
