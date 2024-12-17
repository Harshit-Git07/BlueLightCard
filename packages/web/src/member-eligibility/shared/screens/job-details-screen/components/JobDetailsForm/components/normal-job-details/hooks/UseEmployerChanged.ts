import { useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { EligibilityEmployer } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { DropdownOption } from '@bluelightcard/shared-ui/components/Dropdown/types';

type Callback = (employer: DropdownOption) => void;

export function useEmployerChanged(
  eligibilityDetailsState: EligibilityDetailsState,
  employers: EligibilityEmployer[] | undefined
): Callback {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  return useCallback(
    (selectedOption) => {
      if (!employers) return;

      const employer = employers.find((employer) => employer.id === selectedOption.id);
      if (!employer) return;

      setEligibilityDetailsState({
        ...eligibilityDetails,
        employer,
        currentIdRequirementDetails:
          employer.idRequirements ?? eligibilityDetails.currentIdRequirementDetails,
      });
    },
    [eligibilityDetails, employers, setEligibilityDetailsState]
  );
}
