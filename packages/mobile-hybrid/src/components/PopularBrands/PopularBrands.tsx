import React, { FC } from 'react';
import { PopularBrandsProps } from './types';
import Image from '@/components/Image/Image';
import Heading from '../Heading/Heading';
import { cssUtil } from '@/utils/cssUtil';
import useDebounce from '@/hooks/useDebounce';

const PopularBrands: FC<PopularBrandsProps> = ({
  rounded = true,
  title,
  brands,
  onBrandItemClick,
  onInteracted,
  text,
}) => {
  const throttle = useDebounce(() => {
    if (onInteracted) {
      onInteracted();
    }
  }, 750);
  const imageWrapperClass = cssUtil([
    'mx-2 inline-block relative h-[74px] overflow-hidden shadow-md',
    rounded ? 'rounded-full w-[74px]' : 'rounded w-[144px]',
  ]);
  const imageClass = cssUtil([
    'object-contain dark:border',
    rounded ? 'rounded-full' : 'object-cover rounded',
  ]);

  return (
    <div className="mb-6">
      <Heading title={title} />
      <p className="px-4 mb-3 dark:text-neutral-white">{text}</p>
      <div className="ml-2 flex overflow-x-auto items-center h-[100px]" onScroll={throttle}>
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
    </div>
  );
};

export default PopularBrands;
