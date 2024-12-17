import { ChangeEventHandler, useCallback, useMemo } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { validateJobTitle } from '@/root/src/member-eligibility/shared/screens/job-details-screen/validation/JobTitleValidation';
import { EligibilityEmployer } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

interface Result {
  showJobTitleField: boolean;
  isValidJobTitle: boolean;
  onJobTitleFieldChanged: Callback;
}

type Callback = ChangeEventHandler<HTMLInputElement>;

export function useJobTitleField(
  eligibilityDetailsState: EligibilityDetailsState,
  employers?: EligibilityEmployer[]
): Result {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  const showJobTitleField = useMemo(() => {
    if (employers !== undefined && employers.length > 1 && !eligibilityDetails.employer) {
      return false;
    }

    if (eligibilityDetails.employer?.requiresJobTitle !== undefined) {
      return eligibilityDetails.employer.requiresJobTitle;
    }

    return eligibilityDetails.organisation?.requiresJobTitle ?? false;
  }, [eligibilityDetails.employer, eligibilityDetails.organisation?.requiresJobTitle, employers]);

  const isValidJobTitle = useMemo(() => {
    return validateJobTitle(eligibilityDetails);
  }, [eligibilityDetails]);

  const onJobTitleFieldChanged: Callback = useCallback(
    (event) => {
      const jobTitle = event.target.value;
      setEligibilityDetailsState({
        ...eligibilityDetails,
        jobTitle,
      });
    },
    [eligibilityDetails, setEligibilityDetailsState]
  );

  return {
    showJobTitleField,
    isValidJobTitle,
    onJobTitleFieldChanged,
  };
}
