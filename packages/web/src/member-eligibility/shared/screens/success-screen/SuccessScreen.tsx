import React, { FC } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { useMobileMediaQuery } from '@bluelightcard/shared-ui/hooks/useMediaQuery';
import { SuccessScreenMobileView } from '@/root/src/member-eligibility/shared/screens/success-screen/SuccessScreenMobile';
import { SuccessModal } from '@/root/src/member-eligibility/shared/screens/success-screen/SuccessModal';

export const SuccessScreen: FC<VerifyEligibilityScreenProps> = () => {
  const isMobile = useMobileMediaQuery();

  if (isMobile) {
    return <SuccessScreenMobileView />;
  }
  return <SuccessModal />;
};
