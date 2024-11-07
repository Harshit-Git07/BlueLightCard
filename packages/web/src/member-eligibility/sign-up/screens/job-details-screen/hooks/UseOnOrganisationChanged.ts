import { useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';

export function useOnOrganisationChanged(eligibilityDetailsState: EligibilityDetailsState) {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;
  const onOrganisationSelected = useCallback(
    (organisation: string) => {
      setEligibilityDetailsState({
        ...eligibilityDetails,
        organisation,
      });
    },
    [eligibilityDetails, setEligibilityDetailsState]
  );

  return { onOrganisationSelected };
}
