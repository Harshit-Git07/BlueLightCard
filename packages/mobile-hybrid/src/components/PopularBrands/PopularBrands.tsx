import React, { FC } from 'react';
import { PopularBrandsProps } from './types';
import Image from '@/components/Image/Image';
import Heading from '../Heading/Heading';
import { cssUtil } from '@/utils/cssUtil';

const PopularBrands: FC<PopularBrandsProps> = ({
  rounded = true,
  title,
  brands,
  onBrandItemClick,
  text,
}) => {
  const imageWrapperClass = cssUtil([
    'mx-2 inline-block relative h-[74px] overflow-hidden shadow-md',
    rounded ? 'rounded-full w-[74px]' : 'rounded-3xl w-[120px]',
  ]);
  const imageClass = cssUtil([
    'object-contain dark:border',
    rounded ? 'rounded-full' : 'rounded-3xl',
  ]);
  return (
    <>
      <Heading title={title} />
      <p className="px-4 mb-3 font-museo dark:text-neutral-white">{text}</p>
      <div className="ml-2 flex overflow-x-auto items-center h-[100px]">
        <div className="flex">
          {brands.map((brand) => (
            <div
              key={brand.id}
              role="button"
              onClick={() => onBrandItemClick && onBrandItemClick(brand.id)}
              className={imageWrapperClass}
            >
              <Image src={brand.imageSrc} alt={brand.brandName} className={imageClass} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PopularBrands;
