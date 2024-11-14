import { useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';

type Callback = (organisation: string) => void;

export function useOnOrganisationChanged(
  eligibilityDetailsState: EligibilityDetailsState
): Callback {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  return useCallback(
    (organisation) => {
      // TODO: This is added so that multi-id can be tested on mobile, it will be removed later
      if (organisation === 'Multi-ID stub') {
        setEligibilityDetailsState({
          ...eligibilityDetails,
          requireMultipleIds: true,
          organisation,
        });
        return;
      }

      setEligibilityDetailsState({
        ...eligibilityDetails,
        organisation,
      });
    },
    [eligibilityDetails, setEligibilityDetailsState]
  );
}
