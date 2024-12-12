import { fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import React, { FC } from 'react';
import PresentIcon from '@assets/present-frame.svg';
import PresentIconDDS from '@assets/phone-frame-dds.svg';
import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';
import { textContainerStyles } from '@/root/src/member-eligibility/renewal/modal/frames/utils/TextContainerStyles';

interface Props {
  isMobile?: boolean;
}

export const PresentFrame: FC<Props> = ({ isMobile = false }) => {
  const Icon = BRAND === BRANDS.DDS_UK ? PresentIconDDS : PresentIcon;

  const containerStyles = textContainerStyles(isMobile);

  const font = isMobile ? fonts.bodySemiBold : fonts.titleMediumSemiBold;

  return (
    <div className={containerStyles}>
      <Icon className={isMobile ? 'w-[64px] h-[48px]' : ''} />

      <div className={`${font} pb-[8px]`}>
        <span className="text-colour-onSurface-subtle"> Benefit from </span>
        thousands of discounts from holidays to dining out.
      </div>
    </div>
  );
};
