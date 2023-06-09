import { FC } from 'react';
import { InfoCardProps } from './types';
import Image from 'next/image';
import { ASSET_PREFIX } from '@/global-vars';

const InfoCard: FC<InfoCardProps> = ({
  title,
  text,
  imageSrc,
  imageSizes,
  assetPrefix = ASSET_PREFIX,
}) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-md max-w-[300px]">
      {imageSrc && (
        <div className="relative pb-[50%]">
          <Image
            className="object-cover text-center"
            src={`${assetPrefix}/${imageSrc}`}
            alt="image"
            unoptimized
            fill
            sizes={imageSizes}
          />
        </div>
      )}
      <div className="bg-palette-white">
        <h4 className="text-xl py-4 font-semibold text-center text-font-neutral-base dark:text-font-neutral-base">
          {title}
        </h4>
        <p className="pb-4 text-center text-palette-neutral-base dark:text-palette-neutral-base">
          {text}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
