import React, { FC, useMemo } from 'react';
import { useMobileMediaQuery } from '@bluelightcard/shared-ui/hooks/useMediaQuery';
import { fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

interface Props {
  className?: string;
  eligibilityDetails: EligibilityDetails;
}

export const InterstitialSubTitle: FC<Props> = ({ className = '', eligibilityDetails }) => {
  const isMobile = useMobileMediaQuery();

  const text = useMemo(() => {
    if (eligibilityDetails.flow === 'Sign Up') {
      return 'Please complete the following\n to start saving';
    }

    return 'Please complete the following\n to continue saving';
  }, [eligibilityDetails.flow]);

  const subtitleStyles = useMemo(() => {
    const font = isMobile ? fonts.titleMedium : fonts.titleLarge;

    return `${className} ${font} text-center`;
  }, [className, isMobile]);

  return <pre className={subtitleStyles}>{text}</pre>;
};
