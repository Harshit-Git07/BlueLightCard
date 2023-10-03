import React, { FC } from 'react';
import { PopularBrandsProps } from './types';
import Image from '@/components/Image/Image';
import Heading from '../Heading/Heading';

const PopularBrands: FC<PopularBrandsProps> = ({ brands, onBrandItemClick, text }) => {
  return (
    <>
      <Heading title="Popular Brands" />
      <p className="px-4 mb-3 font-museo dark:text-neutral-white">{text}</p>
      <div className="ml-2 flex overflow-x-auto items-center h-[100px] snap-x scroll-auto">
        <div className="flex">
          {brands.map((brand) => (
            <div
              key={brand.id}
              role="button"
              onClick={() => onBrandItemClick && onBrandItemClick(brand.id)}
              className="mx-2 inline-block relative h-[74px] w-[74px] rounded-full shadow-md"
            >
              <Image
                src={brand.imageSrc}
                alt={brand.brandName}
                className="object-cover rounded-full dark:border"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PopularBrands;
