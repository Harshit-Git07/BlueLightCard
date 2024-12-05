import { fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import React, { FC } from 'react';
import PhoneIcon from 'assets/phone-frame.svg';
import PhoneIconDDS from '@assets/phone-frame-dds.svg';
import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';
import { textContainerStyles } from '@/root/src/member-eligibility/renewal/modal/frames/utils/TextContainerStyles';

interface Props {
  isMobile?: boolean;
}

export const PhoneFrame: FC<Props> = ({ isMobile = false }) => {
  const Icon = BRAND === BRANDS.DDS_UK ? PhoneIconDDS : PhoneIcon;

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
