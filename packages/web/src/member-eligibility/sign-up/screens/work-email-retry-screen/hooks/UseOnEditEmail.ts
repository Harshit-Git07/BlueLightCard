import { useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';

export function useOnEditEmail(eligibilityDetailsState: EligibilityDetailsState) {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  return useCallback(() => {
    setEligibilityDetailsState({
      ...eligibilityDetails,
      currentScreen: 'Work Email Verification Screen',
      emailVerification: eligibilityDetails.emailVerification,
    });
  }, [eligibilityDetails, setEligibilityDetailsState]);
}
