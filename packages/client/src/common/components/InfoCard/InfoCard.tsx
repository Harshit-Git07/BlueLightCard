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
            fill
            sizes={imageSizes}
          />
        </div>
      )}
      <div className="p-4">
        <h4 className="text-xl mb-2 font-semibold text-center text-infoCard-text-title">{title}</h4>
        <p className="mb-2 text-center text-infoCard-text-p">{text}</p>
      </div>
    </div>
  );
};

export default InfoCard;
