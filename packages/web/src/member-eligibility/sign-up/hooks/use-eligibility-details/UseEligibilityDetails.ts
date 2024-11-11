import { Dispatch, useCallback, useState } from 'react';
import { EligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-eligibility-details/types/EligibilityDetails';

// TODO: This is stubbed out until we make a real service layer call to fill this in
export const eligibilityDetailsStub: EligibilityDetails = {
  currentScreen: 'Interstitial Screen',
};

export function useEligibilityDetails(
  initialState = eligibilityDetailsStub
): [EligibilityDetails, Dispatch<EligibilityDetails>] {
  // TODO: A service layer call should happen here to build the initial state, but it's request / response will be mapped to and from our internal type
  const [eligibilityDetails, setEligibilityDetails] = useState(initialState);

  const onEligibilityDetailsChanged: Dispatch<EligibilityDetails> = useCallback((newState) => {
    console.log(newState);
    setEligibilityDetails(newState);
  }, []);

  return [eligibilityDetails, onEligibilityDetailsChanged];
}
