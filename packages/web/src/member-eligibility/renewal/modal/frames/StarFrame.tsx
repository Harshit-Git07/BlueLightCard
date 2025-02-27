import React, { FC } from 'react';
import StarIcon from '@assets/star-frame.svg';
import StarIconDDS from '@assets/star-frame-dds.svg';
import { textContainerStyles } from '@/root/src/member-eligibility/renewal/modal/frames/utils/TextContainerStyles';
import { BRAND } from '@bluelightcard/shared-ui/global-vars';
import { BRANDS } from '@/types/brands.enum';
import { fonts } from '@bluelightcard/shared-ui/tailwind/theme';

interface Props {
  isMobile?: boolean;
}

export const StarFrame: FC<Props> = ({ isMobile = false }) => {
  const Icon = BRAND === BRANDS.DDS_UK ? StarIconDDS : StarIcon;

  const containerStyles = textContainerStyles(isMobile);

  const font = isMobile ? fonts.bodySemiBold : fonts.titleMediumSemiBold;

  return (
    <div className={containerStyles}>
      <Icon className={isMobile ? 'w-[64px] h-[48px]' : ''} />

      <div className={`${font} pb-[8px]`}>
        <span className="text-colour-onSurface-subtle"> Get access to exclusive </span>
        offers, freebies and amazing experiences.
      </div>
    </div>
  );
};
