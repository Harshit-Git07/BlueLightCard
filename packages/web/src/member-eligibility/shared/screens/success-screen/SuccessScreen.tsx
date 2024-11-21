import React, { FC, useMemo } from 'react';
import { useMobileMediaQuery } from '@bluelightcard/shared-ui/hooks/useMediaQuery';
import { SuccessScreenMobileView } from '@/root/src/member-eligibility/shared/screens/success-screen/components/SuccessScreenMobile';
import { SuccessModalDesktop } from '@/root/src/member-eligibility/shared/screens/success-screen/components/SuccessModalDesktop';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';

interface Props extends VerifyEligibilityScreenProps {
  forceMobileView?: boolean;
}

export const SuccessScreen: FC<Props> = ({ forceMobileView, eligibilityDetailsState }) => {
  const isMobile = useMobileMediaQuery();

  const useMobileView = useMemo(() => {
    return forceMobileView ?? isMobile;
  }, [forceMobileView, isMobile]);

  if (useMobileView) {
    return <SuccessScreenMobileView eligibilityDetailsState={eligibilityDetailsState} />;
  }

  return <SuccessModalDesktop eligibilityDetailsState={eligibilityDetailsState} />;
};
