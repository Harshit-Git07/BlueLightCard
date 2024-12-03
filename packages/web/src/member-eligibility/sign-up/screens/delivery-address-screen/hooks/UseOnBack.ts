import { useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { deliveryAddressEvents } from '@/root/src/member-eligibility/sign-up/screens/delivery-address-screen/amplitude-events/DeliveryAddress';

type OnBackCallback = () => void;

export function useOnBack(eligibilityDetailsState: EligibilityDetailsState): OnBackCallback {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;
  const logAnalyticsEvent = useLogAmplitudeEvent();

  return useCallback(() => {
    logAnalyticsEvent(deliveryAddressEvents.onBackClicked(eligibilityDetails));
    if (eligibilityDetails.canSkipIdVerification) {
      setEligibilityDetails({
        ...eligibilityDetails,
        currentScreen: 'Job Details Screen',
      });
      return;
    }

    setEligibilityDetails({
      ...eligibilityDetails,
      currentScreen: 'Verification Method Screen',
    });
  }, [eligibilityDetails, logAnalyticsEvent, setEligibilityDetails]);
}
