import React, { FC } from 'react';
import HeartIcon from '../../../../assets/heart-frame.svg';
import HeartIconDDS from '../../../../assets/heart-frame-dds.svg';
import { BRAND } from '../../../../types';
import { env } from '../../../../env';
import { textContainerStyles } from './utils/TextContainerStyles';
import { fonts } from '../../../../tailwind/theme';

interface Props {
  isMobile?: boolean;
}

export const HeartFrame: FC<Props> = ({ isMobile = false }) => {
  const Icon = env.APP_BRAND === BRAND.DDS_UK ? HeartIconDDS : HeartIcon;

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
