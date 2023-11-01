import React, { FC } from 'react';
import { VerifyInfoCardProps } from './types';
import Image from '@/components/Image/Image';

const VerifyInfoCard: FC<VerifyInfoCardProps> = ({ title, children, imageSrc, imageAlt }) => {
  return (
    <div className="w-full min-h-[420px] flex justify-center mx-auto">
      <div className="bg-palette-body-text-opacity-30%/5 p-6 flex h-full flex-col space-y-4 rounded-xl">
        <Image
          width={82}
          height={80}
          className="object-contain"
          responsive={false}
          src={imageSrc}
          alt={imageAlt}
        />
        <h3 className="font-semibold text-2xl text-palette-body-text font-[MuseoSans]">{title}</h3>
        <p className="font-[MuseoSans] text-palette-body-text-DEFAULT leading-7 text-xl">
          {children}
        </p>
      </div>
    </div>
  );
};

export default VerifyInfoCard;
