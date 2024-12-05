import {
  EligibilityDetailsState,
  useEligibilityDetails,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import {
  EligibilityDetails,
  EligibilityDetailsWithoutFlow,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

// TODO: This is stubbed out until we make a real service layer call to fill this in
export const eligibilityDetailsStub: EligibilityDetails = {
  flow: 'Sign Up',
  currentScreen: 'Interstitial Screen',
};

export function useSignupEligibilityDetails(
  initialState: EligibilityDetailsWithoutFlow = eligibilityDetailsStub
): EligibilityDetailsState {
  return useEligibilityDetails({
    ...initialState,
    flow: 'Sign Up',
  });
}
