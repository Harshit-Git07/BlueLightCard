import React, { FC } from 'react';
import PresentIcon from '../../../../assets/present-frame.svg';
import PresentIconDDS from '../../../../assets/present-frame-dds.svg';
import { env } from '../../../../env';
import { BRAND } from '../../../../types';
import { textContainerStyles } from './utils/TextContainerStyles';
import { fonts } from '../../../../tailwind/theme';

interface Props {
  isMobile?: boolean;
}

export const PresentFrame: FC<Props> = ({ isMobile = false }) => {
  const Icon = env.APP_BRAND === BRAND.DDS_UK ? PresentIconDDS : PresentIcon;

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
