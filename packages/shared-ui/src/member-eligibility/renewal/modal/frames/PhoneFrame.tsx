import React, { FC } from 'react';
import PhoneIcon from '../../../../assets/phone-frame.svg';
import PhoneIconDDS from '../../../../assets/phone-frame-dds.svg';
import { env } from '../../../../env';
import { textContainerStyles } from './utils/TextContainerStyles';
import { fonts } from '../../../../tailwind/theme';
import { BRAND } from '../../../../types';

interface Props {
  isMobile?: boolean;
}

export const PhoneFrame: FC<Props> = ({ isMobile = false }) => {
  const Icon = env.APP_BRAND === BRAND.DDS_UK ? PhoneIconDDS : PhoneIcon;

  const containerStyles = textContainerStyles(isMobile);

  const font = isMobile ? fonts.bodySemiBold : fonts.titleMediumSemiBold;

  return (
    <div className={containerStyles}>
      <Icon className={isMobile ? 'w-[64px] h-[48px]' : ''} />

      <div className={`${font} pb-[8px]`}>
        <span className="text-colour-onSurface-subtle"> Save anytime, anywhere </span>
        on web & app, online & in person.
      </div>
    </div>
  );
};
