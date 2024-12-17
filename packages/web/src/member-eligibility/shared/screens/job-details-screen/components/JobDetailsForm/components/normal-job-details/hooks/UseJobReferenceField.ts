import { ChangeEventHandler, useCallback, useMemo } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { validateJobReference } from '@/root/src/member-eligibility/shared/screens/job-details-screen/validation/JobReferenceValidation';
import { EligibilityEmployer } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

interface Result {
  showJobReferenceField: boolean;
  isValidJobReference: boolean;
  onJobReferenceFieldChange: Callback;
}

type Callback = ChangeEventHandler<HTMLInputElement>;

export function useJobReferenceField(
  eligibilityDetailsState: EligibilityDetailsState,
  employers: EligibilityEmployer[] | undefined
): Result {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  const showJobReferenceField = useMemo(() => {
    if (employers !== undefined && employers.length > 1 && !eligibilityDetails.employer) {
      return false;
    }

    if (eligibilityDetails.employer?.requiresJobReference !== undefined) {
      return eligibilityDetails.employer.requiresJobReference;
    }

    return eligibilityDetails.organisation?.requiresJobReference ?? false;
  }, [
    eligibilityDetails.employer,
    eligibilityDetails.organisation?.requiresJobReference,
    employers,
  ]);

  const isValidJobReference = useMemo(() => {
    return validateJobReference(eligibilityDetails);
  }, [eligibilityDetails]);

  const onJobReferenceFieldChange: Callback = useCallback(
    (event) => {
      const jobReference = event.target.value;
      setEligibilityDetailsState({
        ...eligibilityDetails,
        jobReference,
      });
    },
    [eligibilityDetails, setEligibilityDetailsState]
  );

  return {
    showJobReferenceField,
    isValidJobReference,
    onJobReferenceFieldChange,
  };
}
