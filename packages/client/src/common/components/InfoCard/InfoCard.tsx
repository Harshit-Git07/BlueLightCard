import { FC } from 'react';
import { InfoCardProps } from './types';
import Image from 'next/image';

const InfoCard: FC<InfoCardProps> = ({ title, text, imageSrc, imageSizes }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-md max-w-sm">
      {imageSrc && (
        <div className="relative pb-[50%]">
          <Image
            className="object-cover text-center"
            src={imageSrc}
            alt="image"
            fill
            sizes={imageSizes}
          />
        </div>
      )}
      <div className="p-4">
        <h4 className="text-xl mb-2 font-semibold text-center">{title}</h4>
        <p className="mb-2 text-center text-neutrals-type-1-700">{text}</p>
      </div>
    </div>
  );
};

export default InfoCard;
