import { useMemo } from 'react';
import { useIsAusBrand } from '@/root/src/member-eligibility/shared/hooks/use-is-aus-brand/UseIsAusBrand';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

export function useIsNextButtonDisabled(eligibilityDetails: EligibilityDetails): boolean {
  const isAus = useIsAusBrand();
  const isHealthcareAlliedHealth =
    isAus && eligibilityDetails.organisation?.label === 'Healthcare Allied Health';

  return useMemo(() => {
    if (!isAus) {
      return (
        eligibilityDetails.jobTitle === undefined ||
        eligibilityDetails.jobTitle.length <= 2 ||
        !/^[a-zA-Z0-9\s]+$/.test(eligibilityDetails.jobTitle)
      );
    }

    if (isHealthcareAlliedHealth && eligibilityDetails.jobDetailsAus?.isSelfEmployed) {
      const abn = eligibilityDetails.jobDetailsAus?.australianBusinessNumber;
      const cleanABN = abn?.replace(/[^\d]/g, '');

      return !(
        abn !== undefined &&
        cleanABN !== undefined &&
        cleanABN.length === 11 &&
        /^\d+$/.test(cleanABN)
      );
    }

    return (
      eligibilityDetails.jobTitle === undefined ||
      eligibilityDetails.jobTitle.length <= 2 ||
      !/^[a-zA-Z0-9\s]+$/.test(eligibilityDetails.jobTitle)
    );
  }, [eligibilityDetails, isAus, isHealthcareAlliedHealth]);
}
