import React, { FC, useCallback, useMemo } from 'react';
import { useMediaQuery, useMobileMediaQuery } from '@bluelightcard/shared-ui/hooks/useMediaQuery';
import { SuccessModalDesktop } from '@/root/src/member-eligibility/shared/screens/success-screen/components/SuccessModalDesktop';
import { useLogAnalyticsPageView } from '@/root/src/member-eligibility/shared/hooks/use-ampltude-event-log/UseAmplitudePageLog';
import { SuccessModelMobile } from '@/root/src/member-eligibility/shared/screens/success-screen/components/SuccessScreenMobile';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { useEligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { useRouter } from 'next/router';

interface Props {
  initialState?: EligibilityDetails;
  forceMobileView?: boolean;
}

export const SuccessScreen: FC<Props> = ({ forceMobileView, initialState }) => {
  const eligibilityDetailsState = useEligibilityDetails(
    initialState ?? {
      flow: 'Sign Up',
      currentScreen: 'Success Screen',
    }
  );

  const [eligibilityDetails] = eligibilityDetailsState;

  useLogAnalyticsPageView(eligibilityDetails);

  const router = useRouter();

  const isMobileInPortraitMode = useMediaQuery('(max-height: 600px) and (orientation: landscape)');
  const isMobile = useMobileMediaQuery();

  const useMobileView = useMemo(() => {
    return forceMobileView ?? (isMobile || isMobileInPortraitMode);
  }, [forceMobileView, isMobile, isMobileInPortraitMode]);

  const onClose = useCallback(() => {
    router.push('/members-home');
  }, [router]);

  if (useMobileView) {
    return (
      <SuccessModelMobile eligibilityDetailsState={eligibilityDetailsState} onClose={onClose} />
    );
  }

  return (
    <SuccessModalDesktop eligibilityDetailsState={eligibilityDetailsState} onClose={onClose} />
  );
};
