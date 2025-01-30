import React from 'react';
import { Brand } from './types';
import Image from '@/components/Image/Image';

interface Props {
  brands: Brand[];
  limit?: number;
  imageWrapperClass: string;
  imageClass: string;
  onButtonClick?: (data: any) => void;
}

const PopularBrandsButtons: React.FC<Props> = ({
  brands,
  limit,
  imageWrapperClass,
  imageClass,
  onButtonClick,
}: Props) => {
  return (
    <>
      {brands.map((brand: any, index: any) => {
        if (limit && index > limit) return; // limit to 8 items

        return (
          <button
            key={brand.id}
            className={imageWrapperClass}
            onClick={() => onButtonClick?.(brand.id)}
            aria-label={brand.brandName}
          >
            <Image src={brand.imageSrc} alt={brand.brandName} className={imageClass} />
          </button>
        );
      })}
    </>
  );
};

export default PopularBrandsButtons;
