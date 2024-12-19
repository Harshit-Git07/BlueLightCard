import React, { FC } from 'react';
import PresentIcon from '@assets/present-frame.svg';
import PresentIconDDS from '@assets/present-frame-dds.svg';
import { textContainerStyles } from '@/root/src/member-eligibility/renewal/modal/frames/utils/TextContainerStyles';
import { BRAND } from '@bluelightcard/shared-ui/global-vars';
import { BRANDS } from '@/types/brands.enum';
import { fonts } from '@bluelightcard/shared-ui/tailwind/theme';

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
