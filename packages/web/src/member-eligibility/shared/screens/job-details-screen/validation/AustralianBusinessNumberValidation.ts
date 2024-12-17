import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

export function validateAustralianBusinessNumber(eligibilityDetails: EligibilityDetails): boolean {
  const abn = eligibilityDetails.jobDetailsAus?.australianBusinessNumber;
  if (!abn) return false;

  const withLettersRemoved = abn.replace(/\D/g, '');
  return withLettersRemoved.length === 11 && /^\d+$/.test(withLettersRemoved);
}
