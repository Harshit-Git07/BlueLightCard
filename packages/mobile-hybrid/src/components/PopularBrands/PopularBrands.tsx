import React, { FC } from 'react';
import { PopularBrandsProps } from './types';
import Image from '@/components/Image/Image';
import Heading from '../Heading/Heading';
import { cssUtil } from '@/utils/cssUtil';
import useDebounce from '@/hooks/useDebounce';

import { useAmplitude } from '@/hooks/useAmplitude';
import { Experiments } from '@/components/AmplitudeProvider/amplitudeKeys';

const { POPULAR_BRANDS_INLINE_LAYOUT } = Experiments;

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
    'popular-brands mx-2 inline-block relative h-[74px] overflow-hidden shadow-md',
    rounded ? 'rounded-full w-[74px]' : 'rounded w-[144px]',
  ]);

  const imageClass = cssUtil([
    'object-contain dark:border',
    rounded ? 'rounded-full' : 'object-cover rounded',
  ]);

  const { is } = useAmplitude();

  return (
    <div className="mb-6">
      <Heading title={title} />
      <p className="px-4 mb-4 dark:text-neutral-white">{text}</p>
      {is(POPULAR_BRANDS_INLINE_LAYOUT, 'treatment') ? (
        <div onScroll={throttle}>
          <div className="grid grid-cols-4 gap-4 px-4 mx-[-0.5rem]">
            {brands.map((brand, index) => {
              if (index > 7) return; // limit to 8 items

              return (
                <button
                  key={brand.id}
                  className={imageWrapperClass}
                  onClick={() => onBrandItemClick?.(brand.id)}
                >
                  <Image src={brand.imageSrc} alt={brand.brandName} className={imageClass} />
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="ml-2 flex overflow-x-auto items-center h-[100px]" onScroll={throttle}>
          <div className="flex">
            {brands.map((brand) => (
              <button
                key={brand.id}
                className={imageWrapperClass}
                onClick={() => onBrandItemClick?.(brand.id)}
              >
                <Image src={brand.imageSrc} alt={brand.brandName} className={imageClass} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PopularBrands;
