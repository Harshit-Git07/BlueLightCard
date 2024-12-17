import { useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { EligibilityOrganisation } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { DropdownOption } from '@bluelightcard/shared-ui/components/Dropdown/types';

type Callback = (organisation: DropdownOption) => void;

export function useOnOrganisationChanged(
  eligibilityDetailsState: EligibilityDetailsState,
  organisations: EligibilityOrganisation[]
): Callback {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  return useCallback(
    (selectedOption) => {
      const organisation = organisations.find(
        (organisation) => organisation.id === selectedOption.id
      );
      if (!organisation) return;

      setEligibilityDetailsState({
        ...eligibilityDetails,
        employer: undefined,
        jobTitle: undefined,
        organisation,
        currentIdRequirementDetails: organisation.idRequirements,
      });
    },
    [eligibilityDetails, organisations, setEligibilityDetailsState]
  );
}
