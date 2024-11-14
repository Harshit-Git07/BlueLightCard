import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { useCallback } from 'react';

export function useReturnToVerificationScreen(
  eligibilityDetailsState: EligibilityDetailsState
): () => void {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  return useCallback(() => {
    setEligibilityDetailsState({
      ...eligibilityDetails,
      currentScreen: 'Verification Method Screen',
    });
  }, [eligibilityDetails, setEligibilityDetailsState]);
}
