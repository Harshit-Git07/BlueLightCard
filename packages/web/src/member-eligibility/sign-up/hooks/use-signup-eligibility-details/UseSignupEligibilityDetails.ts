import { Dispatch } from 'react';
import { useEligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';

// TODO: This is stubbed out until we make a real service layer call to fill this in
export const eligibilityDetailsStub: EligibilityDetails = {
  flow: 'Sign Up',
  currentScreen: 'Interstitial Screen',
};

type WithoutFlow = Omit<EligibilityDetails, 'flow'>;

export function useSignupEligibilityDetails(
  initialState: WithoutFlow = eligibilityDetailsStub
): [EligibilityDetails, Dispatch<EligibilityDetails>] {
  return useEligibilityDetails({
    ...initialState,
    flow: 'Sign Up',
  });
}
