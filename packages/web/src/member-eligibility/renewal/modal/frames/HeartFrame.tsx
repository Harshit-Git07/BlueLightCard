import React, { FC } from 'react';
import HeartIcon from '@assets/heart-frame.svg';
import HeartIconDDS from '@assets/heart-frame-dds.svg';
import { textContainerStyles } from '@/root/src/member-eligibility/renewal/modal/frames/utils/TextContainerStyles';
import { BRAND } from '@bluelightcard/shared-ui/global-vars';
import { BRANDS } from '@/types/brands.enum';
import { fonts } from '@bluelightcard/shared-ui/tailwind/theme';

interface Props {
  isMobile?: boolean;
}

export const HeartFrame: FC<Props> = ({ isMobile = false }) => {
  const Icon = BRAND === BRANDS.DDS_UK ? HeartIconDDS : HeartIcon;

  const containerStyles = textContainerStyles(isMobile);

  const font = isMobile ? fonts.bodySemiBold : fonts.titleMediumSemiBold;

  return (
    <div className={containerStyles}>
      <Icon className={isMobile ? 'w-[64px] h-[48px]' : ''} />

      <div className={`${font} pb-[8px]`}>
        Join our community of members.{' '}
        <span className="text-colour-onSurface-subtle"> Connect, share & thrive.</span>
      </div>
    </div>
  );
};
