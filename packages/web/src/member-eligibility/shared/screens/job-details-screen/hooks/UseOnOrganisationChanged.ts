import { useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { EligibilityOrganisation } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';
import { organisationMultiIdStub } from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/use-organisations/stubs/OrganisationStubs';

type Callback = (organisation: EligibilityOrganisation) => void;

export function useOnOrganisationChanged(
  eligibilityDetailsState: EligibilityDetailsState
): Callback {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  return useCallback(
    (organisation) => {
      // TODO: This is added so that multi-id can be tested on mobile, it will be removed later
      if (organisation.id === organisationMultiIdStub.id) {
        setEligibilityDetailsState({
          ...eligibilityDetails,
          requireMultipleIds: true,
          organisation,
        });
        return;
      }

      setEligibilityDetailsState({
        ...eligibilityDetails,
        employer: undefined,
        jobTitle: undefined,
        organisation,
      });
    },
    [eligibilityDetails, setEligibilityDetailsState]
  );
}
