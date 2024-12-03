import { useMemo } from 'react';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

export function useIsNextButtonDisabled(eligibilityDetails: EligibilityDetails): boolean {
  return useMemo(() => {
    //This checks if the job title is not empty and is at least 3 characters long and contains only letters, numbers and spaces
    return (
      eligibilityDetails.jobTitle !== undefined &&
      eligibilityDetails.jobTitle.length > 2 &&
      /^[a-zA-Z0-9\s]+$/.test(eligibilityDetails.jobTitle)
    );
  }, [eligibilityDetails]);
}
