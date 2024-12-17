import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

const justLettersAndNumbers = /^[a-zA-Z0-9\s]+$/;

export function validateJobTitle(eligibilityDetails: EligibilityDetails): boolean {
  if (!shouldValidate(eligibilityDetails)) return true;

  const jobTitle = eligibilityDetails.jobTitle;
  if (!jobTitle) return false;

  return jobTitle.length >= 3 && justLettersAndNumbers.test(jobTitle);
}

function shouldValidate(eligibilityDetails: EligibilityDetails): boolean {
  const shouldValidateBasedOnEmployer =
    eligibilityDetails.employer?.requiresJobTitle !== undefined &&
    eligibilityDetails.employer.requiresJobTitle;

  const shouldValidateBasedOnOrganisation =
    eligibilityDetails.organisation?.requiresJobTitle !== undefined &&
    eligibilityDetails.organisation.requiresJobTitle;

  return shouldValidateBasedOnEmployer || shouldValidateBasedOnOrganisation;
}
