import { useMemo } from 'react';
import { useIsAusBrand } from '@/root/src/member-eligibility/shared/hooks/use-is-aus-brand/UseIsAusBrand';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { validateJobTitle } from '@/root/src/member-eligibility/shared/screens/job-details-screen/validation/JobTitleValidation';
import { validateAustralianBusinessNumber } from '@/root/src/member-eligibility/shared/screens/job-details-screen/validation/AustralianBusinessNumberValidation';
import { validateJobReference } from '@/root/src/member-eligibility/shared/screens/job-details-screen/validation/JobReferenceValidation';

export function useIsNextButtonEnabled(eligibilityDetails: EligibilityDetails): boolean {
  const isAus = useIsAusBrand();
  const isHealthcareAlliedHealth =
    isAus && eligibilityDetails.organisation?.label === 'Healthcare Allied Health';

  return useMemo(() => {
    if (isHealthcareAlliedHealth && eligibilityDetails.jobDetailsAus?.isSelfEmployed) {
      return validateAustralianBusinessNumber(eligibilityDetails);
    }

    return validateJobTitle(eligibilityDetails) && validateJobReference(eligibilityDetails);
  }, [eligibilityDetails, isHealthcareAlliedHealth]);
}
