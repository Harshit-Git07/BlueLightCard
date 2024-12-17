import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

const justNumbers = /^\d+$/;

export function validateJobReference(eligibilityDetails: EligibilityDetails): boolean {
  if (!shouldValidate(eligibilityDetails)) return true;

  const jobReference = eligibilityDetails.jobReference;
  if (!jobReference) return false;

  return jobReference.length >= 3 && justNumbers.test(jobReference);
}

function shouldValidate(eligibilityDetails: EligibilityDetails): boolean {
  const shouldValidateBasedOnEmployer =
    eligibilityDetails.employer?.requiresJobReference !== undefined &&
    eligibilityDetails.employer.requiresJobReference;

  const shouldValidateBasedOnOrganisation =
    eligibilityDetails.organisation?.requiresJobReference !== undefined &&
    eligibilityDetails.organisation.requiresJobReference;

  return shouldValidateBasedOnEmployer || shouldValidateBasedOnOrganisation;
}
