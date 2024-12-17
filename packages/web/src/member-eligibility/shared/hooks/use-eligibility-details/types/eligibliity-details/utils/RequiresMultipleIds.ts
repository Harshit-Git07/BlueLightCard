import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

export function requiresMultipleIds(eligibilityDetails: EligibilityDetails): boolean {
  if (!eligibilityDetails.currentIdRequirementDetails) return false;

  return eligibilityDetails.currentIdRequirementDetails.some((idRequirements) => {
    return idRequirements.required;
  });
}
