import { Dispatch, useCallback, useState } from 'react';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';

export function useEligibilityDetails(
  initialState: EligibilityDetails
): [EligibilityDetails, Dispatch<EligibilityDetails>] {
  // TODO: A service layer call should happen here to build the initial state, but it's request / response will be mapped to and from our internal type
  const [eligibilityDetails, setEligibilityDetails] = useState(initialState);

  const onEligibilityDetailsChanged: Dispatch<EligibilityDetails> = useCallback((newState) => {
    // Just logging out the state for debugging, this can be removed later
    console.log(newState);
    setEligibilityDetails(newState);
  }, []);

  return [eligibilityDetails, onEligibilityDetailsChanged];
}
