import { useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';

type OnBackCallback = () => void;

export function useOnBack(eligibilityDetailsState: EligibilityDetailsState): OnBackCallback {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  return useCallback(() => {
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
  }, [eligibilityDetails, setEligibilityDetails]);
}
