import React, { FC } from 'react';
import { VerifyInfoCardProps } from './types';
import Image from '@/components/Image/Image';

const VerifyInfoCard: FC<VerifyInfoCardProps> = ({ title, imageSrc, imageAlt, children }) => {
  return (
    <div className="max-w-[340px] w-full text-center mx-auto px-4 py-4">
      <Image
        width={200}
        height={200}
        responsive={false}
        src={imageSrc}
        alt={imageAlt}
        className="mx-auto"
      />
      <h2 className="font-semibold text-2xl text-palette-body-text font-[MuseoSans] mb-2">
        {title}
      </h2>
      <p className="font-[MuseoSans] text-surface-50-dark/60 text-sm text-center leading-4">
        {children}
      </p>
    </div>
  );
};

export default VerifyInfoCard;
